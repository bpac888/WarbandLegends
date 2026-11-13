import {premiumPrice} from './premium-prices.js?v=0.49.0';
// Purchases remain previews; owned tomes can be used from Inventory.
const elements=['red','blue','green','yellow','purple'];
const title=s=>s[0].toUpperCase()+s.slice(1);
const tome=(id,name,maxLevels,element,artIndex)=>Object.freeze({id,name,maxLevels,element,artIndex,source:'premium',available:false,description:`Up to ${maxLevels} Lv. · ${element||'any element'} · current Lv. cap applies.`});
export const TOMES=Object.freeze([
 tome('epic-tome-experience','Epic Tome of Experience',20,null,0),
 tome('legendary-tome-experience','Legendary Tome of Experience',60,null,1),
 ...elements.flatMap((color,i)=>[
  tome('lesser-'+color+'-tome','Lesser '+title(color)+' Elemental Tome',20,color,2+i*2),
  tome('greater-'+color+'-tome','Greater '+title(color)+' Elemental Tome',40,color,3+i*2),
 ]),
]);
export const TOME_ART='./assets/tomes/power.webp';
export function tomeArt(item){return `<span class="tome-art" aria-hidden="true"><img src="${TOME_ART}" alt="" style="--tome-x:${item.artIndex%3};--tome-y:${Math.floor(item.artIndex/3)}"></span>`;}
export function tomesPreview(){return `<section class="tomes-preview" aria-labelledby="tomes-heading"><div class="section-heading"><div><h2 id="tomes-heading">Tomes of Power</h2></div></div><div class="tome-offers">${TOMES.map(t=>`<article class="tome-offer ${t.element||'universal'}" data-tome="${t.id}">${tomeArt(t)}<h3>${t.name}</h3><strong>Up to ${t.maxLevels} levels</strong><span class="tome-element">${t.element?title(t.element)+' characters only':'Any element'}</span><button class="button outline premium-price" disabled aria-label="${t.name}: ${premiumPrice(t.id)}. Purchases not available yet.">${premiumPrice(t.id)}</button></article>`).join('')}</div></section>`;}
