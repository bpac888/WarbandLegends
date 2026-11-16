-- Run AFTER accounts.sql. All writes and reads use the verified server API.
-- Never expose SUPABASE_SERVICE_ROLE_KEY in browser code or public hosting variables.
create table public.championship_teams (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check(length(display_name) between 1 and 24),
 attack_ids jsonb not null check(jsonb_array_length(attack_ids)=5),
 defense_ids jsonb not null check(jsonb_array_length(defense_ids)=5),
 defense_snapshot jsonb not null,
 updated_at timestamptz not null default now()
);
create table public.championship_seasons (
 week date primary key, closes_at timestamptz not null, finalized_at timestamptz
);
create table public.championship_standings (
 week date references public.championship_seasons(week),
 user_id uuid references auth.users(id) on delete cascade,
 display_name text not null,
 score integer not null default 0 check(score>=0), tier integer not null default 0 check(tier between 0 and 3),
 attack_wins integer not null default 0, attack_losses integer not null default 0,
 defense_wins integer not null default 0, defense_losses integer not null default 0,
 strikes integer not null default 0, last_win_at timestamptz,
 primary key(week,user_id)
);
create table public.championship_matches (
 id uuid primary key default gen_random_uuid(), week date not null references public.championship_seasons(week),
 attacker_id uuid not null references auth.users(id) on delete cascade,
 defender_id uuid not null references auth.users(id) on delete cascade,
 initial_state jsonb not null, status text not null default 'open' check(status in ('open','complete','expired')),
 outcome text check(outcome in ('victory','defeat','expired')), created_at timestamptz not null default now(),
 expires_at timestamptz not null, settled_at timestamptz,
 check(attacker_id<>defender_id)
);
create index championship_open_matches on public.championship_matches(status,expires_at);
create index championship_attacks on public.championship_matches(attacker_id,created_at);
create index championship_defenses on public.championship_matches(defender_id,settled_at desc);
create table public.championship_awards (
 week date not null references public.championship_seasons(week), user_id uuid not null references auth.users(id) on delete cascade,
 rank integer not null check(rank between 1 and 50), display_name text not null, rewards jsonb not null, snapshot jsonb not null,
 claimed boolean not null default false, primary key(week,user_id), unique(week,rank)
);
alter table public.championship_teams enable row level security;
alter table public.championship_seasons enable row level security;
alter table public.championship_standings enable row level security;
alter table public.championship_matches enable row level security;
alter table public.championship_awards enable row level security;
revoke all on public.championship_teams,public.championship_seasons,public.championship_standings,public.championship_matches,public.championship_awards from public,anon,authenticated;
grant all on public.championship_teams,public.championship_seasons,public.championship_standings,public.championship_matches,public.championship_awards to service_role;

grant select,update on public.player_saves to service_role;

create function public.championship_week() returns date language sql stable set search_path='' as $$
 select date_trunc('week',now() at time zone 'America/Los_Angeles')::date;
$$;
create function public.championship_event(w date,p uuid,event text) returns void language plpgsql set search_path='' as $$
declare s public.championship_standings; point_tier integer;
begin
 select * into strict s from public.championship_standings where week=w and user_id=p for update;
 if event='attack-win' then s.score:=s.score+30;s.attack_wins:=s.attack_wins+1;s.last_win_at:=now();
 elsif event='attack-loss' then s.score:=greatest(0,s.score-10);s.attack_losses:=s.attack_losses+1;
 elsif event='defense-win' then s.defense_wins:=s.defense_wins+1;
 elsif event='defense-loss' then s.score:=greatest(0,s.score-1);s.defense_losses:=s.defense_losses+1;
 else raise exception 'Unknown event'; end if;
 point_tier:=case when s.score>=600 then 3 when s.score>=300 then 2 when s.score>=120 then 1 else 0 end;
 s.tier:=case when event='attack-win' then point_tier else least(s.tier,point_tier) end;
 update public.championship_standings set score=s.score,tier=s.tier,attack_wins=s.attack_wins,attack_losses=s.attack_losses,defense_wins=s.defense_wins,defense_losses=s.defense_losses,strikes=0,last_win_at=s.last_win_at where week=w and user_id=p;
