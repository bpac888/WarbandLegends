import {TOMES} from './tomes.js?v=0.42.0';
export const BOOSTER_DURATION=24*60*60*1000;
export const PREMIUM_ITEM_LIMIT=999999;
export const PREMIUM_ITEMS=Object.freeze([
 {id:'experience-booster',name:'Experience Booster',kind:'experience',amount:'+25% Feeding XP',description:'For 24 hours after activation, feeding characters grants 25% extra XP.'},
 {id:'gold-booster',name:'Gold Booster',kind:'gold',amount:'+25% Battle Gold',description:'For 24 hours after activation, battle rewards grant 25% extra Gold.'},
 {id:'tome-of-ascension',name:'Tome of Ascension',amount:'One Ascension',description:'Ascends one character by one tier without materials or Gold. The current level cap must be reached.'},
 {id:'tome-of-limit-break',name:'Tome of Limit Break',amount:'One Limit Break',description:'Grants one Limit Break without materials or Gold. Requires full ascension and the current level cap.'},
]);
export const PREMIUM_INVENTORY_ITEMS=Object.freeze([...PREMIUM_ITEMS,...TOMES]);
export const premiumItem=id=>PREMIUM_INVENTORY_ITEMS.find(item=>item.id===id);
export const premiumItemArt=id=>'./assets/items/'+id+'.webp';
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const count=n=>Number.isSafeInteger(n)&&n>=0&&n<=PREMIUM_ITEM_LIMIT;
const timestamp=n=>Number.isSafeInteger(n)&&n>=0&&n<=8640000000000000;
export function normalizePremiumItems(profile){return {
 premiumItems:Object.fromEntries(PREMIUM_INVENTORY_ITEMS.filter(i=>count(profile.premiumItems?.[i.id])).map(i=>[i.id,profile.premiumItems[i.id]])),
 boosters:Object.fromEntries(['experience','gold'].filter(k=>timestamp(profile.boosters?.[k])).map(k=>[k,profile.boosters[k]])),
};}
export function validPremiumItems(profile){return (profile.premiumItems===undefined||object(profile.premiumItems)&&Object.entries(profile.premiumItems).every(([id,n])=>premiumItem(id)&&count(n)))&&(profile.boosters===undefined||object(profile.boosters)&&Object.entries(profile.boosters).every(([kind,n])=>['experience','gold'].includes(kind)&&timestamp(n)));}
export const premiumItemCount=(profile,id)=>count(profile.premiumItems?.[id])?profile.premiumItems[id]:0;
export const boosterActive=(profile,kind,now=Date.now())=>timestamp(profile.boosters?.[kind])&&profile.boosters[kind]>now;
export const boostedGold=(profile,gold,now=Date.now())=>boosterActive(profile,'gold',now)?Math.floor(gold*1.25):gold;
export function takePremiumItem(profile,id){if(!premiumItem(id)||premiumItemCount(profile,id)<1)return profile;return {...profile,premiumItems:{...profile.premiumItems,[id]:premiumItemCount(profile,id)-1}};}
export function activateBooster(profile,id,now=Date.now()){
 const item=premiumItem(id);
 if(!item?.kind)return {profile,error:'Choose a booster.'};
 if(!timestamp(now)||!timestamp(now+BOOSTER_DURATION))return {profile,error:'The activation time is invalid.'};
 if(boosterActive(profile,item.kind,now))return {profile,error:'This booster is already active. Wait until it expires before using another.'};
 if(premiumItemCount(profile,id)<1)return {profile,error:'No '+item.name+' is owned.'};
 return {profile:{...takePremiumItem(profile,id),boosters:{...profile.boosters,[item.kind]:now+BOOSTER_DURATION}},item};
}
