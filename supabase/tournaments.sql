-- Prepare AFTER accounts.sql and championships.sql. Safe to reapply.
-- Automatic Pacific-time schedule: registration Jan 30, 2027; battles Feb 1.
begin;
create table if not exists public.tournament_seasons(month date primary key,closes_at timestamptz not null,finalized_at timestamptz);
create table if not exists public.tournament_teams(month date not null references public.tournament_seasons(month),user_id uuid not null references auth.users(id) on delete cascade,display_name text not null check(length(display_name) between 1 and 24),defense_ids jsonb not null check(jsonb_array_length(defense_ids)=5),defense_snapshot jsonb not null,updated_at timestamptz not null default now(),locked_at timestamptz,primary key(month,user_id));
create table if not exists public.tournament_standings(month date references public.tournament_seasons(month),user_id uuid references auth.users(id) on delete cascade,display_name text not null,score integer not null default 0 check(score>=0),tier integer not null default 0 check(tier between 0 and 3),attack_wins integer not null default 0,attack_losses integer not null default 0,defense_wins integer not null default 0,defense_losses integer not null default 0,last_win_at timestamptz,primary key(month,user_id));
create table if not exists public.tournament_matches(id uuid primary key,month date not null references public.tournament_seasons(month),attacker_id uuid not null references auth.users(id) on delete cascade,defender_id uuid not null references auth.users(id) on delete cascade,initial_state jsonb not null,status text not null default 'open' check(status in ('open','complete','expired')),outcome text check(outcome in ('victory','defeat','expired')),created_at timestamptz not null default now(),expires_at timestamptz not null,settled_at timestamptz,check(attacker_id<>defender_id));
create index if not exists tournament_open_matches on public.tournament_matches(status,expires_at);
create index if not exists tournament_attacks on public.tournament_matches(attacker_id,created_at);
create table if not exists public.tournament_awards(month date not null references public.tournament_seasons(month),user_id uuid not null references auth.users(id) on delete cascade,rank integer not null check(rank between 1 and 50),display_name text not null,rewards jsonb not null,snapshot jsonb not null,claimed boolean not null default false,primary key(month,user_id),unique(month,rank));
alter table public.tournament_seasons enable row level security;alter table public.tournament_teams enable row level security;alter table public.tournament_standings enable row level security;alter table public.tournament_matches enable row level security;alter table public.tournament_awards enable row level security;
revoke all on public.tournament_seasons,public.tournament_teams,public.tournament_standings,public.tournament_matches,public.tournament_awards from public,anon,authenticated;
grant all on public.tournament_seasons,public.tournament_teams,public.tournament_standings,public.tournament_matches,public.tournament_awards to service_role;
create or replace function public.tournament_now() returns timestamptz language sql volatile set search_path='' as $$select clock_timestamp()$$;
create or replace function public.tournament_month() returns date language sql stable set search_path='' as $$select greatest('2027-02-01'::date,date_trunc('month',public.tournament_now() at time zone 'America/Los_Angeles')::date)$$;
create or replace function public.tournament_context(m date default null) returns jsonb language plpgsql stable set search_path='' as $$
declare d date:=coalesce(m,public.tournament_month());n date;opens timestamptz;starts timestamptz;ends timestamptz;t timestamptz:=public.tournament_now();idx integer;
begin
 if d<'2027-02-01'::date or extract(day from d)<>1 then raise exception 'Unknown tournament month';end if;
 n:=(d+interval '1 month')::date;starts:=d::timestamp at time zone 'America/Los_Angeles';ends:=n::timestamp at time zone 'America/Los_Angeles';opens:=(d-2)::timestamp at time zone 'America/Los_Angeles';idx:=((extract(year from d)::integer-2027)*12+extract(month from d)::integer-2)%11;
 return jsonb_build_object('month',d,'nextMonth',n,'ruleIndex',idx,'signupOpensAt',opens,'startsAt',starts,'closesAt',ends,'phase',case when t<opens then 'upcoming' when t<starts then 'signup' when t<ends then 'active' else 'closed' end);
