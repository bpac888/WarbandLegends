import {heroInsight} from './tactics-ui.js';
// Keep only rules that cannot be read directly from the controls.
export const guideTopics={roster:'growth',champion:'growth',shop:'rewards',summon:'summon',daily:'rewards',quests:'rewards',events:'adventure',arena:'adventure',inventory:'rewards',settings:'account',campaign:'adventure',dungeons:'adventure',world:'adventure'};
const battleRules=[
 ['Elements','Red → Green → Blue → Red. Yellow and Purple are strong against each other.'],
 ['Mana','Empty lanes give double mana. Specials spend all charge without using a turn. Enemies gain 4 charge per attack opportunity.'],
 ['Special runes','Match 4: Blast. Match 5+: Prism. Activate by swapping or tapping twice.'],
 ['Auto & speed','Auto plays at ×2; manual input takes over. Each battle resets to ×1 with Auto off.'],
];
const topics=[
 ['battles','Battles',battleRules],
 ['growth','Heroes',[
  ['Feeding','25 Gold per copy. Rares give 3× Common XP; same-hero Rare copies give 5× Rare XP (15× Common XP). Same color: +25%. Donors are consumed; team copies are protected.'],
  ['Ascension','New tiers restart at level 1, keeping power and adding 2% stats. Copies grow independently; Codex shows maximum stats.'],
  ['Limit Break','Rare and higher: two breaks after full ascension, each adding 5 levels and 3% stats. Break 2 grants a two-move opening buff based on role.'],
 ]],
 ['adventure','Events & Arena',[
  ['Event dates','Los Angeles time: Crimson Eclipse 1–8; Frostwake Siege 9–16; Veil of Umbra 17–24.'],
  ['Attempts','20 per event window. Entering spends one, including abandoned fights. Arena opponents are preset teams.'],
 ]],
 ['summon','Summoning',[
  ['Ten calls','Guarantees a Rare or better. Two-Common results still occur; if needed, the final call becomes one Rare.'],
 ]],
 ['rewards','Rewards',[
  ['Daily reset','Midnight in Los Angeles. Missed days keep your calendar progress.'],
  ['Counting progress','Daily gifts and quest Gems count toward Today’s Path. Collection quests count different hero designs, not copies.'],
 ]],
 ['account','Saves',[
  ['Your save','Progress belongs to this browser; clearing its data deletes it. Leaving or refreshing abandons unfinished battles.'],
  ['Playtesting','Open-roster battles grant no rewards or progress.'],
 ]],
];
export function guideHTML(id='overview',champion=null){
 const key=id==='heroes'?'growth':id==='overview'?'battles':id;
 const selected=topics.find(t=>t[0]===key)||topics[0];
 return `<div class="guide-layout"><nav aria-label="Guide topics">${topics.map(([key,label])=>`<button class="${key===selected[0]?'active':''}" aria-pressed="${key===selected[0]}" data-action="guide-topic" data-topic="${key}">${label}</button>`).join('')}</nav><section><h2>${selected[1]}</h2>${selected[2].map(([title,body])=>`<article><h3>${title}</h3><p>${body}</p></article>`).join('')}${champion&&selected[0]==='growth'?heroInsight(champion):''}</section></div>`;
}
export function battleHelpHTML(){return `<div class="help-grid">${battleRules.map(([title,body])=>`<section><b>${title}</b><p>${body}</p></section>`).join('')}</div>`;}
