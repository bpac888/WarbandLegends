import {FACTION_BONUSES,factionGroups,factionRule} from './faction-bonuses.js';
export function factionTeamHTML(team){
 const groups=factionGroups(team);
 if(!groups.length)return '<div class="faction-team-empty">Faction Bonuses <span>None Active</span></div>';
 return `<details class="faction-team-bonuses"><summary>Faction Bonuses <span>${groups.map(g=>`${g.name} · ${g.tier===3?'3+':2}`).join(' / ')}</span></summary><div>${groups.map(g=>`<article><b>${g.name} · ${g.tier===3?'3+':2}</b><p>${g.tiers[g.tier].text}</p></article>`).join('')}</div></details>`;
}
export function factionUnitHTML(unit){
 if(!Object.keys(factionRule(unit)).length)return '';
 return `<p class="faction-unit-bonus"><b>${FACTION_BONUSES[unit.faction].name} · ${unit.factionTier===3?'3+':2} Faction Bonus</b>${unit.factionStacks?`<span>Umbral Growth ×${unit.factionStacks} · +${unit.factionStacks*2}% ATK / DEF / HP</span>`:''}</p>`;
}
export function factionGuideHTML(){return `<div class="faction-guide"><p>Only matching members benefit. Two members unlock tier 2; three, four or five use tier 3 only. The starting team fixes the tier for the battle. Bonuses cannot be dispelled.</p><div class="faction-guide-list">${Object.values(FACTION_BONUSES).map(f=>`<details><summary>${f.name}</summary><dl><div><dt>2 Members</dt><dd>${f.tiers[2].text}</dd></div><div><dt>3+ Members</dt><dd>${f.tiers[3].text}</dd></div></dl></details>`).join('')}</div><p>Each valid board move is one turn; Specials and extra cascades add no turns. Per-turn bonuses affect living members at the start of that move. Matching-rune mana bonuses multiply with Mana Flow/Slow and include empty-lane charge; flat gifts are unchanged. Chymera rolls per successfully applied timed enemy ailment, allowing up to 4 turns. Umbra gains add 2% of battle-start stats per success; max-HP growth also grants that much current HP. Each Nether member rolls once at battle start for their own percentage of maximum mana.</p></div>`;}
