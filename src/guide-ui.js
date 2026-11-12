import {LIMIT_BREAK_BUFF_TURNS} from './ascension.js?v=0.41.1';
import {factionGuideHTML} from './faction-ui.js?v=0.41.1';
import {EFFECTS} from './effects.js?v=0.41.1';
import {effectIcon} from './icons.js?v=0.41.1';
import {SUMMON_ODDS} from './progression.js?v=0.41.1';
import {heroInsight} from './tactics-ui.js?v=0.41.1';
export const guideTopics={roster:'growth',champion:'growth',summon:'summon'};
const battleRules=[
 ['Elements','<img class="element-advantages" src="./assets/guide/element-advantages.webp" alt="Red beats Green; Green beats Blue; Blue beats Red. Yellow and Purple are strong against each other.">'],
 ['Mana','Empty lanes give double mana. Specials spend all charge without using a move. Enemies gain 4 charge per attack opportunity.'],
];
const topics=[
 ['battles','Battles',[...battleRules,['Weekly Challenges','Two challenges on Daily Gift; reset Monday at midnight Pacific. No Energy cost. Each gift is claimable once; completed unclaimed gifts carry over.'],['Chapter Journal','Journal icon: bottom left of each Campaign map. Chapter gifts are once per difficulty; story replays give no rewards.'],['Energy','Campaign / Dungeons: 1 / 2 / 3 Energy by difficulty. Arena: 1. Capacity: 50 + profile level. Refills at midnight PST and profile level-up. Entry costs are not refunded. Events use attempts.'],['Loot Tickets','One ticket instantly replays a stage cleared on that difficulty. Normal Energy costs apply. Available in Token Exchange; disabled in playtesting.']]],
 ['growth','Heroes',[
  ['Favorites & Locks','Locks protect individual copies from feeding; saved teams are protected automatically. Favorites First sorts marked champions to the top.'],
  ['Boosters & Tomes','Boosters: +25% feeding XP or battle Gold for 24 hours; one active per type. Activate in Inventory. Ascension / Limit Break Tomes cover materials and Gold for one step; level and rarity requirements still apply.'],
  ['Feeding','25 Gold per Common / Rare copy. Rare gives 3× Common XP; a matching Rare hero gives another 5×. Matching element: +25% XP.'],
  ['Today’s Path','The three-level objective tracks one copy at a time; feeding and battle XP count. Objectives reset at midnight Pacific.'],
  ['Ascension','Each tier adds 2% stats and restarts at level 1 without losing power. Copies progress separately.'],
  ['Limit Break',`Rare or higher: two breaks after full ascension, each adding 5 levels and 3% stats. The second adds a ${LIMIT_BREAK_BUFF_TURNS}-turn role buff at battle start.`],
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
export function effectCard(id,detail='',showCategory=true){
 const e=EFFECTS[id],safeDetail=detail.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return `<article class="codex-card ${e.cat==='debuff'?'ailment':'blessing'}"><div class="codex-icon ${id.startsWith('vulnerable_')?id.slice(11):''}">${effectIcon(id)}</div><div>${showCategory||detail?`<small>${showCategory?(e.timed?e.cat==='debuff'?'AILMENT':'BUFF':'INSTANT ACTION'):''}${showCategory&&detail?' · ':''}${safeDetail}</small>`:''}<h3>${e.name}</h3><p>${e.desc}</p></div></article>`;
}
function effectsGuideHTML(kind){
 const selected=effectKinds.some(([key])=>key===kind)?kind:'buff';
 const cards=Object.keys(EFFECTS).filter(id=>selected==='action'?!EFFECTS[id].timed:EFFECTS[id].timed&&EFFECTS[id].cat===selected);
 return `<h3 class="effects-guide-title">Effects Guide</h3><div class="codex-tabs" role="group" aria-label="Effect categories">${effectKinds.map(([key,label])=>`<button class="${key===selected?'active':''}" aria-pressed="${key===selected}" data-action="guide-effects" data-kind="${key}">${label}</button>`).join('')}</div><div class="effect-codex">${cards.map(id=>effectCard(id,'',false)).join('')}</div>`;
}
export function guideHTML(id='overview',champion=null,effectKind='buff',profile={}){
 const key=id==='heroes'?'growth':id==='overview'?'battles':id;
 const selected=topics.find(t=>t[0]===key)||topics[0];
 return `<div class="guide-layout"><nav aria-label="Guide topics">${topics.map(([key,label])=>`<button class="${key===selected[0]?'active':''}" aria-pressed="${key===selected[0]}" data-action="guide-topic" data-topic="${key}">${label}</button>`).join('')}</nav><section aria-label="${selected[1]}">${selected[0]==='tools'?`<div class="guide-tools"><button class="button outline" data-action="nav" data-page="splash">Title Screen</button><label class="guide-playtesting" for="cinematic-preference"><span><b>Character cinematics</b><small>Animated portraits, reveals and Specials. Reduced Motion keeps artwork still.</small></span><input type="checkbox" id="cinematic-preference" ${profile.cinematicsEnabled!==false?'checked':''}></label><label class="guide-playtesting" for="open-roster"><span><b>Playtesting</b><small>Maximum-level heroes; no rewards or progress.</small></span><input type="checkbox" id="open-roster" ${profile.openRoster?'checked':''}></label><button class="button outline guide-restart" data-action="restart-preview">Restart Journey</button></div>`:selected[0]==='effects'?effectsGuideHTML(effectKind):selected[2].map(([title,body])=>`<article><h3>${title}</h3>${content(body)}</article>`).join('')}${champion&&selected[0]==='growth'?heroInsight(champion):''}</section></div>`;
}
