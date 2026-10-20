import {ascensionTier,currentLevelCap,ascensionRequirements,awakeningRank,awakeningRequirements,awakenedStats,ASCENSION_CAPS} from './ascension.js';
// Hero growth is separate from the immutable maximum-level roster and combat effects.
export const LEVEL_CAPS=Object.freeze({common:30,rare:50,legendary:70,mythical:80});
const XP_WEIGHTS={common:1,rare:1.25,legendary:1.6,mythical:2};
export const FEED_LEVELS=3;
export function levelCap(champion){return LEVEL_CAPS[champion.rarity];}
export function xpForLevel(champion,level){
 const n=Math.max(0,Math.min(levelCap(champion),Math.trunc(level))-1);
 return Math.round(XP_WEIGHTS[champion.rarity]*(60*n+12*n*(n-1)));
}
export function development(champion,xp=0,cap=levelCap(champion)){
 const maxXp=xpForLevel(champion,cap);
 const total=Number.isSafeInteger(xp)&&xp>=0?Math.min(xp,maxXp):0;
 let level=1;while(level<cap&&total>=xpForLevel(champion,level+1))level++;
 const floor=xpForLevel(champion,level),next=level===cap?floor:xpForLevel(champion,level+1);
 return {level,cap,xp:total,maxXp,atCap:level===cap,earned:total-floor,needed:next-floor,remaining:next-total,ratio:level===cap?1:(total-floor)/(next-floor)};
}
export function growthCap(profile,champion){return Math.min(currentLevelCap(profile,champion),Math.max(1,profile.feedLevels?.[champion.id]||1));}
export function heroDevelopment(profile,champion){return development(champion,profile.heroXp?.[champion.id],growthCap(profile,champion));}
export function statsAtLevel(champion,level=1){
 const bounded=Math.max(1,Math.min(levelCap(champion),Math.trunc(level)||1));
 const factor=.55+.45*(bounded-1)/(levelCap(champion)-1);
 return {atk:Math.round(champion.atk*factor),def:Math.round(champion.def*factor),hp:Math.round(champion.hp*factor)};
}
export function developedChampion(champion,profile,{preview=false,sandbox=false}={}){
 const owned=!!profile.collection[champion.id],d=heroDevelopment(profile,champion);
 const level=preview||!owned?levelCap(champion):d.level;
 return {...champion,...awakenedStats(statsAtLevel(champion,level),sandbox?0:preview||!owned?3:awakeningRank(profile,champion)),level,levelCap:levelCap(champion)};
}
export function trainingQuote(profile,champion){
 const d=heroDevelopment(profile,champion),physicalCap=currentLevelCap(profile,champion);
 const error=!profile.collection[champion.id]?'Collect this champion before training.':d.atCap&&d.cap===physicalCap?(physicalCap<levelCap(champion)?'Ascend this champion to unlock the next level cap.':'This champion is at maximum level.'):'Feed Common heroes to unlock and earn levels.';
 return {...d,physicalCap,bankedXp:profile.heroXp?.[champion.id]||0,cost:0,error,current:awakenedStats(statsAtLevel(champion,d.level),awakeningRank(profile,champion)),next:awakenedStats(statsAtLevel(champion,Math.min(physicalCap,d.level+1)),awakeningRank(profile,champion))};
}
export function trainChampion(profile,champion,expectedXp){
 return {profile,error:'Feed Common heroes to grow this champion.'};
}
export function addHeroXp(profile,champion,amount){
 if(!profile.collection[champion.id]||!Number.isSafeInteger(amount)||amount<=0)return profile;
 const d=development(champion,profile.heroXp?.[champion.id],currentLevelCap(profile,champion));if(d.atCap)return profile;
 return {...profile,heroXp:{...profile.heroXp,[champion.id]:Math.min(d.maxXp,d.xp+amount)}};
}

export function ascensionQuote(profile,champion){
 const tier=ascensionTier(profile,champion),requirements=ascensionRequirements(champion,tier),d=heroDevelopment(profile,champion);
 const error=!profile.collection[champion.id]?'Collect this champion before ascending.':!requirements?'This champion is fully ascended.':d.level!==currentLevelCap(profile,champion)?`Reach level ${currentLevelCap(profile,champion)} before ascending.`:profile.gold<requirements.gold?'More gold is needed.':Object.entries(requirements.items).some(([id,n])=>(profile.materials?.[id]||0)<n)?'Gather the missing ascension materials.':null;
 return {...d,tier,requirements,error};
}
export function ascendChampion(profile,champion,expectedTier){
 const q=ascensionQuote(profile,champion);if(q.error)return {profile,error:q.error};
 if(expectedTier!==q.tier)return {profile,error:'Ascension changed. Review the new requirements.'};
 const materials={...profile.materials};for(const [id,n]of Object.entries(q.requirements.items))materials[id]-=n;
 return {profile:{...profile,gold:profile.gold-q.requirements.gold,materials,ascensions:{...profile.ascensions,[champion.id]:q.tier+1}},cap:q.requirements.cap};
}

export function awakeningQuote(profile,champion){
 const rank=awakeningRank(profile,champion),requirements=awakeningRequirements(champion,rank),d=heroDevelopment(profile,champion);
 const error=!profile.collection[champion.id]?'Collect this champion before awakening.':!requirements?'This champion is fully awakened.':ascensionTier(profile,champion)!==ASCENSION_CAPS[champion.rarity].length-1||d.level!==levelCap(champion)?'Fully ascend and reach maximum level before awakening.':profile.gold<requirements.gold?'More gold is needed.':Object.entries(requirements.items).some(([id,n])=>(profile.materials?.[id]||0)<n)?'Gather the missing awakening materials.':null;
 return {rank,requirements,error,current:awakenedStats(champion,rank),next:awakenedStats(champion,Math.min(3,rank+1))};
}
export function awakenChampion(profile,champion,expectedRank){
 const q=awakeningQuote(profile,champion);if(q.error)return {profile,error:q.error};if(expectedRank!==q.rank)return {profile,error:'Awakening changed. Review the new requirements.'};
 const materials={...profile.materials};for(const [id,n]of Object.entries(q.requirements.items))materials[id]-=n;
 return {profile:{...profile,gold:profile.gold-q.requirements.gold,materials,awakenings:{...profile.awakenings,[champion.id]:q.rank+1}},rank:q.rank+1};
}
