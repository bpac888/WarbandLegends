// Shared rules and language for combat, champion descriptions, and the field guide.
const timed=(name,cat,group,value,desc,icon)=>({name,cat,group,value,desc,icon,timed:true});
const action=(name,cat,desc,icon)=>({name,cat,group:'action',value:0,desc,icon,timed:false});
export const EFFECTS={
 inc_atk:timed('Attack Up','buff','attack',.25,'+25% ATK for rune attacks, basic attacks and Specials. Stacks with Tile Boost.','sword-up'),
 dec_atk:timed('Attack Down','debuff','attack',.25,'−25% ATK for rune attacks, basic attacks and Specials. Replaces Attack Up.','sword-down'),
 tile_boost:timed('Tile Boost','buff','tile',.35,'+35% rune damage only. Multiplies with Attack Up; does not increase Specials, basic attacks or DoT.','fist'),
 inc_def:timed('Defense Up','buff','defense',.25,'+25% DEF against runes, basic attacks and Specials. Does not reduce DoT.','shield-up'),
 dec_def:timed('Defense Down','debuff','defense',.25,'−25% DEF against direct damage. Stacks multiplicatively with elemental defense reductions and Pierce.','shield-down'),
 shield:timed('Barrier','buff','barrier',.2,'Absorbs direct damage up to 20% max HP. Recasting refreshes the pool instead of adding to it. DoT bypasses barriers.','barrier'),
 strengthen:timed('Damage Ward','buff','protection',.15,'Take 15% less direct damage after defense. Replaces Vulnerability. Does not reduce DoT.','ward'),
 weaken:timed('Vulnerability','debuff','protection',.15,'Take 15% more direct damage after defense. Replaces Damage Ward. Does not amplify DoT.','broken'),
 heal:timed('Regeneration','buff','regeneration',.1,'Restore 10% max HP at the start of each board move. Instant healing is separate and can be used alongside it.','heart'),
 mana_surge:timed('Mana Flow','buff','mana',.2,'Gain 20% more generated tile charge. Replaces Mana Slow. Flat mana gifts are not amplified.','mana-up'),
 mana_slow:timed('Mana Slow','debuff','mana',.15,'Gain 15% less generated tile charge. Replaces Mana Flow. Does not change attack countdowns.','mana-down'),
 mana_block:timed('Mana Block','debuff','mana-block',1,'Cannot gain generated or gifted charge. Stored charge is kept, and an already-ready Special can still be cast.','mana-lock'),
 block_buffs:timed('Buff Seal','debuff','seal',0,'Prevents new timed buffs, including refreshes. Does not remove existing buffs or block instant healing or mana gifts.','seal'),
 block_debuffs:timed('Ailment Ward','buff','ailment-ward',0,'Prevents new ailments. Does not remove ailments already present; use Cleanse for that.','ward-star'),
 guard:timed('Taunt','buff','taunt',0,'Protect allies by redirecting enemy basic attacks and single-target Specials to this champion. Runes still follow columns; area attacks, healing and team effects are unchanged.','taunt'),
 counterattack:timed('Riposte','buff','counter',.5,'Survive a direct basic attack or Special to strike its attacker for 50% ATK. Rune strikes and DoT do not trigger it; counters cannot chain.','counter'),
 revive_on_death:timed('Death Ward','buff','revive',.3,'Revive once per battle at 30% max HP if defeated while active. Can be dispelled; permanent revival passives cannot.','revive'),
 poison:timed('Poison','debuff','dot-poison',.04,'Lose 4% max HP at the start of each board move. Ignores defense and barriers. Different DoT types coexist; repeated Poison refreshes.','poison'),
 burn:timed('Burn','debuff','dot-burn',.04,'Lose 4% max HP at the start of each board move. Ignores defense and barriers. Different DoT types coexist; repeated Burn refreshes.','flame'),
 frostbite:timed('Frostbite','debuff','dot-frost',.04,'Lose 4% max HP at the start of each board move. Ignores defense and barriers; it does not change mana speed.','snow'),
 bleed:timed('Bleed','debuff','dot-bleed',.04,'Lose 4% max HP at the start of each board move. Ignores defense and barriers. Different DoT types coexist; repeated Bleed refreshes.','drop'),
 remove_debuffs:action('Cleanse','buff','Instantly remove all timed ailments from the listed allies, including Mana Block and DoT. Does not remove buffs.','cleanse'),
 dispel:action('Dispel','debuff','Instantly remove all timed buffs from the listed enemies, including Barrier and Taunt. Does not remove passives or ailments; Ailment Ward cannot prevent it.','dispel'),
 mana_raise:action('Mana Gift','buff','Instantly grant 1.5 tile-equivalent charge to other living allies, capped at their maximum. Not amplified by Mana Flow; prevented by Mana Block.','mana-gift'),
 aoe:action('Area Attack','effect','This Special hits all living enemies. Area damage is not redirected by Taunt.','area'),
 ignore_def:action('Pierce','effect','Ignore 25% of effective DEF for this Special. This is a damage property, not a timed ailment.','pierce'),
};
for(const [color,name]of Object.entries({red:'Ember',blue:'Frost',green:'Verdant',yellow:'Radiant',purple:'Umbral'})){
 EFFECTS[`vulnerable_${color}`]=timed(`${name} Defense Down`,'debuff',`element-${color}`,.25,`−25% effective DEF against ${color} direct damage. Stacks with Defense Down and Pierce. Other colors and DoT are unaffected.`,'element-down');
}
export const BUFFS=new Set(Object.keys(EFFECTS).filter(id=>EFFECTS[id].timed&&EFFECTS[id].cat==='buff'));
export const DEBUFFS=new Set(Object.keys(EFFECTS).filter(id=>EFFECTS[id].timed&&EFFECTS[id].cat==='debuff'));
export const DOTS=['poison','burn','frostbite','bleed'];
export const OPPOSITES={inc_atk:'dec_atk',dec_atk:'inc_atk',inc_def:'dec_def',dec_def:'inc_def',mana_surge:'mana_slow',mana_slow:'mana_surge',strengthen:'weaken',weaken:'strengthen'};
export const effectName=id=>EFFECTS[id]?.name||id;
