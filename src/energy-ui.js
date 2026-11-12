import {energyCost} from './keeper.js?v=0.42.2';
import {ENERGY_ART} from './currency-art.js?v=0.42.2';
export function energyCostMark(profile,encounter){const cost=energyCost(encounter);return cost?`<span class="energy-cost"><img src="${ENERGY_ART}" alt="" width="18" height="18">${cost} Energy</span>`:'';}
