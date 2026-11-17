import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {TITANS,TITAN_RULES,titanReward} from '../src/titan-catalog.js';import {createTitanBattle,verifyTitanDamage} from '../src/titan-battle.js';import {defaultProfile} from '../src/progression.js';import {advantage,validMoves,validateSave} from '../src/engine.js';import {applyAutoAction} from '../src/auto-battle.js';
const roster=JSON.parse(fs.readFileSync(new URL('../data/champions.json',import.meta.url))),p=defaultProfile(),event=index=>({month:'2026-12-01',titan_index:index,hp:TITANS[index].health,max_hp:TITANS[index].health});
test('four Titans have distinct Specials, normal elemental weaknesses and a neutral Ultimate Titan',()=>{
 assert.equal(TITANS.length,4);assert.equal(new Set(TITANS.map(t=>t.special.name)).size,4);for(const [i,weak]of [[0,'blue'],[1,'red'],[2,'green']]){const s=createTitanBattle(roster,p,event(i),441,'raid');assert.equal(advantage(weak,s.enemies[0]),2);assert.deepEqual(s.enemies[0].lanes,[0,1,2,3,4,5,6]);assert.equal(s.enemies[0].special.name,TITANS[i].special.name);assert.ok(validateSave(s,roster),'valid canonical Titan state');}
 const ultimate=createTitanBattle(roster,p,event(3),441,'ultimate').enemies[0];assert.deepEqual(ultimate.dualColors,['yellow','purple']);for(const color of ['red','green','blue','yellow','purple'])assert.equal(advantage(color,ultimate),1);
});
test('Titan damage is obtained from replayed HP changes and invented damage or actions are not accepted',()=>{
 const initial=createTitanBattle(roster,p,event(0),441,'raid'),[a,b]=validMoves(initial.board)[0],actions=[{kind:'swap',a,b}],next=applyAutoAction(initial,actions[0]).state;const result=verifyTitanDamage(initial,actions,{retreat:true});assert.equal(result.damage,initial.enemies[0].hp-next.enemies[0].hp);assert.throws(()=>verifyTitanDamage(initial,actions),/Finish the attack/);assert.throws(()=>verifyTitanDamage(initial,[{kind:'damage',amount:9999999}],{retreat:true}));assert.equal(verifyTitanDamage(initial,[],{retreat:true}).damage,0);assert.equal(initial.enemies[0].hp,event(0).hp);
});
test('a Titan attack ends after 30 moves even when the whole team is alive',()=>{
 let s=createTitanBattle(roster,p,event(0),77,'bounded');for(const h of s.heroes){h.hp=h.maxHp=1000000;h.atk=0;}for(let i=0;i<30&&s.phase==='playing';i++){const [a,b]=validMoves(s.board)[0];s=applyAutoAction(s,{kind:'swap',a,b}).state;}assert.equal(s.moves,TITAN_RULES.moves);assert.equal(s.phase,'defeat');assert.ok(s.heroes.some(h=>h.hp>0));assert.ok(validateSave(s,roster));
});
test('percentage damage is raid-scaled and the four reward bands cover exactly places 1–50',()=>{
 const s=createTitanBattle(roster,p,event(0),441,'periodic');s.enemies[0].effects.poison={turns:3,source:'hero-0',appliedMove:0};const [a,b]=validMoves(s.board)[0],next=applyAutoAction(s,{kind:'swap',a,b}).state;assert.ok(next.log.some(l=>l.unitId==='enemy-0'&&l.text.includes('−2000')&&l.text.includes('Poison')));for(let i=1;i<=50;i++)assert.ok(titanReward(i));assert.equal(titanReward(4).from,4);assert.equal(titanReward(50).from,4);assert.equal(titanReward(51),null);assert.equal(titanReward(0),null);
});
