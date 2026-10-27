import {SUMMON_ODDS} from './progression.js';
import {heroInsight} from './tactics-ui.js';
// Keep only rules that cannot be read directly from the controls.
export const guideTopics={roster:'growth',champion:'growth',summon:'summon'};
const battleRules=[
 ['Elements','<img class="element-advantages" src="./assets/guide/element-advantages.webp" alt="Red beats Green; Green beats Blue; Blue beats Red. Yellow and Purple are strong against each other.">'],
 ['Mana','Empty lanes give double mana. Specials spend all charge without using a turn. Enemies gain 4 charge per attack opportunity.'],
];
const topics=[
 ['battles','Battles',battleRules],
 ['growth','Heroes',[
  ['Feeding','25 Gold per copy. Rares give 3× Common XP; same-hero Rare copies give 5× Rare XP (15× Common XP). Same color: +25%. Donors are consumed; team copies are protected.'],
  ['Ascension','New tiers restart at level 1, keeping power and adding 2% stats. Copies grow independently; Codex shows maximum stats.'],
  ['Limit Break','Rare and higher: two breaks after full ascension, each adding 5 levels and 3% stats. Break 2 grants a two-move opening buff based on role.'],
 ]],
 ['summon','Summoning',[
  ['Summoning Odds',SUMMON_ODDS.map(o=>`${o.rarity==='double_common'?'Two Commons':o.rarity[0].toUpperCase()+o.rarity.slice(1)}: ${o.chance}%`).join(' · ')],
  ['Ten calls','Guarantees a Rare or better. Two-Common results still occur; if needed, the final call becomes one Rare.'],
 ]],
];
export function guideHTML(id='overview',champion=null){
 const key=id==='heroes'?'growth':id==='overview'?'battles':id;
 const selected=topics.find(t=>t[0]===key)||topics[0];
 return `<div class="guide-layout"><nav aria-label="Guide topics">${topics.map(([key,label])=>`<button class="${key===selected[0]?'active':''}" aria-pressed="${key===selected[0]}" data-action="guide-topic" data-topic="${key}">${label}</button>`).join('')}</nav><section><h2>${selected[1]}</h2>${selected[2].map(([title,body])=>`<article><h3>${title}</h3><p>${body}</p></article>`).join('')}${champion&&selected[0]==='growth'?heroInsight(champion):''}</section></div>`;
}
export function battleHelpHTML(){return `<div class="help-grid">${battleRules.map(([title,body])=>`<section><b>${title}</b><p>${body}</p></section>`).join('')}</div>`;}
