-- Cooperative monthly Titans. Run after accounts.sql; safe to reapply.
-- The first hunt month is December 2026. Each hidden arrival lasts five Pacific calendar days.
begin;
create table if not exists public.titan_events(month date primary key,titan_index integer not null check(titan_index between 0 and 3),starts_at timestamptz not null,closes_at timestamptz not null,max_hp bigint not null check(max_hp>0),hp bigint not null check(hp>=0 and hp<=max_hp),finalized_at timestamptz);
create table if not exists public.titan_standings(month date not null references public.titan_events(month),user_id uuid not null references auth.users(id) on delete cascade,display_name text not null,damage bigint not null default 0 check(damage>=0),last_damage_at timestamptz,primary key(month,user_id));
create table if not exists public.titan_attacks(id uuid primary key,month date not null references public.titan_events(month),user_id uuid not null references auth.users(id) on delete cascade,initial_state jsonb not null,status text not null default 'open' check(status in ('open','complete','expired')),damage bigint not null default 0 check(damage>=0),created_at timestamptz not null,expires_at timestamptz not null,settled_at timestamptz);
create index if not exists titan_attacks_by_player on public.titan_attacks(month,user_id);
create index if not exists titan_open_attacks on public.titan_attacks(status,expires_at);
create table if not exists public.titan_awards(month date not null references public.titan_events(month),user_id uuid not null references auth.users(id) on delete cascade,rank integer not null check(rank between 1 and 50),display_name text not null,rewards jsonb not null,snapshot jsonb not null,claimed boolean not null default false,primary key(month,user_id),unique(month,rank));
alter table public.titan_events enable row level security;alter table public.titan_standings enable row level security;alter table public.titan_attacks enable row level security;alter table public.titan_awards enable row level security;
revoke all on public.titan_events,public.titan_standings,public.titan_attacks,public.titan_awards from public,anon,authenticated;
grant all on public.titan_events,public.titan_standings,public.titan_attacks,public.titan_awards to service_role;
grant select,update on public.player_saves to service_role;
create or replace function public.titan_now() returns timestamptz language sql volatile set search_path='' as $$select clock_timestamp()$$;
create or replace function public.titan_month() returns date language sql stable set search_path='' as $$select greatest('2026-12-01'::date,date_trunc('month',public.titan_now() at time zone 'America/Los_Angeles')::date)$$;
create or replace function public.titan_seed(m date) returns void language plpgsql set search_path='' as $$
declare n integer;idx integer;offset_days integer;start_day date;health bigint;
begin
 if m<'2026-12-01'::date or extract(day from m)<>1 then raise exception 'Unknown Titan month';end if;
 n:=extract(day from(m+interval '1 month'-interval '1 day'));idx:=floor(random()*4)::integer;offset_days:=floor(random()*(n-4))::integer;start_day:=m+offset_days;health:=case when idx=3 then 10000000 else 5000000 end;
 insert into public.titan_events(month,titan_index,starts_at,closes_at,max_hp,hp) values(m,idx,start_day::timestamp at time zone 'America/Los_Angeles',(start_day+5)::timestamp at time zone 'America/Los_Angeles',health,health) on conflict do nothing;
end;$$;
create or replace function public.titan_maintain() returns void language plpgsql set search_path='' as $$
declare m date:=public.titan_month();t timestamptz;e record;
begin
 perform pg_advisory_xact_lock(732093);t:=public.titan_now();perform public.titan_seed(m);perform public.titan_seed((m+interval '1 month')::date);
 update public.titan_attacks set status='expired',settled_at=t where status='open' and expires_at<=t;
 for e in select * from public.titan_events where finalized_at is null and (closes_at<=t or hp=0 and not exists(select 1 from public.titan_attacks a where a.month=titan_events.month and a.status='open')) order by month for update loop
  insert into public.titan_awards(month,user_id,rank,display_name,rewards,snapshot)
   select e.month,r.user_id,r.place,r.display_name,case r.place when 1 then '{"gems":1000,"gold":10000,"lootTickets":25}'::jsonb when 2 then '{"gems":750,"gold":7500,"lootTickets":20}'::jsonb when 3 then '{"gems":500,"gold":5000,"lootTickets":15}'::jsonb else '{"gems":250,"gold":2500,"lootTickets":10}'::jsonb end,to_jsonb(r)-'place'||jsonb_build_object('rank',r.place)
   from(select user_id,display_name,damage,row_number() over(order by damage desc,last_damage_at asc,user_id) place from public.titan_standings where month=e.month and damage>0) r where r.place<=50 on conflict do nothing;
  update public.titan_events set finalized_at=t where month=e.month;
 end loop;
end;$$;
create or replace function public.titan_context() returns jsonb language plpgsql set search_path='' as $$
declare e public.titan_events;t timestamptz;
begin
 perform public.titan_maintain();t:=public.titan_now();select * into strict e from public.titan_events where month=public.titan_month();if t<e.starts_at or t>=e.closes_at or e.hp=0 or e.finalized_at is not null then raise exception 'No Titan is available to attack';end if;return to_jsonb(e);
