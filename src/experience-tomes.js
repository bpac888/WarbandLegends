import {premiumItem,premiumItemCount,takePremiumItem} from './premium-items.js?v=0.40.3';
import {heroDevelopment,xpForLevel,addHeroXp} from './development.js?v=0.40.3';

export function experienceTomeQuote(profile,id,champion){
 const item=premiumItem(id);
 if(!item?.maxLevels)return {error:'Choose an experience tome.'};
 if(!champion||!profile.collection?.[champion.id])return {error:'Choose an owned champion.'};
 if(item.element&&item.element!==champion.color)return {error:'Choose a matching element.'};
 const d=heroDevelopment(profile,champion),level=Math.min(d.cap,d.level+item.maxLevels);
 if(d.atCap)return {error:'Choose a champion below their current level cap.'};
 return {level,levels:level-d.level,xp:xpForLevel(champion,level)-d.xp};
}
export function useExperienceTome(profile,id,champion,now=new Date()){
 if(!premiumItemCount(profile,id))return {profile,error:'This tome is not owned.'};
 const q=experienceTomeQuote(profile,id,champion);if(q.error)return {profile,error:q.error};
 return {profile:addHeroXp(takePremiumItem(profile,id),champion,q.xp,now),levels:q.levels};
}
