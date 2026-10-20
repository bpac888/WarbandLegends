import {ascensionTier,currentLevelCap,ascensionRequirements,awakeningRank,awakeningRequirements,awakenedStats,ASCENSION_CAPS,normalLevelCap,LIMIT_BREAK_LEVELS,LIMIT_BREAK_RANKS} from './ascension.js';
// Hero growth is separate from the immutable maximum-level roster and combat effects.
export const LEVEL_CAPS=Object.freeze({common:30,rare:50,legendary:70,mythical:80});
const XP_WEIGHTS={common:1,rare:1.25,legendary:1.6,mythical:2};
export const FEED_LEVELS=3;
export function levelCap(champion){return normalLevelCap(champion)+(champion.rarity==='common'?0:LIMIT_BREAK_LEVELS*LIMIT_BREAK_RANKS);}
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
 const factor=.55+.45*(bounded-1)/(normalLevelCap(champion)-1);
 return {atk:Math.round(champion.atk*factor),def:Math.round(champion.def*factor),hp:Math.round(champion.hp*factor)};
}
export function developedChampion(champion,profile,{preview=false,sandbox=false}={}){
 const owned=!!profile.collection[champion.id],d=heroDevelopment(profile,champion);
 const level=preview||!owned?levelCap(champion):d.level;
 const tier=sandbox?0:preview||!owned?ASCENSION_CAPS[champion.rarity].length-1:ascensionTier(profile,champion),rank=sandbox?0:preview||!owned?champion.rarity==='common'?0:LIMIT_BREAK_RANKS:awakeningRank(profile,champion);
 return {...champion,...awakenedStats(statsAtLevel(champion,level),rank,tier),level,levelCap:levelCap(champion)};
}
export function trainingQuote(profile,champion){
 const d=heroDevelopment(profile,champion),physicalCap=currentLevelCap(profile,champion);
 const error=!profile.collection[champion.id]?'Collect this champion before training.':d.atCap&&d.cap===physicalCap?(ascensionTier(profile,champion)<ASCENSION_CAPS[champion.rarity].length-1?'Ascend this champion to unlock the next level cap.':awakeningRank(profile,champion)<LIMIT_BREAK_RANKS&&champion.rarity!=='common'?'Limit Break this champion to unlock five more levels.':'This champion is at maximum level.'):'Feed Common heroes to unlock and earn levels.';
 const tier=ascensionTier(profile,champion);return {...d,physicalCap,bankedXp:profile.heroXp?.[champion.id]||0,cost:0,error,current:awakenedStats(statsAtLevel(champion,d.level),awakeningRank(profile,champion),tier),next:awakenedStats(statsAtLevel(champion,Math.min(physicalCap,d.level+1)),awakeningRank(profile,champion),tier)};
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
 const error=!profile.collection[champion.id]?'Collect this champion before a Limit Break.':!requirements?'No more Limit Breaks are available.':ascensionTier(profile,champion)!==ASCENSION_CAPS[champion.rarity].length-1||d.level!==currentLevelCap(profile,champion)?'Fully ascend and reach the current level cap before a Limit Break.':profile.gold<requirements.gold?'More gold is needed.':Object.entries(requirements.items).some(([id,n])=>(profile.materials?.[id]||0)<n)?'Gather the missing Limit Break materials.':null;
 const tier=ascensionTier(profile,champion);return {rank,requirements,error,current:awakenedStats(statsAtLevel(champion,d.level),rank,tier),next:awakenedStats(statsAtLevel(champion,d.level),Math.min(LIMIT_BREAK_RANKS,rank+1),tier)};
}
export function awakenChampion(profile,champion,expectedRank){
 const q=awakeningQuote(profile,champion);if(q.error)return {profile,error:q.error};if(expectedRank!==q.rank)return {profile,error:'Awakening changed. Review the new requirements.'};
 const materials={...profile.materials};for(const [id,n]of Object.entries(q.requirements.items))materials[id]-=n;
 return {profile:{...profile,gold:profile.gold-q.requirements.gold,materials,awakenings:{...profile.awakenings,[champion.id]:q.rank+1}},rank:q.rank+1};
}
