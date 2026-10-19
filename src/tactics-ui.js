import {HERO_INSIGHTS} from './hero-insights.js';
import {scenarioStatus} from './chapter.js';
import {glyph} from './card-ui.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function heroInsight(unit){const insight=HERO_INSIGHTS[unit.id];return insight?`<details class="hero-tactics"><summary>${glyph(unit.role==='defense'?'defense':unit.role==='support'?'health':'attack')} ${esc(insight.role)} · How to use this Special</summary><p>${esc(insight.decision)}</p><p class="tactics-counter"><b>Know the limits</b>${esc(insight.counter)}</p></details>`:'';}
export function encounterTactics(stage,state=null){
 const status=state&&scenarioStatus(state);
 if(!stage.tactic&&!status)return '';
 return `<section class="encounter-tactics" aria-label="Encounter tactics"><span class="tactic-emblem" aria-hidden="true">${glyph(stage.scenario?'defense':'attack')}</span><div><span class="eyebrow">${esc(stage.chapter)} · ${esc(stage.tacticLabel)}</span><h3>${esc(stage.objective)}</h3><p>${esc(stage.tactic)}</p>${status?`<p class="scenario-state" data-scenario-phase="${status.phase}"><b>${esc(status.name)}</b> ${esc(status.text)}</p>`:''}${state&&!state.scenario&&stage.scenario?'<p class="tactics-counter">This saved battle began before guardian phases were added. It keeps its original rules; start a new encounter to face Overpressure.</p>':''}</div></section>`;
}
