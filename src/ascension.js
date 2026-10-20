// Ascension opens level caps; the final roster stats and Special rules stay fixed.
export const ASCENSION_CAPS=Object.freeze({common:[20,30],rare:[30,40,50],legendary:[40,50,60,70],mythical:[40,50,60,70,80]});
export const MATERIAL_LIMIT=999999;
export const MATERIALS=Object.freeze([
 {id:'star-thread',name:'Star Thread',color:'#edc58a',price:75,description:'A luminous binding used in every ascension.',source:'Every campaign or dungeon victory.'},
 {id:'aether-crystal',name:'Aether Crystal',color:'#6de2e5',price:300,description:'Condensed aether for Rare and higher ascensions.',source:'Every dungeon victory.'},
 {id:'awakened-ember',name:'Awakened Ember',color:'#ffad6b',price:2000,description:'A spark of dormant power used after full ascension.',source:'Every Nightmare dungeon victory.'},
 {id:'astral-heart',name:'Astral Heart',color:'#eeaaff',price:4000,description:'A celestial core for the second and third awakening ranks.',source:'Every Nightmare dungeon victory.'},
 {id:'sovereign-crown',name:'Sovereign Crown',color:'#ffc65a',price:1500,description:'A relic required for the final Legendary and Mythical ascensions.',source:'Hard and Nightmare dungeon victories.'},
 ...[['red','Ember','#ff7662'],['blue','Glacier','#75cfff'],['green','Verdant','#88e5a1'],['yellow','Dawn','#ffe182'],['purple','Twilight','#cc9dff']].map(([id,label,color])=>({id:id+'-sigil',name:label+' Sigil',color,price:200,description:`An elemental seal for ${id} champions.`,source:'Supply Exchange · earned gold.'}))
]);
export const materialById=id=>MATERIALS.find(m=>m.id===id);
export const materialArt=id=>'./assets/items/'+id+'.svg';
export function ascensionTier(profile,champion){const n=profile.ascensions?.[champion.id];return Number.isSafeInteger(n)&&n>=0?Math.min(n,ASCENSION_CAPS[champion.rarity].length-1):0;}
export function currentLevelCap(profile,champion){return ASCENSION_CAPS[champion.rarity][ascensionTier(profile,champion)];}
export function ascensionRequirements(champion,tier=0){
 const caps=ASCENSION_CAPS[champion.rarity];if(tier>=caps.length-1)return null;
 const step=tier+1,rank={common:1,rare:2,legendary:3,mythical:4}[champion.rarity];
 const items={'star-thread':rank*step*2,[champion.color+'-sigil']:step*rank};
 if(rank>=2)items['aether-crystal']=step*(rank-1);
 if(rank>=3&&step>=3)items['sovereign-crown']=rank===4?step-1:1;
 return {tier:step,cap:caps[step],gold:rank*step*500,items};
}
export function materialDrops(encounter){if(!encounter||!['campaign','dungeon'].includes(encounter.mode))return {};return {'star-thread':1,...(encounter.mode==='dungeon'?{'aether-crystal':1,...(encounter.difficulty!=='normal'?{'sovereign-crown':1,...(encounter.difficulty==='nightmare'?{'awakened-ember':1,'astral-heart':1}:{})}:{})}:{})};}
export function addMaterials(profile,items){const materials={...profile.materials};for(const [id,n]of Object.entries(items))if(materialById(id)&&Number.isSafeInteger(n)&&n>0)materials[id]=Math.min(MATERIAL_LIMIT,(materials[id]||0)+n);return {...profile,materials};}
export function materialPurchase(profile,id){const item=materialById(id);if(!item)return {profile,error:'Unknown material.'};if(profile.gold<item.price)return {profile,error:'Earn more gold before buying this material.'};if((profile.materials?.[id]||0)>=MATERIAL_LIMIT)return {profile,error:'Material storage is full.'};return {profile:addMaterials({...profile,gold:profile.gold-item.price},{[id]:1}),item};}
export function validateAscension(p,roster){
 const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
 if(!object(p.materials)||!object(p.ascensions)||!object(p.awakenings))return false;
 if(Object.entries(p.materials).some(([id,n])=>!materialById(id)||!Number.isSafeInteger(n)||n<0||n>MATERIAL_LIMIT))return false;
 if(Object.entries(p.awakenings).some(([id,n])=>{const c=roster.find(c=>c.id===id);return !c||!p.collection[id]||!Number.isSafeInteger(n)||n<0||n>3||n>0&&ascensionTier(p,c)!==ASCENSION_CAPS[c.rarity].length-1;}))return false;
 return !Object.entries(p.ascensions).some(([id,n])=>{const c=roster.find(c=>c.id===id);return !c||!p.collection[id]||!Number.isSafeInteger(n)||n<0||n>=ASCENSION_CAPS[c.rarity].length;});
}

export function awakeningRank(profile,champion){const n=profile.awakenings?.[champion.id];return Number.isSafeInteger(n)&&n>=0&&n<=3?n:0;}
export function awakeningRequirements(champion,rank=0){if(rank>=3)return null;const step=rank+1,weight={common:1,rare:2,legendary:3,mythical:4}[champion.rarity];return {rank:step,gold:weight*step*1500,items:{'awakened-ember':weight*step,[champion.color+'-sigil']:weight*step,...(step>=2?{'astral-heart':step-1}:{})}};}
export function awakenedStats(stats,rank=0){return Object.fromEntries(['atk','def','hp'].map(k=>[k,Math.round(stats[k]*(1+rank*.03))]));}