end;
$$;
-- Every state-changing entry point holds this lock. Closed weeks can never be
-- modified after their snapshot, even if no scheduler happened to run at midnight.
create function public.championship_maintain() returns date language plpgsql set search_path='' as $$
declare w date:=public.championship_week();m record;s record;
begin
 perform pg_advisory_xact_lock(732091);
 insert into public.championship_seasons(week,closes_at) values(w,((w+7)::timestamp at time zone 'America/Los_Angeles')) on conflict do nothing;
 for m in select * from public.championship_matches where status='open' and (expires_at<=now() or week<w) for update loop
  if exists(select 1 from public.championship_seasons where week=m.week and finalized_at is null) then perform public.championship_event(m.week,m.attacker_id,'attack-loss');end if;
  update public.championship_matches set status='expired',outcome='expired',settled_at=now() where id=m.id;
 end loop;
 for s in select week from public.championship_seasons where week<w and finalized_at is null order by week for update loop
  insert into public.championship_awards(week,user_id,rank,display_name,rewards,snapshot)
   select s.week,r.user_id,r.place,r.display_name,case r.place
    when 1 then '{"gems":1000,"gold":10000,"lootTickets":25}'::jsonb
    when 2 then '{"gems":750,"gold":7500,"lootTickets":20}'::jsonb
    when 3 then '{"gems":500,"gold":5000,"lootTickets":15}'::jsonb
    else case when r.place<=25 then '{"gems":250,"gold":2500,"lootTickets":10}'::jsonb else '{"gems":100,"gold":1000,"lootTickets":5}'::jsonb end end,to_jsonb(r)-'place'||jsonb_build_object('rank',r.place)
   from (select user_id,display_name,tier,score,attack_wins,row_number() over(order by score desc,attack_wins desc,last_win_at asc,user_id) as place from public.championship_standings where week=s.week and attack_wins>0) r where r.place<=50 on conflict do nothing;
  update public.championship_seasons set finalized_at=now() where week=s.week;
 end loop;
 return w;
end;
$$;
create function public.championship_dashboard(player uuid) returns jsonb language plpgsql set search_path='' as $$
declare w date:=public.championship_maintain();own_team public.championship_teams;stand jsonb;ranking jsonb;opponents jsonb;awards jsonb;hist jsonb;archive jsonb;place bigint;
begin
 select * into own_team from public.championship_teams where user_id=player;
 if own_team.user_id is not null then
  insert into public.championship_standings(week,user_id,display_name) values(w,player,own_team.display_name) on conflict do nothing;
 end if;
 select to_jsonb(s)-'user_id'-'week' into stand from public.championship_standings s where week=w and user_id=player;
 with ranked as (select user_id,display_name,tier,score,attack_wins,row_number() over(order by score desc,attack_wins desc,last_win_at asc,user_id) as rank from public.championship_standings where week=w and attack_wins>0)
 select coalesce(jsonb_agg(to_jsonb(r) order by r.rank),'[]'::jsonb) into ranking from ranked r where r.rank<=50;
 select r.rank into place from (select user_id,row_number() over(order by score desc,attack_wins desc,last_win_at asc,user_id) as rank from public.championship_standings where week=w and attack_wins>0) r where user_id=player;
 select coalesce(jsonb_agg(to_jsonb(r)),'[]'::jsonb) into opponents from (
  select t.user_id,t.display_name,t.defense_ids,coalesce(s.score,0) score,coalesce(s.tier,0) tier from public.championship_teams t left join public.championship_standings s on s.user_id=t.user_id and s.week=w
  where t.user_id<>player and (select count(*) from public.championship_matches m where m.attacker_id=player and m.defender_id=t.user_id and m.created_at>=((now() at time zone 'America/Los_Angeles')::date::timestamp at time zone 'America/Los_Angeles'))<3
  order by abs(coalesce(s.score,0)-coalesce((stand->>'score')::integer,0)),md5(t.user_id::text||w::text) limit 5) r;
 select coalesce(jsonb_agg(to_jsonb(a)-'user_id'-'display_name' order by week desc),'[]'::jsonb) into awards from public.championship_awards a where user_id=player;
 select coalesce(jsonb_agg(to_jsonb(m)),'[]'::jsonb) into hist from (select id,attacker_id,defender_id,outcome,settled_at from public.championship_matches where (attacker_id=player or defender_id=player) and status<>'open' order by settled_at desc limit 12) m;
 select jsonb_build_object('week',max(a.week),'rankings',coalesce(jsonb_agg(a.snapshot order by a.rank),'[]'::jsonb)) into archive from public.championship_awards a where a.week=(select max(week) from public.championship_seasons where finalized_at is not null);
 return jsonb_build_object('archive',archive,'preview',false,'playerId',player,'week',w,'closesAt',((w+7)::timestamp at time zone 'America/Los_Angeles'),'teams',case when own_team.user_id is null then null else jsonb_build_object('attack_ids',own_team.attack_ids,'defense_ids',own_team.defense_ids) end,'standing',coalesce(stand,'{}'::jsonb),'rank',place,'rankings',ranking,'opponents',opponents,'awards',awards,'history',hist);
end;
$$;
create function public.championship_publish(player uuid,player_name text,attack jsonb,defense jsonb,snapshot jsonb) returns jsonb language plpgsql set search_path='' as $$
begin
 perform public.championship_maintain();
 insert into public.championship_teams(user_id,display_name,attack_ids,defense_ids,defense_snapshot) values(player,player_name,attack,defense,snapshot)
 on conflict(user_id) do update set display_name=excluded.display_name,attack_ids=excluded.attack_ids,defense_ids=excluded.defense_ids,defense_snapshot=excluded.defense_snapshot,updated_at=now();
 update public.championship_standings set display_name=player_name where user_id=player and week=public.championship_week();
 return public.championship_dashboard(player);
