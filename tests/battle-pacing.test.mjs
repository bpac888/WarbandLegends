import test from 'node:test';
import assert from 'node:assert/strict';
import {battleTiming} from '../src/battle-pacing.js';
test('both speeds leave time for match contact and weighted landing',()=>{
 for(const speed of [1,2]){const match=battleTiming('match',{speed});assert.ok(match.duration>650/speed);assert.ok(match.impact>390/speed);assert.ok(match.duration-match.impact>=160);assert.ok(battleTiming('fall',{speed}).duration>=190);}
});
test('hero and enemy Specials share a readable cast at both speeds',()=>{
 for(const speed of [1,2]){const hero=battleTiming('skill',{speed,special:true}),enemy=battleTiming('enemy',{speed,special:true});assert.deepEqual(hero,enemy);assert.ok(hero.duration>=1100);assert.ok(hero.duration-hero.impact>=650);assert.ok(enemy.duration>battleTiming('enemy',{speed}).duration);}
 assert.ok(battleTiming('skill',{speed:2,special:true}).duration<battleTiming('skill',{speed:1,special:true}).duration);
});
test('reduced motion skips contact delay and leaves a short static special announcement',()=>{
 for(const kind of ['match','fall','enemy','skill'])assert.deepEqual(battleTiming(kind,{speed:2,reduced:true,special:true}),{rate:1.65,duration:650,impact:0});
});
