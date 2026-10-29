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
export function factionGuideHTML(){return `<div class="faction-guide"><p>Only matching members benefit. Two unlock tier 2; three or more use tier 3 only. Tiers lock at battle start and cannot be dispelled.</p><div class="faction-guide-list">${Object.values(FACTION_BONUSES).map(f=>`<details><summary>${f.name}</summary><dl><div><dt>2 Members</dt><dd>${f.tiers[2].text}</dd></div><div><dt>3+ Members</dt><dd>${f.tiers[3].text}</dd></div></dl></details>`).join('')}</div><p>Each board move is one turn; Specials and cascades add none. Turn bonuses apply to living members at move start. Rune mana bonuses multiply with Mana Flow/Slow and empty-lane charge; flat gifts stay fixed. Chymera rolls per applied timed ailment, up to 4 turns. Umbra stacks 2% of starting stats; HP growth also grants current HP. Nether members each roll once for their own opening mana.</p></div>`;}
