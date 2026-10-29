// Reproducible Legends-only roster design. Never reads or writes the original game.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {EFFECTS,BUFFS} from '../src/effects.js';
// Existing live records are authoritative: a catalog rebuild may add heroes, never rebalance them.
const retained=new Map(JSON.parse(await readFile('data/champions.json','utf8')).map(c=>[c.id,c]));
const source=JSON.parse(await readFile('data/source-champions.json','utf8'));
const design=JSON.parse(await readFile('data/roster-design.json','utf8')).champions;
export const SPEEDS={very_fast:6.5,fast:8,average:10,slow:12,very_slow:13.5};
const labels={very_fast:'Very Fast',fast:'Fast',average:'Average',slow:'Slow',very_slow:'Very Slow'};
const buffIds=BUFFS;
const statusDesign=JSON.parse(await readFile('data/status-design.json','utf8')).champions;
const dotIds=new Set(['poison','burn','frostbite']);
const targets={
 common:{atk:[460,350,580],def:[450,340,560],hp:[800,620,980]},
 rare:{atk:[626,501,776],def:[600,440,752],hp:[1083,835,1330]},
 legendary:{atk:[760,596,854],def:[726,598,850],hp:[1393,1226,1645]},
 mythical:{atk:[835,730,970],def:[800,700,930],hp:[1540,1350,1800]},
};
const roleOffsets={attack:{atk:65,def:-35,hp:-70},defense:{atk:-75,def:70,hp:110},support:{atk:-35,def:10,hp:30}};
const hash=(id,suffix)=>parseInt(createHash('sha256').update(id+suffix).digest('hex').slice(0,8),16)/0xffffffff;
const clone=structuredClone;
function merge(c){
 const merged=new Map();
 for(const slot of ['a2','a3'])for(let [id,turns]of c.kit[slot]||[]){
  if(id==='taunt')id='guard';
  if(id==='inc_spd')id='mana_surge';if(id==='dec_spd')id='mana_slow';
  if(id==='burn'&&design[c.id].color==='blue')id='frostbite';
  const previous=merged.get(id);if(previous){previous.turns=Math.max(previous.turns,turns);previous.from.push(slot);}else merged.set(id,{id,turns,from:[slot]});
 }
 return [...merged.values()];
}
function tier(c,entries,level,total,speed,tiles){
 const ratio=total===1?1:total===2?(level===1?.68:1):[.38,.7,1.12][level-1];
 // Every effect survives at full charge; early charging tiers deliberately have fewer effects.
 const selected=total===1||level===total?entries:entries.filter((e,i)=>e.from.includes('a2')||i<Math.ceil(entries.length*(level/total))).slice(0,level===1?2:3);
 const aoe=selected.some(e=>e.id==='aoe');
 const pace=total>1?1:({very_fast:.8,fast:.9,average:1,slow:1.1,very_slow:1.18}[speed]);
 const rareFactor={common:.86,rare:.94,legendary:1,mythical:1.03}[c.rarity];
 const debuffs=selected.filter(e=>!buffIds.has(e.id)&&!['aoe','ignore_def','remove_debuffs'].includes(e.id));
 const target=c.role==='support'?(c.rarity==='common'?'ally':'self'):'enemy';
 const baseDamage=c.role==='support'?(debuffs.length?(aoe?.7:1.1):0):c.role==='defense'?(aoe?1:1.6):(aoe?1.65:2.8);
 const damage=Math.round(baseDamage*ratio*pace*rareFactor*100)/100;
 const healing=c.role==='support'?Math.round((c.rarity==='common'?.32:c.rarity==='rare'?.32:.29)*Math.min(1.2,ratio)*pace*100)/100:0;
 const teamShield=c.role==='defense'&&['rare','legendary','mythical'].includes(c.rarity);
 const effects=selected.filter(e=>!['aoe','ignore_def'].includes(e.id)).map(e=>{
  const scope=e.id==='guard'?'self':e.id==='remove_debuffs'?'allies':buffIds.has(e.id)?(c.role==='support'&&c.rarity!=='common'||teamShield&&e.id==='shield'?'allies':c.role==='support'?'ally':'self'):e.id==='taunt'?'enemies':aoe?'enemies':'enemy';
  return {id:e.id,turns:e.turns?Math.max(1,Math.min(3,Math.round(e.turns*(total>1&&level<total?.65:1)))):0,scope};
 });
 const spec={level,speed,tiles,target,damage,healing,healScope:c.rarity==='common'?'ally':'allies',aoe,pierce:selected.some(e=>e.id==='ignore_def'),effects};
 const changes=statusDesign[c.id];if(changes&&(!changes.fullOnly||level===total)){
  for(const effect of spec.effects){effect.id=changes.replace?.[effect.id]||effect.id;if(!EFFECTS[effect.id].timed)effect.turns=0;if(effect.id==='mana_block')effect.turns=Math.min(2,effect.turns);}
  for(const extra of changes.add||[])spec.effects.push({...extra,turns:extra.turns&&level<total?Math.min(1,extra.turns):extra.turns});
  if(changes.damageScale)spec.damage=Math.round(spec.damage*changes.damageScale*100)/100;
  if(changes.healingScale)spec.healing=Math.round(spec.healing*changes.healingScale*100)/100;
 }
 if(design[c.id].specialOverride)Object.assign(spec,clone(design[c.id].specialOverride));
 return spec;
}
const roster=source.map(c=>{
 const d=design[c.id];if(!d)throw Error('Missing design '+c.id);
 if(c.rarity==='mythical'&&c.id!=='yshmir_worldwound'&&d.manaSpeed==='very_slow')throw Error('Only Yshmir may use Very Slow Mythical mana: '+c.id);
 const entries=merge(c),total=d.chargeLevels||1;
 const levels=d.levelOverrides?clone(d.levelOverrides):Array.from({length:total},(_,i)=>tier(c,entries,i+1,total,total===1?d.manaSpeed:total===2?['fast','average'][i]:['charge_1','charge_2','charge_3'][i],total===1?SPEEDS[d.manaSpeed]:total===2?[8,10][i]:[5,10,15][i]));
 const {spd,kit,ability_desc,...identity}=c;
 const passive=clone(d.passiveOverride||c.passive);if(passive?.immune){passive.immune=passive.immune.map(id=>id==='dec_spd'?'mana_slow':id==='taunt'?'mana_block':id);if(c.passive.immune.includes('dec_spd'))passive.desc='Immune to Mana Slow.';if(c.passive.immune.includes('taunt'))passive.desc='Immune to Mana Block.';}
 return {...identity,color:d.color,manaSpeed:d.manaSpeed,special:{name:c.ability_name,charging:total>1,levels},ability_desc:'',passive};
});
for(const rarity of Object.keys(targets)){
 const group=roster.filter(c=>c.rarity===rarity);
 for(const stat of ['atk','def','hp']){
  const [mean,min,max]=targets[rarity][stat];
  const original=source.filter(c=>c.rarity===rarity),low=Math.min(...original.map(c=>c[stat])),high=Math.max(...original.map(c=>c[stat]));
  const offsetMean=group.reduce((n,c)=>n+roleOffsets[c.role][stat],0)/group.length;
  for(const c of group){const originalStat=original.find(o=>o.id===c.id)[stat];const variation=((originalStat-low)/(high-low)-.5)*(stat==='hp'?100:45)+(hash(c.id,stat)-.5)*(stat==='hp'?70:30);c[stat]=Math.max(min,Math.min(max,Math.round(mean+roleOffsets[c.role][stat]-offsetMean+variation)));}
  const order=group.slice().sort((a,b)=>hash(a.id,stat)-hash(b.id,stat));let difference=mean*group.length-group.reduce((n,c)=>n+c[stat],0);
  while(difference){let changed=false;for(const c of order){const delta=Math.sign(difference);if(c[stat]+delta<min||c[stat]+delta>max)continue;c[stat]+=delta;difference-=delta;changed=true;if(!difference)break;}if(!changed)throw Error('Impossible stat target');}
 }
}
for(let i=0;i<roster.length;i++){const saved=retained.get(roster[i].id);if(saved)roster[i]=clone(saved);else if(design[roster[i].id].statsOverride)Object.assign(roster[i],clone(design[roster[i].id].statsOverride));}
const {skillDescription}=await import('../src/engine.js');
const effects=EFFECTS;
await writeFile('data/effects.json',JSON.stringify(effects,null,2)+'\n');
for(const c of roster)if(!retained.has(c.id))c.ability_desc=skillDescription(c,effects,c.special.levels.length).text;
await writeFile('data/champions.json',JSON.stringify(roster,null,2)+'\n');
const counts=(key,values)=>Object.fromEntries(values.map(v=>[v,roster.filter(c=>c[key]===v).length]));
const report={version:3,champions:roster.length,colorCounts:counts('color',['red','blue','green','yellow','purple']),manaCounts:counts('manaSpeed',[...Object.keys(SPEEDS),'charging']),chargingChampions:roster.filter(c=>c.special.charging).map(c=>({id:c.id,tiles:c.special.levels.map(l=>l.tiles)})),rarities:Object.fromEntries(Object.keys(targets).map(r=>{const g=roster.filter(c=>c.rarity===r);return [r,{count:g.length,stats:Object.fromEntries(['atk','def','hp'].map(s=>[s,{min:Math.min(...g.map(c=>c[s])),average:g.reduce((n,c)=>n+c[s],0)/g.length,max:Math.max(...g.map(c=>c[s]))}]))}];}))};
await writeFile('data/balance-report.json',JSON.stringify(report,null,2)+'\n');
let table=`# Warband Legends Champion Catalog\n\n${roster.length} champions. The newest expansion adds eleven audit-led champions: nine Legendaries and two Rares. All previous character records and artwork are preserved. Stats below are maximum-level baselines; each owned copy develops independently.\n\n`;
table+='| Champion | Rarity | Color | Type | ATK | DEF | HP | Mana (tiles) |\n| --- | --- | --- | --- | ---: | ---: | ---: | --- |\n';
for(const c of roster)table+=`| ${c.name} | ${c.rarity} | ${c.color} | ${c.role} | ${c.atk} | ${c.def} | ${c.hp} | ${c.special.charging?'Charging '+c.special.levels.map(l=>l.tiles).join(' / '):labels[c.manaSpeed]+' '+c.special.levels[0].tiles} |\n`;
table+='\n## Specials\n\n';
for(const c of roster){table+=`### ${c.name} — ${c.special.name}\n\n`;for(const l of c.special.levels){const desc=skillDescription(c,effects,l.level);table+=`- ${c.special.charging?'Charge '+l.level+' · ':''}${l.tiles} tiles: ${desc.text} ${desc.effects.map(e=>e.name+' ('+e.scope+(e.duration?', '+e.duration+' turns':'')+')').join('; ')}.\n`;}if(c.passive)table+=`\nPassive: **${c.passive.name}** — ${c.passive.desc}\n`;table+='\n';}
await writeFile('docs/ROSTER.md',table);
console.log(JSON.stringify(report,null,2));
