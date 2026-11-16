-- Apply once to an existing project when publishing the simplified points rules.
-- No players, rewards, teams or historical season snapshots are removed.
begin;
select pg_advisory_xact_lock(732091);
create or replace function public.championship_event(w date,p uuid,event text) returns void language plpgsql set search_path='' as $$
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
update public.championship_standings set strikes=0,
 tier=case when score>=600 then 3 when score>=300 then 2 when score>=120 then 1 else 0 end
 where week=public.championship_week()
 and exists(select 1 from public.championship_seasons s where s.week=championship_standings.week and s.finalized_at is null);
commit;
