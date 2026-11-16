const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
import {factionGuideHTML} from './faction-ui.js?v=0.53.1';
import {EFFECTS} from './effects.js?v=0.53.1';
import {effectIcon} from './icons.js?v=0.53.1';
import {SUMMON_ODDS} from './progression.js?v=0.53.1';
export const guideTopics={roster:'battles',champion:'battles',summon:'summon'};
const battleRules=[
 ['Elements','<img class="element-advantages" src="./assets/guide/element-advantages.webp" alt="Red beats Green; Green beats Blue; Blue beats Red. Yellow and Purple are strong against each other.">'],

 ['Mana','Empty lanes: 2× mana. Specials use the highest ready charge and spend all mana, no move. Enemies: +4 charge per attack opportunity.'],
];
const topics=[
 ['battles','Battles',[...battleRules,]],
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
export function effectSummary(id){return ['poison','burn','frostbite','bleed'].includes(id)?'4% max HP per turn; bypasses DEF and Barrier.':id.startsWith('vulnerable_')?'−25% DEF against '+id.slice(11)+'.':conciseEffects[id]??EFFECTS[id].desc;}
export function effectCard(id,detail='',showCategory=true,concise=false){
 const e=EFFECTS[id],description=concise?(conciseEffects[id]??e.desc):e.desc,safeDetail=detail.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return `<article class="codex-card ${e.cat==='debuff'?'ailment':'blessing'}"><div class="codex-icon ${id.startsWith('vulnerable_')?id.slice(11):''}">${effectIcon(id)}</div><div>${showCategory||detail?`<small>${showCategory?(e.timed?e.cat==='debuff'?'AILMENT':'BUFF':'INSTANT ACTION'):''}${showCategory&&detail?' · ':''}${safeDetail}</small>`:''}<h3>${e.name}</h3>${description?`<p>${description}</p>`:''}</div></article>`;
}
function effectsGuideHTML(kind){
 const selected=effectKinds.some(([key])=>key===kind)?kind:'buff';
 const cards=Object.keys(EFFECTS).filter(id=>selected==='action'?!EFFECTS[id].timed:EFFECTS[id].timed&&EFFECTS[id].cat===selected);
 return `<div class="codex-tabs" role="group" aria-label="Effect categories">${effectKinds.map(([key,label])=>`<button class="${key===selected?'active':''}" aria-pressed="${key===selected}" data-action="guide-effects" data-kind="${key}">${label}</button>`).join('')}</div><div class="effect-key">${selected==='debuff'?'<p><b>DoT:</b> Poison, Burn, Frostbite, Bleed each deal 4% max HP per move, bypassing DEF and barriers. Different types stack; repeats refresh.</p><p><b>Elemental DEF Down:</b> −25% effective DEF against that color. Stacks with DEF Down and Pierce.</p>':''}</div><div class="effect-codex">${cards.map(id=>effectCard(id,'',false,true)).join('')}</div>`;
}
export function guideHTML(id='overview',champion=null,effectKind='buff',profile={},account=null){
 const key=['heroes','growth','overview'].includes(id)?'battles':id;
 const selected=topics.find(t=>t[0]===key)||topics[0];
 return `<div class="guide-layout"><nav aria-label="Guide topics">${topics.map(([key,label])=>`<button class="${key===selected[0]?'active':''}" aria-pressed="${key===selected[0]}" data-action="guide-topic" data-topic="${key}">${label}</button>`).join('')}</nav><section aria-label="${selected[1]}">${selected[0]==='tools'?`<div class="guide-tools">${account?`<p class="account-save-status">Signed in as ${esc(account.email)}. Progress saves automatically.</p><button class="button outline" data-action="account-logout">Log out</button>`:''}<button class="button outline" data-action="nav" data-page="splash">Title Screen</button><button class="button outline guide-restart" data-action="restart-preview">Restart Journey</button></div>`:selected[0]==='effects'?effectsGuideHTML(effectKind):selected[2].map(([title,body])=>`<article><h3>${title}</h3>${content(body)}</article>`).join('')}</section></div>`;
}
