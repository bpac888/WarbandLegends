import {premiumPrice} from './premium-prices.js?v=0.49.0';
import {PREMIUM_ITEMS,premiumItemArt} from './premium-items.js?v=0.49.0';
import {tomesPreview} from './tomes.js?v=0.49.0';
import {GEM_ART,GOLD_ART,ENERGY_ART} from './currency-art.js?v=0.49.0';
const colors=[['red','Red'],['blue','Blue'],['green','Green'],['yellow','Yellow'],['purple','Purple']];
const offers=[
 {id:'energy-refill',name:'Energy Refill',art:ENERGY_ART,amount:'Full Energy'},
 {id:'gold-chest',name:'Gold Chest',art:GOLD_ART,amount:'2,500 Gold'},
 ...PREMIUM_ITEMS.map(item=>({id:item.id,name:item.name,art:premiumItemArt(item.id),amount:item.kind?item.amount+' · 24h':null,detail:item.kind?null:item.description})),
 {id:'gem-cache',name:'Gems',art:GEM_ART,amount:'500 Gems'},
 {id:'gem-treasury',name:'Gem Treasury',art:GEM_ART,amount:'1,750 Gems',bonus:'Includes 250 bonus Gems'},
 {id:'ascension-kit',name:'Ascension Kit',art:'aether-crystal.webp',detail:'Ascension materials.',kit:true},
 {id:'awakening-kit',name:'Limit Break Kit',art:'astral-heart.webp',detail:'Limit Break materials.',kit:true},
 {id:'vip-week',name:'VIP Package',art:'vip-treasury.webp',amount:'150 Gems + 500 Gold',detail:'Each day for 7 days',total:'1,050 Gems + 3,500 Gold total',daily:true},
 {id:'vip-month',name:'Elite VIP Package',art:'vip-treasury.webp',amount:'200 Gems + 500 Gold',detail:'Each day for 30 days',total:'6,000 Gems + 15,000 Gold total',daily:true},
];
export function premiumShop(){return `<p class="premium-preview-note">Preview · purchases unavailable.</p><div class="premium-offers">${offers.map(o=>`<article data-offer="${o.id}" class="${o.daily?'vip-offer '+o.id:''}"><img src="${o.art.startsWith('./')?o.art:'./assets/items/'+o.art}" alt="${o.name} artwork"><h3>${o.name}</h3>${o.amount?`<strong class="premium-amount">${o.amount}</strong>`:''}${o.bonus?`<span class="premium-bonus">${o.bonus}</span>`:''}${o.detail?`<p>${o.detail}</p>`:''}${o.kit?`<label class="kit-color">Color<select aria-label="${o.name} color">${colors.map(([value,label])=>`<option value="${value}">${label}</option>`).join('')}</select></label>`:''}${o.total?`<p class="premium-total">${o.total}</p>`:''}<button class="button outline premium-price" disabled aria-label="${o.name}: ${premiumPrice(o.id)}. Purchases not available yet.">${premiumPrice(o.id)}</button></article>`).join('')}</div>${tomesPreview()}`;}
