import {energyCost} from './keeper.js';
import {ENERGY_ART} from './currency-art.js';
export function energyCostMark(profile,encounter){const cost=energyCost(encounter);return cost?`<span class="energy-cost"><img src="${ENERGY_ART}" alt="" width="18" height="18">${cost} Energy</span>`:'';}