end;$$;
create or replace function public.tournament_event(m date,p uuid,event text) returns void language plpgsql set search_path='' as $$
declare s public.tournament_standings;point_tier integer;
begin
 select * into strict s from public.tournament_standings where month=m and user_id=p for update;
 if event='attack-win' then s.score:=s.score+30;s.attack_wins:=s.attack_wins+1;s.last_win_at:=public.tournament_now();
 elsif event='attack-loss' then s.score:=greatest(0,s.score-10);s.attack_losses:=s.attack_losses+1;
 elsif event='defense-win' then s.defense_wins:=s.defense_wins+1;
 elsif event='defense-loss' then s.score:=greatest(0,s.score-1);s.defense_losses:=s.defense_losses+1;
 else raise exception 'Unknown event';end if;
 point_tier:=case when s.score>=600 then 3 when s.score>=300 then 2 when s.score>=120 then 1 else 0 end;s.tier:=case when event='attack-win' then point_tier else least(s.tier,point_tier) end;
 update public.tournament_standings set score=s.score,tier=s.tier,attack_wins=s.attack_wins,attack_losses=s.attack_losses,defense_wins=s.defense_wins,defense_losses=s.defense_losses,last_win_at=s.last_win_at where month=m and user_id=p;
end;$$;
create or replace function public.tournament_maintain() returns void language plpgsql set search_path='' as $$
declare w date:=public.tournament_month();m record;s record;t timestamptz:=public.tournament_now();
begin
 perform pg_advisory_xact_lock(732092);t:=public.tournament_now();
 insert into public.tournament_seasons(month,closes_at) values(w,((w+interval '1 month')::timestamp at time zone 'America/Los_Angeles')),((w+interval '1 month')::date,((w+interval '2 months')::timestamp at time zone 'America/Los_Angeles')) on conflict do nothing;
 update public.tournament_teams set locked_at=month::timestamp at time zone 'America/Los_Angeles' where locked_at is null and month::timestamp at time zone 'America/Los_Angeles'<=t;
 for m in select * from public.tournament_matches where status='open' and expires_at<=t for update loop
  if exists(select 1 from public.tournament_seasons where month=m.month and finalized_at is null) then perform public.tournament_event(m.month,m.attacker_id,'attack-loss');end if;
  update public.tournament_matches set status='expired',outcome='expired',settled_at=t where id=m.id;
 end loop;
 for s in select month from public.tournament_seasons where closes_at<=t and finalized_at is null order by month for update loop
  insert into public.tournament_awards(month,user_id,rank,display_name,rewards,snapshot)
  select s.month,r.user_id,r.place,r.display_name,case r.place when 1 then '{"gems":1000,"gold":10000,"lootTickets":25}'::jsonb when 2 then '{"gems":750,"gold":7500,"lootTickets":20}'::jsonb when 3 then '{"gems":500,"gold":5000,"lootTickets":15}'::jsonb else case when r.place<=25 then '{"gems":250,"gold":2500,"lootTickets":10}'::jsonb else '{"gems":100,"gold":1000,"lootTickets":5}'::jsonb end end,to_jsonb(r)-'place'||jsonb_build_object('rank',r.place)
  from(select user_id,display_name,tier,score,attack_wins,row_number() over(order by score desc,attack_wins desc,last_win_at asc,user_id) place from public.tournament_standings where month=s.month and attack_wins>0) r where r.place<=50 on conflict do nothing;
  update public.tournament_seasons set finalized_at=t where month=s.month;
 end loop;