end;$$;
create or replace function public.titan_dashboard(player uuid) returns jsonb language plpgsql set search_path='' as $$
declare e public.titan_events;t timestamptz;phase text;ranking jsonb;awards jsonb;damage_done bigint;attacks bigint;place bigint;
begin
 perform public.titan_maintain();t:=public.titan_now();select * into strict e from public.titan_events where month=public.titan_month();phase:=case when t<e.starts_at then 'upcoming' when e.hp=0 then 'defeated' when t>=e.closes_at then 'ended' else 'active' end;
 with ranked as(select user_id,display_name,damage,row_number() over(order by damage desc,last_damage_at asc,user_id) rank from public.titan_standings where month=e.month and damage>0) select coalesce(jsonb_agg(to_jsonb(r) order by rank),'[]'::jsonb) into ranking from ranked r where rank<=50;
 select damage into damage_done from public.titan_standings where month=e.month and user_id=player;select count(*) into attacks from public.titan_attacks where month=e.month and user_id=player;
 select rank into place from(select user_id,row_number() over(order by damage desc,last_damage_at asc,user_id) rank from public.titan_standings where month=e.month and damage>0) r where user_id=player;
 select coalesce(jsonb_agg(to_jsonb(a)-'user_id' order by month desc),'[]'::jsonb) into awards from public.titan_awards a where user_id=player;
 return jsonb_build_object('month',e.month,'playerId',player,'phase',phase,'event',case when phase='upcoming' then null else to_jsonb(e) end,'damage',coalesce(damage_done,0),'attacksUsed',attacks,'rank',place,'rankings',ranking,'awards',awards);
end;$$;
create or replace function public.titan_start(player uuid,player_name text,battle_id uuid,m date,state jsonb) returns jsonb language plpgsql set search_path='' as $$
declare e public.titan_events;t timestamptz;deadline timestamptz;
begin
 perform public.titan_maintain();t:=public.titan_now();select * into strict e from public.titan_events where month=m for update;if m<>public.titan_month() or t<e.starts_at or t>=e.closes_at or e.hp=0 or e.finalized_at is not null then raise exception 'No Titan is available to attack';end if;
 if exists(select 1 from public.titan_attacks where user_id=player and status='open') then raise exception 'Finish your current Titan attack';end if;
 if(select count(*) from public.titan_attacks where month=m and user_id=player)>=6 then raise exception 'All six Titan attacks have been used';end if;
 insert into public.titan_standings(month,user_id,display_name) values(m,player,player_name) on conflict(month,user_id) do update set display_name=excluded.display_name;
 deadline:=least(t+interval '30 minutes',e.closes_at);insert into public.titan_attacks(id,month,user_id,initial_state,created_at,expires_at) values(battle_id,m,player,state,t,deadline);
 return jsonb_build_object('id',battle_id,'state',state,'expiresAt',deadline);
end;$$;
create or replace function public.titan_complete(player uuid,battle_id uuid,amount bigint) returns jsonb language plpgsql set search_path='' as $$
declare a public.titan_attacks;e public.titan_events;credit bigint;t timestamptz;
begin
 perform public.titan_maintain();t:=public.titan_now();select * into strict a from public.titan_attacks where id=battle_id and user_id=player for update;
 if a.status='open' then
  select * into strict e from public.titan_events where month=a.month for update;
  if e.finalized_at is not null or t>=e.closes_at then raise exception 'The Titan event has ended';end if;
  credit:=greatest(0,least(coalesce(amount,0),(a.initial_state#>>'{enemies,0,hp}')::bigint));
  update public.titan_events set hp=greatest(0,hp-credit) where month=a.month;
  update public.titan_standings set damage=damage+credit,last_damage_at=case when credit>0 then t else last_damage_at end where month=a.month and user_id=player;
  update public.titan_attacks set damage=credit,status='complete',settled_at=t where id=battle_id returning * into a;
 end if;
 perform public.titan_maintain();return jsonb_build_object('damage',a.damage,'outcome',a.status,'dashboard',public.titan_dashboard(player));
end;$$;
create or replace function public.titan_claim(player uuid,reward_month date,expected_revision bigint) returns jsonb language plpgsql set search_path='' as $$
declare a public.titan_awards;p public.player_saves;g bigint;j bigint;l bigint;
begin
 perform public.titan_maintain();
 select * into strict a from public.titan_awards where month=reward_month and user_id=player for update;
 select * into strict p from public.player_saves where user_id=player for update;
 if a.claimed then return jsonb_build_object('profile',p.profile,'revision',p.revision);end if;
 if p.revision<>expected_revision then raise exception 'Your progress changed elsewhere. Reload before collecting';end if;
 g:=coalesce((p.profile->>'gold')::bigint,0)+(a.rewards->>'gold')::bigint;j:=coalesce((p.profile->>'gems')::bigint,0)+(a.rewards->>'gems')::bigint;l:=coalesce((p.profile->>'lootTickets')::bigint,0)+(a.rewards->>'lootTickets')::bigint;
 if g>999999999 or j>999999999 or l>999999 then raise exception 'Make room in your resources before collecting this reward';end if;
 update public.player_saves set profile=jsonb_set(jsonb_set(jsonb_set(profile,'{gold}',to_jsonb(g)),'{gems}',to_jsonb(j)),'{lootTickets}',to_jsonb(l)),revision=revision+1,updated_at=now() where user_id=player returning * into p;
 update public.titan_awards set claimed=true where month=reward_month and user_id=player;
 return jsonb_build_object('profile',p.profile,'revision',p.revision);
end;
$$;


revoke all on function public.titan_now(),public.titan_month(),public.titan_seed(date),public.titan_maintain(),public.titan_context(),public.titan_dashboard(uuid),public.titan_start(uuid,text,uuid,date,jsonb),public.titan_complete(uuid,uuid,bigint),public.titan_claim(uuid,date,bigint) from public,anon,authenticated;
grant execute on function public.titan_now(),public.titan_month(),public.titan_seed(date),public.titan_maintain(),public.titan_context(),public.titan_dashboard(uuid),public.titan_start(uuid,text,uuid,date,jsonb),public.titan_complete(uuid,uuid,bigint),public.titan_claim(uuid,date,bigint) to service_role;
commit;
