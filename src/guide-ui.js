import {LIMIT_BREAK_BUFF_TURNS} from './ascension.js?v=0.45.2';
import {factionGuideHTML} from './faction-ui.js?v=0.45.2';
import {EFFECTS} from './effects.js?v=0.45.2';
import {effectIcon} from './icons.js?v=0.45.2';
import {SUMMON_ODDS} from './progression.js?v=0.45.2';
import {heroInsight} from './tactics-ui.js?v=0.45.2';
export const guideTopics={roster:'growth',champion:'growth',summon:'summon'};
const battleRules=[
 ['Elements','<img class="element-advantages" src="./assets/guide/element-advantages.webp" alt="Red beats Green; Green beats Blue; Blue beats Red. Yellow and Purple are strong against each other.">'],
 ['Tile Damage','Starting colors retain tile damage after champions fall. Absent colors deal none; only living champions gain mana.'],
 ['Mana','Empty lanes: 2× mana. Specials spend all charge, no move. Enemies: +4 charge per attack opportunity.'],
];
const topics=[
 ['battles','Battles',[...battleRules,['Weekly Challenges','Daily Gift: free retries, 1 gift per challenge per week. Reset Mon 00:00 Pacific; completed unclaimed gifts carry over.'],['Chapter Journal','Chapter gifts: once per difficulty. Journal: bottom left of Campaign maps.'],['Energy','Campaign / Dungeons: 1 / 2 / 3 Energy (Normal / Hard / Nightmare). Arena: 1. Cap: 50 + profile Lv. Refill: 00:00 PST or profile Lv. up. No entry refunds. Events use attempts.'],['Loot Tickets','Instant rewards from a stage cleared on that difficulty; normal Energy required. Token Exchange item. Disabled in playtesting.']]],
 ['growth','Heroes',[
  ['Feeding Protection','Locked copies and saved teams cannot be fed.'],
  ['Boosters & Tomes','Boosters: +25% feeding XP or battle Gold for 24h; 1 active per type. Activate in Inventory. Ascension / Limit Break Tomes cover materials and Gold for 1 step; Lv. and rarity requirements remain.'],
  ['Feeding','25 Gold per Common / Rare copy. Rare: 3× Common XP; identical Rare: another 5×. Same element: +25% XP.'],
  ['Today’s Path','Gain 3 Lv. on one copy; feeding and battle XP count. Daily reset: 00:00 Pacific.'],
  ['Ascension','+2% stats per tier; resets to Lv. 1 without losing power.'],
  ['Limit Break',`Rare+: 2 breaks after full ascension. Each: +5 Lv., +3% stats. Second: ${LIMIT_BREAK_BUFF_TURNS}-move role buff at battle start.`],
 ]],
 ['factions','Factions',[['Faction Bonuses',factionGuideHTML()]]],
 ['effects','Effects',[]],
 ['tools','Tools',[]],
 ['summon','Summoning',[
  ['Summoning Odds',SUMMON_ODDS.map(o=>`${o.rarity==='double_common'?'Two Commons':o.rarity[0].toUpperCase()+o.rarity.slice(1)}: ${o.chance}%`).join(' · ')],
  ['Hymn of Ten','10 summons; guaranteed Rare+. Two-Common bonuses still apply.'],
 ]],
];
const content=body=>body.startsWith('<')?body:`<p>${body}</p>`;
const effectKinds=[['buff','Buffs'],['debuff','Ailments'],['action','Instant Actions']];
const conciseEffects={
 inc_atk:'+25% ATK; stacks with Tile Boost.',dec_atk:'−25% ATK; replaces Attack Up.',tile_boost:'+35% tile damage, multiplying with Attack Up. No boost to Specials or DoT.',inc_def:'+25% DEF against direct damage. No effect on DoT.',dec_def:'−25% DEF; stacks with elemental DEF Down and Pierce.',shield:'Absorbs direct damage up to 20% max HP. Refreshes, does not stack; DoT bypasses it.',strengthen:'−15% direct damage received; replaces Vulnerability.',weaken:'+15% direct damage received; replaces Damage Ward.',heal:'Heals 10% max HP per move.',mana_surge:'+20% generated mana; replaces Mana Slow. No boost to flat gifts.',mana_slow:'−15% generated mana; replaces Mana Flow.',mana_block:'Blocks mana gains; stored charge and ready Specials remain usable.',block_buffs:'Blocks new buffs and refreshes; existing buffs remain.',block_debuffs:'Blocks new ailments; existing ailments remain.',guard:'Redirects basic attacks and single-target Specials. Tiles and area attacks ignore Taunt.',counterattack:'Survive a direct attack to counter for 50% ATK. Tiles, DoT and counters cannot trigger it.',revive_on_death:'Revives once at 30% HP if defeated while active. Can be dispelled.',poison:'',burn:'',frostbite:'',bleed:'',remove_debuffs:'Removes timed ailments, including Mana Block and DoT.',dispel:'Removes timed buffs, including Barrier and Taunt. Cannot remove passives.',mana_raise:'+1.5 charge to other living allies. Mana Block prevents it; Mana Flow does not amplify it.',aoe:'Hits all living enemies; ignores Taunt.',ignore_def:'Ignores 25% of effective DEF for this Special.'
};
for(const color of ['red','blue','green','yellow','purple'])conciseEffects['vulnerable_'+color]='';
export function effectCard(id,detail='',showCategory=true,concise=false){
 const e=EFFECTS[id],description=concise?(conciseEffects[id]??e.desc):e.desc,safeDetail=detail.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return `<article class="codex-card ${e.cat==='debuff'?'ailment':'blessing'}"><div class="codex-icon ${id.startsWith('vulnerable_')?id.slice(11):''}">${effectIcon(id)}</div><div>${showCategory||detail?`<small>${showCategory?(e.timed?e.cat==='debuff'?'AILMENT':'BUFF':'INSTANT ACTION'):''}${showCategory&&detail?' · ':''}${safeDetail}</small>`:''}<h3>${e.name}</h3>${description?`<p>${description}</p>`:''}</div></article>`;
}
function effectsGuideHTML(kind){
 const selected=effectKinds.some(([key])=>key===kind)?kind:'buff';
 const cards=Object.keys(EFFECTS).filter(id=>selected==='action'?!EFFECTS[id].timed:EFFECTS[id].timed&&EFFECTS[id].cat===selected);
 return `<div class="codex-tabs" role="group" aria-label="Effect categories">${effectKinds.map(([key,label])=>`<button class="${key===selected?'active':''}" aria-pressed="${key===selected}" data-action="guide-effects" data-kind="${key}">${label}</button>`).join('')}</div><div class="effect-key">${selected==='debuff'?'<p><b>DoT:</b> Poison, Burn, Frostbite, Bleed each deal 4% max HP per move, bypassing DEF and barriers. Different types stack; repeats refresh.</p><p><b>Elemental DEF Down:</b> −25% effective DEF against that color. Stacks with DEF Down and Pierce.</p>':''}</div><div class="effect-codex">${cards.map(id=>effectCard(id,'',false,true)).join('')}</div>`;
}
export function guideHTML(id='overview',champion=null,effectKind='buff',profile={}){
 const key=id==='heroes'?'growth':id==='overview'?'battles':id;
 const selected=topics.find(t=>t[0]===key)||topics[0];
 return `<div class="guide-layout"><nav aria-label="Guide topics">${topics.map(([key,label])=>`<button class="${key===selected[0]?'active':''}" aria-pressed="${key===selected[0]}" data-action="guide-topic" data-topic="${key}">${label}</button>`).join('')}</nav><section aria-label="${selected[1]}">${selected[0]==='tools'?`<div class="guide-tools"><button class="button outline" data-action="nav" data-page="splash">Title Screen</button><label class="guide-playtesting" for="cinematic-preference"><span><b>Character cinematics</b><small>Animated portraits, reveals and Specials. Reduced Motion keeps artwork still.</small></span><input type="checkbox" id="cinematic-preference" ${profile.cinematicsEnabled!==false?'checked':''}></label><label class="guide-playtesting" for="open-roster"><span><b>Playtesting</b><small>Maximum-level heroes; no rewards or progress.</small></span><input type="checkbox" id="open-roster" ${profile.openRoster?'checked':''}></label><button class="button outline guide-restart" data-action="restart-preview">Restart Journey</button></div>`:selected[0]==='effects'?effectsGuideHTML(effectKind):selected[2].map(([title,body])=>`<article><h3>${title}</h3>${content(body)}</article>`).join('')}${champion&&selected[0]==='growth'?heroInsight(champion):''}</section></div>`;
}
