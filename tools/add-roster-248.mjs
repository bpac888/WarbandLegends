// One-time additive installation. Never rerun against an already expanded roster.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {EFFECTS} from '../src/effects.js';
import {skillDescription} from '../src/engine.js';
const read=async p=>JSON.parse(await readFile(p,'utf8')),sha=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const plan=await read('data/roster-expansion-10-design.json'),roster=await read('data/champions.json'),source=await read('data/source-champions.json'),design=await read('data/roster-design.json');
assert.equal(roster.length,240);assert.equal(source.length,240);assert.equal(plan.champions.length,8);
const portraits=[];for(const c of roster)portraits.push({id:c.id,sha256:createHash('sha256').update(await readFile(c.portrait)).digest('hex')});
const manifest={version:10,originalCount:240,totalCount:248,originalRecordsSha256:sha(roster),originalSourceRecordsSha256:sha(source),originalPortraitsSha256:sha(portraits),addedChampionIds:[],implementedRecommendations:[]};
const ids=new Set(roster.map(c=>c.id)),names=new Set(roster.map(c=>c.name.toLowerCase()));
// Validate every prerequisite before writing any repository data.
for(const h of plan.champions){assert.ok(!ids.has(h.id));ids.add(h.id);assert.ok(!names.has(h.name.toLowerCase()));names.add(h.name.toLowerCase());assert.ok(['common','rare','legendary','mythical'].includes(h.rarity));for(const l of h.levels)for(const e of l.effects)assert.ok(EFFECTS[e.id]);}
for(const h of plan.champions){
 const portrait=`assets/champions/${h.id}.webp`,identity={template_id:h.id,name:h.name,title:h.title,rarity:h.rarity,faction:h.faction,role:h.role,...h.stats,ability_name:h.ability_name,lore:h.lore,image_url:'/'+portrait,id:h.id,color:h.color,source_image:portrait,portrait,passive:h.passive||null};
 const c={...identity,manaSpeed:h.manaSpeed,special:{name:h.ability_name,charging:h.levels.length>1,levels:structuredClone(h.levels)},ability_desc:''};c.ability_desc=skillDescription(c,EFFECTS,1).text;roster.push(c);
 const last=h.levels.at(-1),effects=last.effects.map(e=>[e.id,e.turns]);if(last.aoe)effects.push(['aoe',0]);if(last.pierce)effects.push(['ignore_def',0]);
 source.push({...identity,ability_desc:c.ability_desc,spd:h.manaSpeed==='fast'?112:h.manaSpeed==='slow'?88:100,kit:{a2:[],a3:effects}});
 design.champions[h.id]={color:h.color,manaSpeed:h.manaSpeed,chargeLevels:h.levels.length,levelOverrides:structuredClone(h.levels),statsOverride:structuredClone(h.stats)};
 manifest.addedChampionIds.push(h.id);manifest.implementedRecommendations.push({championId:h.id,name:h.name,faction:h.faction,color:h.color,rarity:h.rarity,role:h.role,manaSpeed:h.manaSpeed,gap:h.gap,status:'implemented'});
}
assert.equal(roster.length,248);assert.equal(sha(roster.slice(0,240)),manifest.originalRecordsSha256);assert.equal(sha(source.slice(0,240)),manifest.originalSourceRecordsSha256);
for(const [file,value]of [['data/champions.json',roster],['data/source-champions.json',source],['data/roster-design.json',design],['data/roster-expansion-10.json',manifest]])await writeFile(file,JSON.stringify(value,null,2)+'\n');
console.log('Added eight Djedi champions; all 240 baseline records and portrait hashes preserved.');
