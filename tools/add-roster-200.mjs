// One-time, additive milestone installation. Existing identities, kits and portraits are immutable.
import {readFile,writeFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {EFFECTS} from '../src/effects.js';
import {skillDescription} from '../src/engine.js';
const read=async p=>JSON.parse(await readFile(p,'utf8')),sha=x=>createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
const plan=await read('data/roster-expansion-5-design.json'),roster=await read('data/champions.json'),source=await read('data/source-champions.json'),design=await read('data/roster-design.json');
assert.equal(roster.length,plan.originalCount,'This additive installer expects the untouched 189-character baseline');assert.equal(source.length,plan.originalCount);assert.equal(plan.champions.length,11);
const names=new Set(roster.map(c=>c.name.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,''))),ids=new Set(roster.map(c=>c.id));
const originalPortraits=[];for(const c of roster)originalPortraits.push({id:c.id,sha256:createHash('sha256').update(await readFile(c.portrait)).digest('hex')});
const manifest={version:5,originalCount:roster.length,totalCount:plan.totalCount,originalRecordsSha256:sha(roster),originalSourceRecordsSha256:sha(source),originalPortraitsSha256:sha(originalPortraits),addedChampionIds:[],implementedRecommendations:[]};
for(const h of plan.champions){
 assert.ok(!ids.has(h.id),h.id);ids.add(h.id);const normalized=h.name.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');assert.ok(!names.has(normalized),h.name);names.add(normalized);
 assert.ok(['rare','legendary'].includes(h.rarity));assert.ok(['fast','average'].includes(h.manaSpeed));assert.ok((await stat(`assets/champions/${h.id}.webp`)).size>100000,h.id+' artwork');
 for(const e of h.level.effects)assert.ok(EFFECTS[e.id],h.id+': '+e.id);
 const portrait=`assets/champions/${h.id}.webp`,identity={template_id:h.id,name:h.name,title:h.title,rarity:h.rarity,faction:h.faction,role:h.role,hp:h.stats.hp,atk:h.stats.atk,def:h.stats.def,ability_name:h.ability_name,lore:h.lore,image_url:'/'+portrait,id:h.id,color:h.color,source_image:portrait,portrait,passive:null};
 const c={...identity,manaSpeed:h.manaSpeed,special:{name:h.ability_name,charging:false,levels:[structuredClone(h.level)]},ability_desc:''};c.ability_desc=skillDescription(c,EFFECTS,1).text;roster.push(c);
 const sourceEffects=h.level.effects.map(e=>[e.id,e.turns]);if(h.level.aoe)sourceEffects.push(['aoe',0]);if(h.level.pierce)sourceEffects.push(['ignore_def',0]);
 source.push({...identity,ability_desc:c.ability_desc,spd:h.manaSpeed==='fast'?112:100,kit:{a2:[],a3:sourceEffects}});
 design.champions[h.id]={color:h.color,manaSpeed:h.manaSpeed,levelOverrides:[structuredClone(h.level)],statsOverride:structuredClone(h.stats)};
 manifest.addedChampionIds.push(h.id);manifest.implementedRecommendations.push({championId:h.id,name:h.name,faction:h.faction,color:h.color,rarity:h.rarity,role:h.role,manaSpeed:h.manaSpeed,gap:h.gap,status:'implemented'});
}
assert.equal(roster.length,200);assert.equal(sha(roster.slice(0,189)),manifest.originalRecordsSha256);assert.equal(sha(source.slice(0,189)),manifest.originalSourceRecordsSha256);
manifest.newRarities={legendary:9,rare:2};manifest.newRoles={attack:7,defense:2,support:2};manifest.newElements={red:1,blue:3,green:2,yellow:2,purple:3};
for(const [file,value] of [['data/champions.json',roster],['data/source-champions.json',source],['data/roster-design.json',design],['data/roster-expansion-5.json',manifest]])await writeFile(file,JSON.stringify(value,null,2)+'\n');
console.log('Installed 11 audit-led champions; all 189 original records, source records and portrait hashes retained.');
