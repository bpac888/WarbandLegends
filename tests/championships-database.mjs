import fs from 'node:fs/promises';import assert from 'node:assert/strict';
import {defaultProfile} from '../src/progression.js';
const {PGlite}=await import(process.env.CHAMPIONSHIP_SQL_MODULE||'@electric-sql/pglite'),db=new PGlite();
const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222',c='33333333-3333-4333-8333-333333333333',profile=defaultProfile(),ids=profile.team,snapshot={ids,levels:{},ascensions:{},awakenings:{}};
const rpc=async(sql,args=[])=>{const result=await db.query(sql,args);return result.rows[0]?.value;};
try{
 await db.exec("create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql as $$select null::uuid$$;");
 await db.exec(await fs.readFile(new URL('../supabase/accounts.sql',import.meta.url),'utf8'));
 await db.exec(await fs.readFile(new URL('../supabase/championships.sql',import.meta.url),'utf8'));
 for(const id of [a,b,c]){await db.query('insert into auth.users values($1)',[id]);await db.query('insert into player_saves(user_id,profile) values($1,$2)',[id,profile]);}
 const publish=async(id,name)=>rpc('select championship_publish($1,$2,$3,$4,$5) as value',[id,name,ids,ids,snapshot]);
 const dashboard=await publish(a,'Alpha');await publish(b,'Beta');await publish(c,'Gamma');
 assert.equal(dashboard.standing.tier,0);const week=dashboard.week;assert.equal(dashboard.preview,false);
 await db.exec('set role service_role');await rpc('select championship_dashboard($1) as value',[a]);await db.exec('reset role');
 const matchId='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
 const start=async(id,who=a,rival=b)=>{
  const row=(await db.query('select updated_at from championship_teams where user_id=$1',[rival])).rows[0];
  return rpc('select championship_start($1,$2,$3,$4,$5) as value',[who,rival,id,{test:'trusted-server-state'},row.updated_at]);
 };
 await start(matchId);await assert.rejects(start('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),/current attack/);
 const win=await rpc('select championship_complete($1,$2,true,false) as value',[a,matchId]);assert.equal(win.dashboard.standing.score,30);assert.equal(win.dashboard.standing.attack_wins,1);
 const again=await rpc('select championship_complete($1,$2,true,false) as value',[a,matchId]);assert.equal(again.dashboard.standing.score,30);assert.equal(again.dashboard.standing.attack_wins,1);
 await assert.rejects(rpc('select championship_complete($1,$2,true,false) as value',[c,matchId]),/no rows/);
 await db.query('update championship_standings set score=123,tier=1,strikes=2 where week=$1 and user_id=$2',[week,b]);
 for(let i=0;i<4;i++){
  await db.query('select championship_event($1,$2,$3)',[week,b,'defense-loss']);
  const s=(await db.query('select score,tier,strikes from championship_standings where week=$1 and user_id=$2',[week,b])).rows[0];assert.equal(s.score,122-i);assert.equal(s.tier,i===3?0:1);assert.equal(s.strikes,0);
 }
 const expiring='cccccccc-cccc-4ccc-8ccc-cccccccccccc';await start(expiring,c,a);await db.query("update championship_matches set expires_at=now()-interval '1 minute' where id=$1",[expiring]);
 await rpc('select championship_dashboard($1) as value',[c]);const before=(await db.query('select score from championship_standings where week=$1 and user_id=$2',[week,a])).rows[0].score;
 const expired=await rpc('select championship_complete($1,$2,true,false) as value',[c,expiring]);assert.equal(expired.outcome,'expired');assert.equal(expired.dashboard.standing.attack_losses,1);assert.equal((await db.query('select score from championship_standings where week=$1 and user_id=$2',[week,a])).rows[0].score,before);
 // Generate enough eligible finishers to cover every reward boundary.
 await db.query('update championship_standings set score=100000,attack_wins=10 where user_id=$1 and week=$2',[a,week]);
 await db.query("insert into auth.users select gen_random_uuid() from generate_series(1,55)");
 await db.query("insert into championship_standings(week,user_id,display_name,score,attack_wins,last_win_at) select $1,id,'Rival',1000-row_number() over()::integer,1,now() from auth.users where id not in ($2,$3,$4)",[week,a,b,c]);
 // Simulate the next Monday without changing production calendar logic.
 const next=(await db.query("select ($1::date+7)::text as next",[week])).rows[0].next;
 await db.exec(`create or replace function public.championship_week() returns date language sql stable set search_path='' as $$select '${next}'::date$$;`);
 const newWeek=await rpc('select championship_dashboard($1) as value',[a]);assert.equal(newWeek.standing.score,0);assert.equal(newWeek.standing.tier,0);assert.deepEqual(newWeek.teams.attack_ids,ids);assert.equal(newWeek.awards.length,1);assert.equal(newWeek.awards[0].rank,1);assert.equal(newWeek.archive.rankings.length,50);
 const awards=(await db.query('select rank,rewards from championship_awards order by rank')).rows;assert.equal(awards.length,50);assert.equal(awards[3].rewards.gems,250);assert.equal(awards[24].rewards.gems,250);assert.equal(awards[25].rewards.gems,100);assert.equal(awards[49].rank,50);
 const frozen=(await db.query('select snapshot from championship_awards order by rank')).rows;
 await rpc('select championship_complete($1,$2,false,false) as value',[a,matchId]);await rpc('select championship_dashboard($1) as value',[a]);assert.deepEqual((await db.query('select snapshot from championship_awards order by rank')).rows,frozen);
 const migration=await fs.readFile(new URL('../supabase/migrations/202611160001_simple_championship_points.sql',import.meta.url),'utf8');
 await db.query('update championship_standings set score=119,tier=1,strikes=2 where week=$1 and user_id=$2',[next,a]);
 await db.exec(migration);await db.exec(migration);
 assert.deepEqual((await db.query('select score,tier,strikes from championship_standings where week=$1 and user_id=$2',[next,a])).rows[0],{score:119,tier:0,strikes:0});
 assert.deepEqual((await db.query('select snapshot from championship_awards order by rank')).rows,frozen);
 const reward=await rpc('select championship_claim($1,$2,$3) as value',[a,week,1]);assert.equal(reward.profile.gems,profile.gems+1000);assert.equal(reward.profile.gold,profile.gold+10000);assert.equal(reward.profile.lootTickets,25);assert.equal(reward.revision,2);
 const twice=await rpc('select championship_claim($1,$2,$3) as value',[a,week,1]);assert.equal(twice.revision,2);assert.equal(twice.profile.gems,reward.profile.gems);
 await assert.rejects(rpc('select championship_claim($1,$2,$3) as value',[b,week,1]),/no rows/);
 for(const role of ['anon','authenticated']){
  await db.exec('set role '+role);
  await assert.rejects(db.query('select * from championship_teams'),/permission denied/);
  await assert.rejects(db.query('select championship_complete($1,$2,true,false)',[a,matchId]),/permission denied/);
  await assert.rejects(db.query('select championship_event($1,$2,$3)',[next,a,'attack-win']),/permission denied/);
  await db.exec('reset role');
 }
 console.log('Database checks passed: schema, real transactions, one active match, idempotent settlement, ownership, one-point defense defeats, point-based tiers, repeatable migration, expiry, immutable weekly top-50 snapshots, resets, all reward boundaries, one-time resource delivery, and denied direct player writes.');
}finally{await db.close();}
