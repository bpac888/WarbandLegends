# The King

A factionless Yellow Mythical attacker. His normal-max baseline is **1,000 ATK / 760 DEF / 1,480 HP**, giving him the highest Attack of all 265 characters. All 264 previous character records, source records and portraits are preserved by `data/roster-expansion-12.json`.

**A Crown Beyond Time** charges at Very Fast speed (6.5 tiles). It deals 180% ATK damage to all enemies, ignores 25% of effective DEF, and applies Bleed for two board moves. His artwork depicts an agile warrior king in light chainmail, without a helmet, wielding a two-handed longsword amid a battle that appears frozen around him.

**Sovereign’s Evasion** gives him a 25% chance to dodge an incoming damaging Special, including its attached hostile effects. The battle rolls once per actual recipient per Special, after selecting any Taunt redirect and before Dispel, ailments, damage or shield absorption. A successful dodge leaves existing buffs and shields intact and does not trigger a counterattack. Other recipients and the caster’s own buffs still resolve normally. Basic attacks, rune strikes, ongoing damage and non-damaging Specials are not dodged.

Evasion uses the existing deterministic battle RNG; saving and replaying a battle cannot reroll an outcome. The passive works on either battle side. The King joins the existing Mythical summon pool without changing rarity odds. “No Faction” appears in shared filters and character pages; it grants no faction bonus and does not count toward any faction threshold.

Validation: `npm run check`, `npm run test:the-king`, `npm run roster:audit`, and `npm run roster:review`. Coverage includes the exact 25% RNG threshold, single-target and area attacks, Taunt, Dispel and shield preservation, enemy casts against a player King, basic attacks, ongoing damage, summons, saves, filters and four responsive layouts.