end;
$$;
create function public.championship_start(player uuid,rival uuid,battle_id uuid,state jsonb,defense_updated timestamptz) returns jsonb language plpgsql set search_path='' as $$
declare w date:=public.championship_maintain();t public.championship_teams; own_team public.championship_teams;day_start timestamptz:=((now() at time zone 'America/Los_Angeles')::date::timestamp at time zone 'America/Los_Angeles');deadline timestamptz;
begin
 if player=rival then raise exception 'You cannot challenge your own defense';end if;
 select * into strict t from public.championship_teams where user_id=rival;
 select * into strict own_team from public.championship_teams where user_id=player;
 if t.updated_at<>defense_updated then raise exception 'This defense changed. Refresh the field';end if;
 if exists(select 1 from public.championship_matches where attacker_id=player and status='open') then raise exception 'Finish your current attack or wait for its timer to expire';end if;
 if (select count(*) from public.championship_matches where attacker_id=player and created_at>=day_start)>=20 then raise exception 'All 20 attacks used today. Return tomorrow';end if;
 if (select count(*) from public.championship_matches where attacker_id=player and defender_id=rival and created_at>=day_start)>=3 then raise exception 'You have already challenged this defense three times today';end if;
 insert into public.championship_standings(week,user_id,display_name) values(w,player,own_team.display_name),(w,rival,t.display_name) on conflict do nothing;
 deadline:=least(now()+interval '30 minutes',((w+7)::timestamp at time zone 'America/Los_Angeles'));
 insert into public.championship_matches(id,week,attacker_id,defender_id,initial_state,expires_at) values(battle_id,w,player,rival,state,deadline);
 return jsonb_build_object('id',battle_id,'state',state,'expiresAt',deadline,'opponent',t.display_name);
end;
$$;
create function public.championship_complete(player uuid,battle_id uuid,won boolean,surrender boolean default false) returns jsonb language plpgsql set search_path='' as $$
declare w date:=public.championship_maintain();m public.championship_matches;
begin
 select * into strict m from public.championship_matches where id=battle_id and attacker_id=player for update;
 if m.status='open' then
  if m.week<>w then raise exception 'This week has closed';end if;
  perform public.championship_event(w,player,case when won and not surrender then 'attack-win' else 'attack-loss' end);
  perform public.championship_event(w,m.defender_id,case when won and not surrender then 'defense-loss' else 'defense-win' end);
  update public.championship_matches set status='complete',outcome=case when won and not surrender then 'victory' else 'defeat' end,settled_at=now() where id=battle_id returning * into m;
 end if;
 return jsonb_build_object('outcome',m.outcome,'dashboard',public.championship_dashboard(player));
end;
$$;
create function public.championship_claim(player uuid,reward_week date,expected_revision bigint) returns jsonb language plpgsql set search_path='' as $$
declare a public.championship_awards;p public.player_saves;g bigint;j bigint;l bigint;
begin
 perform public.championship_maintain();
 select * into strict a from public.championship_awards where week=reward_week and user_id=player for update;
 select * into strict p from public.player_saves where user_id=player for update;
 if a.claimed then return jsonb_build_object('profile',p.profile,'revision',p.revision);end if;
 if p.revision<>expected_revision then raise exception 'Your progress changed elsewhere. Reload before collecting';end if;
 g:=coalesce((p.profile->>'gold')::bigint,0)+(a.rewards->>'gold')::bigint;j:=coalesce((p.profile->>'gems')::bigint,0)+(a.rewards->>'gems')::bigint;l:=coalesce((p.profile->>'lootTickets')::bigint,0)+(a.rewards->>'lootTickets')::bigint;
 if g>999999999 or j>999999999 or l>999999 then raise exception 'Make room in your resources before collecting this reward';end if;
 update public.player_saves set profile=jsonb_set(jsonb_set(jsonb_set(profile,'{gold}',to_jsonb(g)),'{gems}',to_jsonb(j)),'{lootTickets}',to_jsonb(l)),revision=revision+1,updated_at=now() where user_id=player returning * into p;
 update public.championship_awards set claimed=true where week=reward_week and user_id=player;
 return jsonb_build_object('profile',p.profile,'revision',p.revision);
end;
$$;
-- Internal helpers are not callable by players, even with a valid access token.
revoke all on function public.championship_week(),public.championship_event(date,uuid,text),public.championship_maintain(),public.championship_dashboard(uuid),public.championship_publish(uuid,text,jsonb,jsonb,jsonb),public.championship_start(uuid,uuid,uuid,jsonb,timestamptz),public.championship_complete(uuid,uuid,boolean,boolean),public.championship_claim(uuid,date,bigint) from public,anon,authenticated;
grant execute on function public.championship_week(),public.championship_event(date,uuid,text),public.championship_maintain(),public.championship_dashboard(uuid),public.championship_publish(uuid,text,jsonb,jsonb,jsonb),public.championship_start(uuid,uuid,uuid,jsonb,timestamptz),public.championship_complete(uuid,uuid,boolean,boolean),public.championship_claim(uuid,date,bigint) to service_role;
-- Finalization is also safe to call from a Supabase scheduled job, if desired:
-- select public.championship_maintain();
