// Preview USD prices, in cents. No payment or fulfillment is enabled.
export const PREMIUM_USD_CENTS=Object.freeze({
 'energy-refill':99,'gold-chest':199,'gem-cache':499,'gem-treasury':1499,
 'experience-booster':299,'gold-booster':199,
 'tome-of-ascension':999,'tome-of-limit-break':1499,
 'ascension-kit':499,'awakening-kit':999,'vip-week':499,'vip-month':1999,
 'epic-tome-experience':299,'legendary-tome-experience':799,
 ...Object.fromEntries(['red','blue','green','yellow','purple'].flatMap(color=>[
  ['lesser-'+color+'-tome',199],['greater-'+color+'-tome',399],
 ])),
});
export function premiumPrice(id){
 const cents=PREMIUM_USD_CENTS[id];
 if(!Number.isInteger(cents)||cents<=0)throw new Error('Missing Premium price: '+id);
 return '$'+(cents/100).toFixed(2)+' USD';
}
