// Preview USD prices, in cents. No payment or fulfillment is enabled.
export const PREMIUM_USD_CENTS=Object.freeze({
 'energy-refill':199,'gold-chest':299,'gem-cache':599,'gem-treasury':1899,
 'experience-booster':399,'gold-booster':299,
 'tome-of-ascension':1299,'tome-of-limit-break':1899,
 'ascension-kit':599,'awakening-kit':1299,'vip-week':599,'vip-month':2499,
 'epic-tome-experience':399,'legendary-tome-experience':999,
 ...Object.fromEntries(['red','blue','green','yellow','purple'].flatMap(color=>[
  ['lesser-'+color+'-tome',299],['greater-'+color+'-tome',499],
 ])),
});
export function premiumPrice(id){
 const cents=PREMIUM_USD_CENTS[id];
 if(!Number.isInteger(cents)||cents<=0)throw new Error('Missing Premium price: '+id);
 return '$'+(cents/100).toFixed(2)+' USD';
}
