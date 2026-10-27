import {SUMMON_ODDS} from './progression.js';
import {heroInsight} from './tactics-ui.js';
export const guideTopics={roster:'growth',champion:'growth',summon:'summon'};
const battleRules=[
 ['Elements','<img class="element-advantages" src="./assets/guide/element-advantages.webp" alt="Red beats Green; Green beats Blue; Blue beats Red. Yellow and Purple are strong against each other.">'],
 ['Mana','Empty lanes give double mana. Specials spend all charge without using a board move. Enemies gain 4 charge per attack opportunity.'],
];
const topics=[
 ['battles','Battles',[...battleRules,['Energy','Campaign and Dungeons cost 1/2/3 Energy on Normal/Hard/Nightmare; Arena costs 1. The cap is 50 + profile level. Midnight PST and profile level-ups refill it fully. Leaving or losing does not refund energy. Special Events use attempts instead.']]],
 ['growth','Heroes',[
  ['Feeding','Feed Common or Rare copies for 25 Gold each. Rare: 3× Common XP; same-hero Rare: another 5×. Same color: +25%. Team copies are protected.'],
  ['Ascension','Tiers restart at level 1, retain earned power and add 2% stats. Each copy develops separately.'],
  ['Limit Break','Rare and higher: two breaks after full ascension. Each adds 5 levels and 3% stats. The second grants a 2-move role buff.'],
 ]],
 ['summon','Summoning',[
  ['Summoning Odds',SUMMON_ODDS.map(o=>`${o.rarity==='double_common'?'Two Commons':o.rarity[0].toUpperCase()+o.rarity.slice(1)}: ${o.chance}%`).join(' · ')],
  ['Ten Calls','At least one Rare or better is guaranteed. Two-Common results can still occur.'],
 ]],
];
const content=body=>body.startsWith('<img')?body:`<p>${body}</p>`;
export function guideHTML(id='overview',champion=null){
 const key=id==='heroes'?'growth':id==='overview'?'battles':id;
 const selected=topics.find(t=>t[0]===key)||topics[0];
 return `<div class="guide-layout"><nav aria-label="Guide topics">${topics.map(([key,label])=>`<button class="${key===selected[0]?'active':''}" aria-pressed="${key===selected[0]}" data-action="guide-topic" data-topic="${key}">${label}</button>`).join('')}</nav><section aria-label="${selected[1]}">${selected[2].map(([title,body])=>`<article><h3>${title}</h3>${content(body)}</article>`).join('')}${champion&&selected[0]==='growth'?heroInsight(champion):''}</section></div>`;
}
export function battleHelpHTML(){return `<div class="help-grid">${battleRules.map(([title,body])=>`<section><b>${title}</b>${content(body)}</section>`).join('')}</div>`;}
