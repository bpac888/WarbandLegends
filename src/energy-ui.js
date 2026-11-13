import {energyCost} from './keeper.js?v=0.48.4';
import {ENERGY_ART} from './currency-art.js?v=0.48.4';
export function energyCostMark(profile,encounter,{compact=false}={}){const cost=energyCost(encounter);return cost?`<span class="energy-cost"${compact?' id="entry-energy-cost"':''} aria-label="${cost} Energy"><img src="${ENERGY_ART}" alt="" width="18" height="18">${cost}${compact?'':' Energy'}</span>`:'';}
