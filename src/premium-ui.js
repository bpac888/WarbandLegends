import {GEM_ART,GOLD_ART,ENERGY_ART} from './currency-art.js';
const colors=[['red','Red'],['blue','Blue'],['green','Green'],['yellow','Yellow'],['purple','Purple']];
const offers=[
 {id:'energy-refill',name:'Energy Refill',art:ENERGY_ART,amount:'Full Energy',detail:'Restores Energy to your current maximum.'},
 {id:'gem-cache',name:'Gems',art:GEM_ART,amount:'500 Gems',detail:'For summons and supplies.'},
 {id:'gem-treasury',name:'Gem Treasury',art:GEM_ART,amount:'1,500 Gems',bonus:'Bonus: 250 Gems',total:'1,750 Gems total'},
 {id:'ascension-kit',name:'Ascension Kit',art:'aether-crystal.webp',detail:'Ascension materials for your chosen color.',kit:true},
 {id:'awakening-kit',name:'Limit Break Kit',art:'astral-heart.webp',detail:'Limit Break materials for your chosen color.',kit:true},
 {id:'vip-week',name:'VIP Package',art:'vip-treasury.webp',amount:'150 Gems + 500 Gold',detail:'Each day for 7 days',total:'1,050 Gems + 3,500 Gold total',daily:true},
 {id:'vip-month',name:'Elite VIP Package',art:'vip-treasury.webp',amount:'200 Gems + 500 Gold',detail:'Each day for 30 days',total:'6,000 Gems + 15,000 Gold total',daily:true},
 {id:'gold-chest',name:'Gold Chest',art:GOLD_ART,amount:'2,500 Gold',detail:'For training, ascension and supplies.'},
];
export function premiumShop(){return `<div class="premium-banner"><img src="./assets/items/vip-treasury.webp" alt=""><div><span class="eyebrow">PREVIEW ONLY</span><h2>Premium Treasury</h2><p>Premium purchases are not available yet.</p></div></div><div class="premium-offers">${offers.map(o=>`<article data-offer="${o.id}" class="${o.daily?'vip-offer '+o.id:''}"><img src="${o.art.startsWith('./')?o.art:'./assets/items/'+o.art}" alt="${o.name} artwork"><span class="eyebrow">${o.daily?'DAILY REWARDS · PREVIEW':'PREVIEW ONLY'}</span><h3>${o.name}</h3>${o.amount?`<strong class="premium-amount">${o.amount}</strong>`:''}${o.bonus?`<span class="premium-bonus">${o.bonus}</span>`:''}${o.detail?`<p>${o.detail}</p>`:''}${o.kit?`<label class="kit-color">Color<select aria-label="${o.name} color">${colors.map(([value,label])=>`<option value="${value}">${label}</option>`).join('')}</select></label>`:''}${o.total?`<p class="premium-total">${o.total}</p>`:''}<button class="button outline" disabled aria-label="${o.name} unavailable">Unavailable</button></article>`).join('')}</div>`;}
