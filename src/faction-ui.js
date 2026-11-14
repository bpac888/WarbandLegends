import {FACTION_BONUSES,factionGroups,factionRule} from './faction-bonuses.js?v=0.50.1';
const tierLabel=(f,t)=>f==='goblins'?'1+':f==='magic'?t:f==='djedi'?'2+':t===3?'3+':2;
export function factionTeamHTML(team){
 const groups=factionGroups(team);
 if(!groups.length)return '<div class="faction-team-empty">Faction Bonuses <span>None Active</span></div>';
 return `<details class="faction-team-bonuses"><summary>Faction Bonuses <span>${groups.map(g=>`${g.name} · ${tierLabel(g.faction,g.tier)}`).join(' / ')}</span></summary><div>${groups.map(g=>`<article><b>${g.name} · ${tierLabel(g.faction,g.tier)}</b><p>${g.tiers[g.tier].text}</p></article>`).join('')}</div></details>`;
}
export function factionUnitHTML(unit){
 if(!Object.keys(factionRule(unit)).length&&!unit.factionManaBonus)return '';
 const own=Object.keys(factionRule(unit)).length;
 return `<p class="faction-unit-bonus">${own?`<b>${FACTION_BONUSES[unit.faction].name} · ${tierLabel(unit.faction,unit.factionTier)} Faction Bonus</b>`:''}${unit.faction==='goblins'&&own?'<span>70% chance to resist new Mana Slow or Mana Block applications</span>':''}${unit.factionManaBonus?`<span>Magic Aura · +${Math.round(unit.factionManaBonus*100)}% mana generation</span>`:''}${unit.factionStacks?`<span>Umbral Growth ×${unit.factionStacks} · +${unit.factionStacks*2}% ATK / DEF / HP</span>`:''}</p>`;
}
export function factionGuideHTML(){return `<div class="faction-guide"><div class="faction-guide-list">${Object.values(FACTION_BONUSES).map(f=>`<details><summary>${f.name}</summary><dl>${Object.entries(f.tiers).map(([tier,rule])=>`<div><dt>${f.name==='Goblins'?'1+':f.name==='Magic'?tier:f.name==='Winded Guild'?'2+':Number(tier)===3?'3+':tier} ${tier==='1'&&f.name!=='Goblins'?'Member':'Members'}</dt><dd>${rule.text}</dd></div>`).join('')}</dl></details>`).join('')}</div></div>`;}
