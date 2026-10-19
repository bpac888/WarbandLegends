// Hero growth is separate from the immutable maximum-level roster and combat effects.
export const LEVEL_CAPS=Object.freeze({common:30,rare:50,legendary:70,mythical:80});
const XP_WEIGHTS={common:1,rare:1.25,legendary:1.6,mythical:2};
const GOLD_RATES={common:.4,rare:.5,legendary:.65,mythical:.8};
export function levelCap(champion){return LEVEL_CAPS[champion.rarity];}
export function xpForLevel(champion,level){
 const n=Math.max(0,Math.min(levelCap(champion),Math.trunc(level))-1);
 return Math.round(XP_WEIGHTS[champion.rarity]*(60*n+12*n*(n-1)));
}
export function development(champion,xp=0){
 const cap=levelCap(champion),maxXp=xpForLevel(champion,cap);
 const total=Number.isSafeInteger(xp)&&xp>=0?Math.min(xp,maxXp):0;
 let level=1;while(level<cap&&total>=xpForLevel(champion,level+1))level++;
 const floor=xpForLevel(champion,level),next=level===cap?floor:xpForLevel(champion,level+1);
 return {level,cap,xp:total,maxXp,atCap:level===cap,earned:total-floor,needed:next-floor,remaining:next-total,ratio:level===cap?1:(total-floor)/(next-floor)};
}
export function statsAtLevel(champion,level=1){
 const bounded=Math.max(1,Math.min(levelCap(champion),Math.trunc(level)||1));
 const factor=.55+.45*(bounded-1)/(levelCap(champion)-1);
 return {atk:Math.round(champion.atk*factor),def:Math.round(champion.def*factor),hp:Math.round(champion.hp*factor)};
}
export function developedChampion(champion,profile,{preview=false}={}){
 const owned=!!profile.collection[champion.id],d=development(champion,profile.heroXp?.[champion.id]);
 const level=preview||!owned?levelCap(champion):d.level;
 return {...champion,...statsAtLevel(champion,level),level,levelCap:levelCap(champion)};
}
export function trainingQuote(profile,champion){
 const d=development(champion,profile.heroXp?.[champion.id]);
 const cost=d.atCap?0:Math.ceil(d.remaining*GOLD_RATES[champion.rarity]);
 const error=!profile.collection[champion.id]?'Collect this champion before training.':d.atCap?'This champion is at maximum level.':profile.gold<cost?'Earn more gold through campaign battles.':null;
 return {...d,cost,error,current:statsAtLevel(champion,d.level),next:statsAtLevel(champion,Math.min(d.cap,d.level+1))};
}
export function trainChampion(profile,champion,expectedXp){
 const q=trainingQuote(profile,champion);
 if(q.error)return {profile,error:q.error};
 if(expectedXp!==q.xp)return {profile,error:'This champion’s progress changed. Review the updated training cost.'};
 return {profile:{...profile,gold:profile.gold-q.cost,heroXp:{...profile.heroXp,[champion.id]:q.xp+q.remaining}},before:q.level,after:q.level+1,cost:q.cost};
}
export function addHeroXp(profile,champion,amount){
 if(!profile.collection[champion.id]||!Number.isSafeInteger(amount)||amount<=0)return profile;
 const d=development(champion,profile.heroXp?.[champion.id]);if(d.atCap)return profile;
 return {...profile,heroXp:{...profile.heroXp,[champion.id]:Math.min(d.maxXp,d.xp+amount)}};
}
