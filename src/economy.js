import {MATERIALS,MATERIAL_LIMIT,addMaterials} from './ascension.js';
export const GEM_LIMIT=999999999;
export const SUMMON_COST=100;
export const TEN_SUMMON_COST=900;
export const INITIAL_GEMS=500;
export const GEM_INTERVAL=5;
export const GEM_ART='./assets/items/gem.svg';
export const GEM_OFFERS=[
 {id:'gold-pouch',name:'Gold Pouch',cost:100,gold:1000,description:'1,000 gold for champion training and ascension.'},
 {id:'gold-chest',name:'Gold Chest',cost:500,gold:5500,description:'5,500 gold for your growing warband.'},
 ...MATERIALS.map(m=>({id:m.id,name:m.name,cost:Math.ceil(m.price/10),items:{[m.id]:1},description:m.description}))
];
export function buyWithGems(profile,id){const offer=GEM_OFFERS.find(o=>o.id===id);if(!offer)return {profile,error:'Unknown Gem offer.'};if(!Number.isSafeInteger(profile.gems)||profile.gems<offer.cost)return {profile,error:'Earn more Gems before buying this supply.'};if(offer.gold&&profile.gold+offer.gold>999999999||Object.entries(offer.items||{}).some(([id,n])=>(profile.materials[id]||0)+n>MATERIAL_LIMIT))return {profile,error:'There is not enough storage for this purchase.'};return {profile:addMaterials({...profile,gems:profile.gems-offer.cost,gold:profile.gold+(offer.gold||0)},offer.items||{}),offer};}
