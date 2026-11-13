import {PREMIUM_INVENTORY_ITEMS,premiumItem,premiumItemArt,premiumItemCount,boosterActive} from './premium-items.js?v=0.48.1';
import {tomeArt} from './tomes.js?v=0.48.1';
import {experienceTomeQuote} from './experience-tomes.js?v=0.48.1';
import {ownedHeroes} from './hero-copies.js?v=0.48.1';
import {ascensionQuote,awakeningQuote} from './development.js?v=0.48.1';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const itemArt=item=>item.maxLevels?tomeArt(item):`<img src="${premiumItemArt(item.id)}" alt="">`;
const until=(profile,item)=>new Date(profile.boosters[item.kind]).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'});
export function eligibleTomeHeroes(profile,id,roster){return ownedHeroes(profile,roster).filter(c=>!(premiumItem(id)?.maxLevels?experienceTomeQuote(profile,id,c):(id==='tome-of-ascension'?ascensionQuote:awakeningQuote)(profile,c,{tome:true})).error);}
export function premiumInventory(profile,now=Date.now()){
 const items=PREMIUM_INVENTORY_ITEMS.filter(item=>premiumItemCount(profile,item.id)>0||item.kind&&boosterActive(profile,item.kind,now));if(!items.length)return '';
 return `<section class="premium-inventory"><h2>Premium Items</h2><div class="premium-offers">${items.map(item=>{const active=item.kind&&boosterActive(profile,item.kind,now);return `<article data-premium-item="${item.id}">${itemArt(item)}<h3>${item.name}</h3><strong>×${premiumItemCount(profile,item.id)}</strong><p>${item.description}</p>${active?`<p class="booster-status" role="status">Active · ends <time datetime="${new Date(profile.boosters[item.kind]).toISOString()}">${until(profile,item)}</time></p>`:''}<button class="button gold" data-action="premium-item-preview" data-id="${item.id}" ${active||!premiumItemCount(profile,item.id)?'disabled':''}>${active?'Active':item.kind?'Activate · 24h':'Choose Champion'}</button></article>`;}).join('')}</div></section>`;
}
export function premiumItemConfirmation(profile,id,roster,championId){
 const item=premiumItem(id);if(!item)return '';
 const active=item.kind&&boosterActive(profile,item.kind),heroes=item.kind?[]:eligibleTomeHeroes(profile,id,roster).filter(c=>!championId||c.id===championId),unavailable=!premiumItemCount(profile,id)||active||!item.kind&&!heroes.length;
 return `<div class="premium-item-confirm">${itemArt(item)}<p>${item.description}</p>${item.kind?(active?`<p>Active until ${until(profile,item)}.</p>`:''):heroes.length?`<label>Champion<select id="premium-item-champion">${heroes.map(c=>`<option value="${esc(c.id)}" ${c.id===championId?'selected':''}>${esc(c.name)}${item.maxLevels?' → Level '+experienceTomeQuote(profile,id,c).level:''}${c.id.includes('~')?' · Copy '+c.id.split('~')[1]:''}</option>`).join('')}</select></label>`:'<p>No eligible champion.</p>'}</div><div class="modal-actions"><button class="button outline" data-action="close">Cancel</button><button class="button gold" data-action="premium-item-confirm" data-id="${id}" ${unavailable?'disabled':''}>${item.kind?'Activate Booster':'Use Tome'}</button></div>`;
}
