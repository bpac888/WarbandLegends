import {heroForId,ownedHeroes,baseHeroId} from './hero-copies.js';
import {development,heroDevelopment,addHeroXp} from './development.js';
import {currentLevelCap} from './ascension.js';
const donorRarities=new Set(['common','rare']);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function protectedCopies(profile,battle){return new Set([...profile.team,...(profile.teamSlots||[]).flatMap(t=>t||[]),...(battle?.phase==='playing'?battle.heroes.map(h=>h.id):[])]);}
export function feedingQuote(profile,target,donors,roster,{battle=null}={}){
 const d=heroDevelopment(profile,target),physical=currentLevelCap(profile,target),guard=protectedCopies(profile,battle);
 let error=!profile.collection[target.id]?'Collect this hero before training.':d.atCap&&d.cap===physical?'Ascend or choose a hero below their level cap.':!Array.isArray(donors)||!donors.length||donors.length>10?'Select 1–10 Common or Rare heroes.':new Set(donors).size!==donors.length?'Select each copy once.':null;
 const rows=[];
 if(!error)for(const id of donors){const c=heroForId(roster,id);if(!c||!profile.collection[id]||!donorRarities.has(c.rarity)||id===target.id||guard.has(id)){error='A selected hero is unavailable or assigned to a team or active battle.';break;}const multiplier=c.rarity==='rare'&&target.rarity==='rare'&&baseHeroId(c.id)===baseHeroId(target.id)?5:1;const rarityMultiplier=c.rarity==='rare'?3:1;const normalXp=Math.floor(3*(120+Math.floor((profile.heroXp[id]||0)/2))*(c.color===target.color?1.25:1));rows.push({id,name:c.name,multiplier,level:development(c,profile.heroXp[id],currentLevelCap(profile,c)).level,rarityMultiplier,xp:normalXp*rarityMultiplier*multiplier});}
 const xp=rows.reduce((n,c)=>n+c.xp,0),gold=rows.length*25,gained=Math.max(0,Math.min(xpForPhysical(target,physical)-(profile.heroXp[target.id]||0),xp));
 if(!error&&Object.keys(profile.collection).length-rows.length<5)error='Keep at least five collected heroes.';
 if(!error&&profile.gold<gold)error='You need 25 Gold per donor.';
 return {error,rows,gold,xp,gained,before:d,after:development(target,(profile.heroXp[target.id]||0)+gained,physical)};
}
function xpForPhysical(target,cap){return development(target,Number.MAX_SAFE_INTEGER,cap).maxXp;}
export function consumeHeroes(profile,target,donors,roster,{battle=null,expectedXp}={}){
 const q=feedingQuote(profile,target,donors,roster,{battle});if(q.error)return {profile,error:q.error};
 if(expectedXp!==(profile.heroXp[target.id]||0))return {profile,error:'Hero progress changed. Review training again.'};
 let next=addHeroXp({...profile,gold:profile.gold-q.gold},target,q.gained);
 for(const field of ['collection','heroXp','ascensions','awakenings']){next[field]={...next[field]};for(const id of donors)delete next[field][id];}
 return {profile:next,gained:q.gained,consumed:[...donors],before:q.before.level,after:q.after.level};
}
export function availableDonors(profile,target,roster,battle){const guard=protectedCopies(profile,battle);return ownedHeroes(profile,roster).filter(c=>donorRarities.has(c.rarity)&&c.id!==target.id&&!guard.has(c.id));}
export function feedingPanel(profile,target,roster,battle){const n=availableDonors(profile,target,roster,battle).length,d=heroDevelopment(profile,target);return `<section class="feeding-panel"><img src="./assets/items/star-thread.webp" alt=""><div><span class="eyebrow">CHAMPION GROWTH</span><h2>Train with Common & Rare heroes</h2><p>${n} available · Common 360+ XP · Rare 1,080+ XP · Same Rare hero ×5 · 25 Gold each</p></div><button class="button gold" data-action="feed-preview" data-id="${esc(target.id)}" ${!n||d.atCap?'disabled':''}>Choose Heroes</button></section>`;}
export function feedingConfirmation(profile,target,roster,battle){return `<p>Select up to ten Common or Rare heroes. <strong>Selected copies are permanently consumed.</strong></p><div class="feeding-list">${availableDonors(profile,target,roster,battle).map(c=>{const d=heroDevelopment(profile,c),q=feedingQuote(profile,target,[c.id],roster,{battle});return `<label><input type="checkbox" name="feed-copy" value="${esc(c.id)}"><img src="${c.portrait}" alt=""><span><b>${esc(c.name)}</b><small>${c.rarity==='rare'?'Rare':'Common'} · Lv. ${d.level} · +${q.xp} XP${c.color===target.color?' · color bonus':''}${q.rows[0]?.multiplier===5?' · same hero ×5':''}</small></span></label>`;}).join('')}</div><div class="feeding-summary" role="status">Choose Heroes to preview XP and level gains.</div><div class="modal-actions"><button class="button outline" data-action="close">Cancel</button><button class="button gold" data-action="feed-confirm" data-id="${esc(target.id)}" data-xp="${profile.heroXp[target.id]||0}" disabled>Feed & Train</button></div>`;}
