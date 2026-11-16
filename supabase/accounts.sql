-- Run once in your Supabase SQL editor. Never use a service-role key in the game.
create table public.player_saves (
 user_id uuid primary key references auth.users(id) on delete cascade,
 profile jsonb not null check (jsonb_typeof(profile) = 'object' and octet_length(profile::text) <= 1000000),
 revision bigint not null default 1,
 updated_at timestamptz not null default now()
);
alter table public.player_saves enable row level security;
revoke all on public.player_saves from anon, authenticated;
grant select on public.player_saves to authenticated;
create policy "Players read their own save" on public.player_saves for select to authenticated using ((select auth.uid()) = user_id);

-- Writes go through this function for atomic revision checks across devices/tabs.
create function public.save_player_progress(new_profile jsonb, expected_revision bigint)
returns bigint language plpgsql security definer set search_path = '' as $$
declare player uuid := auth.uid(); next_revision bigint;
begin
 if player is null then raise exception 'Authentication required' using errcode = '42501'; end if;
 if expected_revision < 0 then raise exception 'Invalid revision' using errcode = '22023'; end if;
 if expected_revision = 0 then
  insert into public.player_saves(user_id,profile) values(player,new_profile)
   on conflict (user_id) do nothing returning revision into next_revision;
 else
  update public.player_saves set profile=new_profile,revision=revision+1,updated_at=now()
   where user_id=player and revision=expected_revision returning revision into next_revision;
 end if;
 if next_revision is null then raise exception 'Save conflict'; end if;
 return next_revision;
end;
$$;
revoke all on function public.save_player_progress(jsonb,bigint) from public, anon;
grant execute on function public.save_player_progress(jsonb,bigint) to authenticated;