end;$$;
create or replace function public.tournament_dashboard(player uuid,requested_month date default null) returns jsonb language plpgsql set search_path='' as $$
declare m date:=coalesce(requested_month,public.tournament_month());ctx jsonb;entry jsonb;standing jsonb;rankings jsonb;opponents jsonb;awards jsonb;place bigint;next_ctx jsonb;
begin
 perform public.tournament_maintain();ctx:=public.tournament_context(m);next_ctx:=public.tournament_context((m+interval '1 month')::date);
 select to_jsonb(t)-'user_id' into entry from public.tournament_teams t where month=m and user_id=player;
 select to_jsonb(s)-'user_id'-'month' into standing from public.tournament_standings s where month=m and user_id=player;
 with ranked as(select user_id,display_name,tier,score,attack_wins,row_number() over(order by score desc,attack_wins desc,last_win_at asc,user_id) rank from public.tournament_standings where month=m and attack_wins>0) select coalesce(jsonb_agg(to_jsonb(r) order by rank),'[]'::jsonb) into rankings from ranked r where rank<=50;
 select rank into place from(select user_id,row_number() over(order by score desc,attack_wins desc,last_win_at asc,user_id) rank from public.tournament_standings where month=m and attack_wins>0) r where user_id=player;
 select coalesce(jsonb_agg(to_jsonb(r)),'[]'::jsonb) into opponents from(select t.user_id,t.display_name,t.defense_ids,s.score,s.tier from public.tournament_teams t join public.tournament_standings s on s.month=t.month and s.user_id=t.user_id where t.month=m and t.user_id<>player and (select count(*) from public.tournament_matches b where b.month=m and b.attacker_id=player and b.defender_id=t.user_id and b.created_at>=((public.tournament_now() at time zone 'America/Los_Angeles')::date::timestamp at time zone 'America/Los_Angeles'))<3 order by abs(s.score-coalesce((standing->>'score')::integer,0)),md5(t.user_id::text||m::text) limit 5) r;
 select coalesce(jsonb_agg(to_jsonb(a)-'user_id' order by month desc),'[]'::jsonb) into awards from public.tournament_awards a where user_id=player;
 return ctx||jsonb_build_object('playerId',player,'entry',entry,'standing',coalesce(standing,'{}'::jsonb),'rank',place,'rankings',rankings,'opponents',opponents,'awards',awards,'nextSignup',next_ctx);
end;$$;
create or replace function public.tournament_signup(m date,player uuid,player_name text,defense jsonb,snapshot jsonb) returns jsonb language plpgsql set search_path='' as $$
declare ctx jsonb;
begin
 perform public.tournament_maintain();ctx:=public.tournament_context(m);if ctx->>'phase'<>'signup' then raise exception 'Tournament signups are closed';end if;
 insert into public.tournament_seasons(month,closes_at) values(m,(ctx->>'closesAt')::timestamptz) on conflict do nothing;
 insert into public.tournament_teams(month,user_id,display_name,defense_ids,defense_snapshot,updated_at) values(m,player,player_name,defense,snapshot,public.tournament_now()) on conflict(month,user_id) do update set display_name=excluded.display_name,defense_ids=excluded.defense_ids,defense_snapshot=excluded.defense_snapshot,updated_at=excluded.updated_at where tournament_teams.locked_at is null;
 if not found then raise exception 'Your tournament defense is locked';end if;
 insert into public.tournament_standings(month,user_id,display_name) values(m,player,player_name) on conflict(month,user_id) do update set display_name=excluded.display_name;
 return public.tournament_dashboard(player,m);
end;$$;
create or replace function public.tournament_start(m date,player uuid,rival uuid,battle_id uuid,state jsonb,defense_updated timestamptz) returns jsonb language plpgsql set search_path='' as $$
declare t public.tournament_teams;own_team public.tournament_teams;ctx jsonb;day_start timestamptz:=((public.tournament_now() at time zone 'America/Los_Angeles')::date::timestamp at time zone 'America/Los_Angeles');deadline timestamptz;
begin
 perform public.tournament_maintain();ctx:=public.tournament_context(m);if ctx->>'phase'<>'active' then raise exception 'This tournament is not open for battles';end if;if player=rival then raise exception 'Choose another player';end if;
 select * into strict own_team from public.tournament_teams where month=m and user_id=player;
 select * into strict t from public.tournament_teams where month=m and user_id=rival;
 if own_team.locked_at is null or t.locked_at is null then raise exception 'Tournament defenses are not locked yet';end if;if t.updated_at<>defense_updated then raise exception 'This defense changed. Refresh the field';end if;
 if exists(select 1 from public.tournament_matches where attacker_id=player and status='open') then raise exception 'Finish your current tournament attack';end if;
 if(select count(*) from public.tournament_matches where month=m and attacker_id=player and created_at>=day_start)>=20 then raise exception 'All 20 tournament attacks used today';end if;
 if(select count(*) from public.tournament_matches where month=m and attacker_id=player and defender_id=rival and created_at>=day_start)>=3 then raise exception 'You have already challenged this defense three times today';end if;
 deadline:=least(public.tournament_now()+interval '30 minutes',(ctx->>'closesAt')::timestamptz);
 insert into public.tournament_matches(id,month,attacker_id,defender_id,initial_state,created_at,expires_at) values(battle_id,m,player,rival,state,public.tournament_now(),deadline);
 return jsonb_build_object('id',battle_id,'state',state,'expiresAt',deadline,'opponent',t.display_name);
