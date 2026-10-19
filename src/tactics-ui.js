import {chargeComparison} from './special-plan.js';
import {HERO_INSIGHTS} from './hero-insights.js';
import {scenarioStatus,SCENARIOS} from './chapter.js';
import {glyph} from './card-ui.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function heroInsight(unit){const insight=HERO_INSIGHTS[unit.id];return insight?`<details class="hero-tactics"><summary>${glyph(unit.role==='defense'?'defense':unit.role==='support'?'health':'attack')} ${esc(insight.role)} · How to use this Special</summary><p>${esc(insight.decision)}</p><p class="tactics-counter"><b>Know the limits</b>${esc(insight.counter)}</p></details>`:'';}
export function encounterTactics(stage,state=null){
 const status=state&&scenarioStatus(state);
 if(!stage.tactic&&!status)return '';
 return `<section class="encounter-tactics" aria-label="Encounter tactics"><span class="tactic-emblem" aria-hidden="true">${glyph(stage.scenario?'defense':'attack')}</span><div><span class="eyebrow">${esc(stage.chapter)} · ${esc(stage.tacticLabel)}</span><h3>${esc(stage.objective)}</h3><p>${esc(stage.tactic)}</p>${status?`<p class="scenario-state" data-scenario-phase="${status.phase}"><b>${esc(status.name)}</b> ${esc(status.text)}</p>`:''}${state&&!state.scenario&&stage.scenario?`<p class="tactics-counter">This saved battle began before guardian phases were added. It keeps its original rules; start a new encounter to face ${esc(SCENARIOS[stage.scenario]?.name||'the guardian phase')}.</p>`:''}</div></section>`;
}

export function chargeComparisonHTML(unit,level){
 const index=unit.special.levels.findIndex(s=>s.level===level);if(index<1)return '';
 const changes=chargeComparison(unit.special.levels[index-1],unit.special.levels[index]);
 return `<details class="charge-comparison"><summary>Compare with Charge ${unit.special.levels[index-1].level}</summary><dl>${changes.map(c=>`<div><dt>${esc(c.name)}</dt><dd><span>${esc(c.before)}</span><b aria-hidden="true">→</b><strong>${esc(c.after)}</strong></dd></div>`).join('')}</dl><p>Casting either charge spends all stored charge. More charge can change targets as well as power.</p></details>`;
}
