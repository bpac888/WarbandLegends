import {FACTION_BONUSES,factionGroups,factionRule} from './faction-bonuses.js?v=0.53.6';
const tierLabel=(f,t)=>f==='goblins'?'1+':f==='magic'?t:f==='djedi'?'2+':t===3?'3+':2;
export function factionTeamHTML(team,{flat=false}={}){
 const groups=factionGroups(team);
 if(!groups.length)return '<div class="faction-team-empty">Faction Bonuses <span>None Active</span></div>';
 if(flat)return `<div class="entry-team-bonuses" aria-label="Faction Bonuses">${groups.map(g=>`<article><b>${g.name} · ${tierLabel(g.faction,g.tier)}</b><p>${g.tiers[g.tier].text}</p></article>`).join('')}</div>`;
 return `<details class="faction-team-bonuses"><summary>Faction Bonuses <span>${groups.map(g=>`${g.name} · ${tierLabel(g.faction,g.tier)}`).join(' / ')}</span></summary><div>${groups.map(g=>`<article><b>${g.name} · ${tierLabel(g.faction,g.tier)}</b><p>${g.tiers[g.tier].text}</p></article>`).join('')}</div></details>`;
}
export function factionUnitHTML(unit){
 if(!Object.keys(factionRule(unit)).length&&!unit.factionManaBonus)return '';
 const own=Object.keys(factionRule(unit)).length;
 return `<p class="faction-unit-bonus">${own?`<b>${FACTION_BONUSES[unit.faction].name} · ${tierLabel(unit.faction,unit.factionTier)} Faction Bonus</b>`:''}${unit.faction==='goblins'&&own?'<span>70% chance to resist new Mana Slow or Mana Block applications</span>':''}${unit.factionManaBonus?`<span>Magic Aura · +${Math.round(unit.factionManaBonus*100)}% mana generation</span>`:''}${unit.factionStacks?`<span>Umbral Growth ×${unit.factionStacks} · +${unit.factionStacks*2}% ATK / DEF / HP</span>`:''}</p>`;
}
const factionGuideRules=(id,f)=>{
 if(id==='magic')return [['1+',{text:'Each Magic champion gives all allies +5% mana generation. Stacks up to +25%.'}]];
 return Object.entries(f.tiers).map(([tier,rule])=>{let text=rule.text;
 if(id==='goblins')text='70% chance to block Mana Slow or Mana Block. Goblins only; non-stacking.';
 if(id==='djedi')text='+10% ATK to Winded Guild members. Non-stacking.';
 if(id==='nether')text=`Battle start: ${rule.openingChance===1?'each member gains':Math.round(rule.openingChance*100)+'% chance per member for'} ${Math.round(rule.openingMana*100)}% max mana.`;
 if(id==='umbra')text=`Each member: ${Math.round(rule.growthChance*100)}% chance per turn for +2% ATK, DEF and HP. Stacks.`;
 if(id==='chymera')text=rule.extendChance===1?'Special ailments last 1 extra turn.':'50% chance to extend Special ailments by 1 turn.';
 text=text.replace('Tailwind Guard: ','');return [tier,{text}];});
};
export function factionGuideHTML(){return `<div class="faction-guide"><div class="faction-guide-list">${Object.entries(FACTION_BONUSES).map(([id,f])=>`<details><summary>${f.name}</summary><dl>${factionGuideRules(id,f).map(([tier,rule])=>`<div><dt>${id==='goblins'||id==='magic'?'1+':id==='djedi'?'2+':Number(tier)===3?'3+':tier} Members</dt><dd>${rule.text}</dd></div>`).join('')}</dl></details>`).join('')}</div></div>`;}
