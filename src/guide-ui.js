import {factionGuideHTML} from './faction-ui.js';
import {EFFECTS} from './effects.js';
import {effectIcon} from './icons.js';
import {SUMMON_ODDS} from './progression.js';
import {heroInsight} from './tactics-ui.js';
export const guideTopics={roster:'growth',champion:'growth',summon:'summon'};
const battleRules=[
 ['Elements','<img class="element-advantages" src="./assets/guide/element-advantages.webp" alt="Red beats Green; Green beats Blue; Blue beats Red. Yellow and Purple are strong against each other.">'],
 ['Mana','Empty lanes give double mana. Specials spend all charge without using a move. Enemies gain 4 charge per attack opportunity.'],
];
const topics=[
 ['battles','Battles',[...battleRules,['Energy','Campaign / Dungeons: 1/2/3 Energy (Normal/Hard/Nightmare). Arena: 1. Capacity: 50 + profile level. Full refill at midnight PST and on level-up. Entry costs are not refunded. Events use attempts.']]],
 ['growth','Heroes',[
  ['Feeding','Common / Rare copies cost 25 Gold to feed. Rare: 3× Common XP; matching Rare hero: another 5×. Same element: +25%. Saved teams are protected.'],
  ['Ascension','Each tier adds 2% stats and restarts at level 1 without losing power. Copies develop separately.'],
  ['Limit Break','Rare or higher: two breaks after full ascension, each adding 5 levels and 3% stats. The second adds a 2-move role buff.'],
 ]],
 ['factions','Factions',[['Faction Bonuses',factionGuideHTML()]]],
 ['effects','Effects',[]],
 ['tools','Tools',[]],
 ['summon','Summoning',[
  ['Summoning Odds',SUMMON_ODDS.map(o=>`${o.rarity==='double_common'?'Two Commons':o.rarity[0].toUpperCase()+o.rarity.slice(1)}: ${o.chance}%`).join(' · ')],
  ['Hymn of Ten','Ten summons with at least one Rare or better. Two-Common bonuses still apply.'],
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
 return `<article><h3>Effects Guide</h3><p>Durations count board moves. Identical effects refresh; opposing stat effects replace each other. Different bonuses multiply; different damage-over-time effects coexist.</p><p><strong>Cleanse</strong> removes allied ailments; <strong>Dispel</strong> removes enemy buffs. Passives cannot be removed.</p></article><div class="codex-tabs" role="group" aria-label="Effect categories">${effectKinds.map(([key,label])=>`<button class="${key===selected?'active':''}" aria-pressed="${key===selected}" data-action="guide-effects" data-kind="${key}">${label}</button>`).join('')}</div><div class="effect-codex">${cards.map(id=>effectCard(id)).join('')}</div>`;
}
export function guideHTML(id='overview',champion=null,effectKind='buff',profile={}){
 const key=id==='heroes'?'growth':id==='overview'?'battles':id;
 const selected=topics.find(t=>t[0]===key)||topics[0];
 return `<div class="guide-layout"><nav aria-label="Guide topics">${topics.map(([key,label])=>`<button class="${key===selected[0]?'active':''}" aria-pressed="${key===selected[0]}" data-action="guide-topic" data-topic="${key}">${label}</button>`).join('')}</nav><section aria-label="${selected[1]}">${selected[0]==='tools'?`<div class="guide-tools"><label class="guide-playtesting" for="open-roster"><span><b>Playtesting</b><small>All heroes at maximum level. No battle rewards or progress.</small></span><input type="checkbox" id="open-roster" ${profile.openRoster?'checked':''}></label><button class="button outline guide-restart" data-action="restart-preview">Restart Journey</button></div>`:selected[0]==='effects'?effectsGuideHTML(effectKind):selected[2].map(([title,body])=>`<article><h3>${title}</h3>${content(body)}</article>`).join('')}${champion&&selected[0]==='growth'?heroInsight(champion):''}</section></div>`;
}
