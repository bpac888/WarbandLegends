import {weeklyWindow} from './weekly.js?v=0.53.2';
import {CHAMPIONSHIP_TIERS,CHAMPIONSHIP_REWARDS,championshipReward} from './championship-catalog.js?v=0.53.2';
export {CHAMPIONSHIP_TIERS,CHAMPIONSHIP_REWARDS,championshipReward};
export const championshipWeek=now=>weeklyWindow(now);
export const championshipEsc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function emptyChampionships(){const week=championshipWeek();return {available:false,week:week.key,closesAt:week.reset.toISOString(),standing:{},rankings:[],opponents:[],awards:[],history:[]};}