end;$$;
create or replace function public.tournament_complete(player uuid,battle_id uuid,won boolean,surrender boolean default false) returns jsonb language plpgsql set search_path='' as $$
declare m public.tournament_matches;
begin
 perform public.tournament_maintain();select * into strict m from public.tournament_matches where id=battle_id and attacker_id=player for update;
 if m.status='open' then
  perform public.tournament_event(m.month,player,case when won and not surrender then 'attack-win' else 'attack-loss' end);perform public.tournament_event(m.month,m.defender_id,case when won and not surrender then 'defense-loss' else 'defense-win' end);
  update public.tournament_matches set status='complete',outcome=case when won and not surrender then 'victory' else 'defeat' end,settled_at=public.tournament_now() where id=battle_id returning * into m;
 end if;
 return jsonb_build_object('outcome',m.outcome,'dashboard',public.tournament_dashboard(player,m.month));
end;$$;
create or replace function public.tournament_claim(player uuid,reward_month date,expected_revision bigint) returns jsonb language plpgsql set search_path='' as $$
declare a public.tournament_awards;p public.player_saves;g bigint;j bigint;l bigint;
begin
 perform public.tournament_maintain();
 select * into strict a from public.tournament_awards where month=reward_month and user_id=player for update;
 select * into strict p from public.player_saves where user_id=player for update;
 if a.claimed then return jsonb_build_object('profile',p.profile,'revision',p.revision);end if;
 if p.revision<>expected_revision then raise exception 'Your progress changed elsewhere. Reload before collecting';end if;
 g:=coalesce((p.profile->>'gold')::bigint,0)+(a.rewards->>'gold')::bigint;j:=coalesce((p.profile->>'gems')::bigint,0)+(a.rewards->>'gems')::bigint;l:=coalesce((p.profile->>'lootTickets')::bigint,0)+(a.rewards->>'lootTickets')::bigint;
 if g>999999999 or j>999999999 or l>999999 then raise exception 'Make room in your resources before collecting this reward';end if;
 update public.player_saves set profile=jsonb_set(jsonb_set(jsonb_set(profile,'{gold}',to_jsonb(g)),'{gems}',to_jsonb(j)),'{lootTickets}',to_jsonb(l)),revision=revision+1,updated_at=now() where user_id=player returning * into p;
 update public.tournament_awards set claimed=true where month=reward_month and user_id=player;
 return jsonb_build_object('profile',p.profile,'revision',p.revision);
end;
$$;

revoke all on function public.tournament_now(),public.tournament_month(),public.tournament_context(date),public.tournament_event(date,uuid,text),public.tournament_maintain(),public.tournament_dashboard(uuid,date),public.tournament_signup(date,uuid,text,jsonb,jsonb),public.tournament_start(date,uuid,uuid,uuid,jsonb,timestamptz),public.tournament_complete(uuid,uuid,boolean,boolean),public.tournament_claim(uuid,date,bigint) from public,anon,authenticated;
grant execute on function public.tournament_now(),public.tournament_month(),public.tournament_context(date),public.tournament_event(date,uuid,text),public.tournament_maintain(),public.tournament_dashboard(uuid,date),public.tournament_signup(date,uuid,text,jsonb,jsonb),public.tournament_start(date,uuid,uuid,uuid,jsonb,timestamptz),public.tournament_complete(uuid,uuid,boolean,boolean),public.tournament_claim(uuid,date,bigint) to service_role;
commit;
