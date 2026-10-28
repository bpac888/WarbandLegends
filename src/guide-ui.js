import {factionGuideHTML} from './faction-ui.js';
import {EFFECTS} from './effects.js';
import {effectIcon} from './icons.js';
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
 ['factions','Factions',[['Faction Bonuses',factionGuideHTML()]]],
 ['effects','Effects',[]],
 ['summon','Summoning',[
  ['Summoning Odds',SUMMON_ODDS.map(o=>`${o.rarity==='double_common'?'Two Commons':o.rarity[0].toUpperCase()+o.rarity.slice(1)}: ${o.chance}%`).join(' · ')],
  ['Ten Calls','At least one Rare or better is guaranteed. Two-Common results can still occur.'],
 ]],
];
const content=body=>body.startsWith('<')?body:`<p>${body}</p>`;
const effectKinds=[['buff','Buffs'],['debuff','Ailments'],['action','Instant Actions']];
export function effectCard(id,detail=''){
 const e=EFFECTS[id],safeDetail=detail.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return `<article class="codex-card ${e.cat==='debuff'?'ailment':'blessing'}"><div class="codex-icon ${id.startsWith('vulnerable_')?id.slice(11):''}">${effectIcon(id)}</div><div><small>${e.timed?e.cat==='debuff'?'AILMENT':'BUFF':'INSTANT ACTION'}${detail?' · '+safeDetail:''}</small><h3>${e.name}</h3><p>${e.desc}</p></div></article>`;
}
function effectsGuideHTML(kind){
 const selected=effectKinds.some(([key])=>key===kind)?kind:'buff';
 const cards=Object.keys(EFFECTS).filter(id=>selected==='action'?!EFFECTS[id].timed:EFFECTS[id].timed&&EFFECTS[id].cat===selected);
 return `<article><h3>Effects Guide</h3><p>Durations count completed board moves. Identical effects refresh; opposing stat effects replace each other. Different bonuses multiply and different damage-over-time effects can coexist.</p><p><strong>Cleanse</strong> removes allied ailments; <strong>Dispel</strong> removes enemy buffs. Neither removes passives.</p></article><div class="codex-tabs" role="group" aria-label="Effect categories">${effectKinds.map(([key,label])=>`<button class="${key===selected?'active':''}" aria-pressed="${key===selected}" data-action="guide-effects" data-kind="${key}">${label}</button>`).join('')}</div><div class="effect-codex">${cards.map(id=>effectCard(id)).join('')}</div>`;
}
export function guideHTML(id='overview',champion=null,effectKind='buff'){
 const key=id==='heroes'?'growth':id==='overview'?'battles':id;
 const selected=topics.find(t=>t[0]===key)||topics[0];
 return `<div class="guide-layout"><nav aria-label="Guide topics">${topics.map(([key,label])=>`<button class="${key===selected[0]?'active':''}" aria-pressed="${key===selected[0]}" data-action="guide-topic" data-topic="${key}">${label}</button>`).join('')}</nav><section aria-label="${selected[1]}">${selected[0]==='effects'?effectsGuideHTML(effectKind):selected[2].map(([title,body])=>`<article><h3>${title}</h3>${content(body)}</article>`).join('')}${champion&&selected[0]==='growth'?heroInsight(champion):''}</section></div>`;
}
