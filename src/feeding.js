import {heroForId,ownedHeroes} from './hero-copies.js';
import {development,heroDevelopment,addHeroXp} from './development.js';
import {currentLevelCap} from './ascension.js';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function protectedCopies(profile,battle){return new Set([...profile.team,...(profile.teamSlots||[]).flatMap(t=>t||[]),...(battle?.phase==='playing'?battle.heroes.map(h=>h.id):[])]);}
export function feedingQuote(profile,target,donors,roster,{battle=null}={}){
 const d=heroDevelopment(profile,target),physical=currentLevelCap(profile,target),guard=protectedCopies(profile,battle);
 let error=!profile.collection[target.id]?'Collect this hero before training.':d.atCap&&d.cap===physical?'Ascend or choose a hero below their level cap.':!Array.isArray(donors)||!donors.length||donors.length>10?'Select 1–10 Common heroes.':new Set(donors).size!==donors.length?'Select each copy once.':null;
 const rows=[];
 if(!error)for(const id of donors){const c=heroForId(roster,id);if(!c||!profile.collection[id]||c.rarity!=='common'||id===target.id||guard.has(id)){error='A selected hero is unavailable or assigned to a team or saved battle.';break;}rows.push({id,name:c.name,level:development(c,profile.heroXp[id],currentLevelCap(profile,c)).level,xp:Math.floor(3*(120+Math.floor((profile.heroXp[id]||0)/2))*(c.color===target.color?1.25:1))});}
 const xp=rows.reduce((n,c)=>n+c.xp,0),gold=rows.length*25,gained=Math.max(0,Math.min(xpForPhysical(target,physical)-(profile.heroXp[target.id]||0),xp));
 if(!error&&Object.keys(profile.collection).length-rows.length<5)error='Keep at least five collected heroes.';
 if(!error&&profile.gold<gold)error='You need 25 gold per Common hero.';
 return {error,rows,gold,xp,gained,before:d,after:development(target,(profile.heroXp[target.id]||0)+gained,physical)};
}
function xpForPhysical(target,cap){return development(target,Number.MAX_SAFE_INTEGER,cap).maxXp;}
export function consumeCommons(profile,target,donors,roster,{battle=null,expectedXp}={}){
 const q=feedingQuote(profile,target,donors,roster,{battle});if(q.error)return {profile,error:q.error};
 if(expectedXp!==(profile.heroXp[target.id]||0))return {profile,error:'Hero progress changed. Review training again.'};
 let next=addHeroXp({...profile,gold:profile.gold-q.gold},target,q.gained);
 for(const field of ['collection','heroXp','ascensions','awakenings']){next[field]={...next[field]};for(const id of donors)delete next[field][id];}
 return {profile:next,gained:q.gained,consumed:[...donors],before:q.before.level,after:q.after.level};
}
export function availableCommons(profile,target,roster,battle){const guard=protectedCopies(profile,battle);return ownedHeroes(profile,roster).filter(c=>c.rarity==='common'&&c.id!==target.id&&!guard.has(c.id));}
export function feedingPanel(profile,target,roster,battle){const n=availableCommons(profile,target,roster,battle).length,d=heroDevelopment(profile,target);return `<section class="feeding-panel"><img src="./assets/items/star-thread.svg" alt=""><div><span class="eyebrow">CHAMPION GROWTH</span><h2>Train with Common heroes</h2><p>${n} available · each grants at least 360 XP · 25 gold each</p></div><button class="button gold" data-action="feed-preview" data-id="${esc(target.id)}" ${!n||d.atCap?'disabled':''}>Choose heroes</button></section>`;}
export function feedingConfirmation(profile,target,roster,battle){return `<p>Select up to ten Common heroes to grant XP. <strong>Selected copies are permanently consumed.</strong> Team, saved-team and active-battle heroes are protected.</p><div class="feeding-list">${availableCommons(profile,target,roster,battle).map(c=>{const d=heroDevelopment(profile,c),q=feedingQuote(profile,target,[c.id],roster,{battle});return `<label><input type="checkbox" name="feed-copy" value="${esc(c.id)}"><img src="${c.portrait}" alt=""><span><b>${esc(c.name)}</b><small>Lv. ${d.level} · +${q.xp} XP${c.color===target.color?' · color bonus':''}</small></span></label>`;}).join('')}</div><div class="feeding-summary" role="status">Choose heroes to preview XP and level gains.</div><p class="muted">Battle victories also grant XP. XP stops at the current Ascension or Limit Break cap.</p><div class="modal-actions"><button class="button outline" data-action="close">Cancel</button><button class="button gold" data-action="feed-confirm" data-id="${esc(target.id)}" data-xp="${profile.heroXp[target.id]||0}" disabled>Consume & train</button></div>`;}
