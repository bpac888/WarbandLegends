# Warband Legends combat rules · v0.3

## The roster

The four rarities remain **Common, Rare, Legendary and Mythical**. All 135 champion IDs, identities, lore, portraits and existing passives are preserved. Colors are now assigned individually rather than inherited from faction: **27 red, 27 blue, 27 green, 27 yellow, 27 purple**. Every color has all four rarities and all three roles. Themes take priority within each pool: frost/water is blue, fire/blood is red, jade/nature/alchemy is green, sunlight/lightning is yellow, and shadow/void/death is purple. There are intentional theme-based exceptions, such as the Shade Prince's cold blue flames and green corrosive undead.

The new ATK/DEF/HP numbers are the game's **max-level balance baseline**, used directly in the current unlocked-roster prototype. Leveling is not implemented yet. Rarity averages:

| Rarity | ATK | DEF | HP |
| --- | ---: | ---: | ---: |
| Common | 460 | 450 | 800 |
| Rare | 626 | 600 | 1,083 |
| Legendary | 760 | 726 | 1,393 |
| Mythical | 835 | 800 | 1,540 |

Rare uses the owner's supplied Epic reference without introducing a fifth rarity. Legendary is the central powerful tier; Mythical has a modest statistical premium. Role offsets favor attacker ATK, defender DEF/HP, and support survivability; source stat profiles and deterministic variation preserve individual differences. Exact values and Specials appear in [the roster](ROSTER.md) and the in-game champion details. `data/balance-report.json` records counts, ranges and means.

## One Special per champion

Each champion now has **one Special**. Original A2 and A3 effects are merged into its full form; duplicate effects use their longest duration and never apply twice. An original AoE component makes the attack hit all enemies; Pierce ignores 25% of DEF. Passives remain independent; obsolete SPD/Taunt-ailment immunities are adapted to the current mana rules.

A Special's damage coefficient, healing percentage, targets, effects and durations are explicit data. ATK Specials emphasize damage; DEF Specials strike while protecting or controlling; SUP Specials heal and empower their allies, with a light strike if their merged kit has offensive debuffs. Common support targets one living ally, while higher-tier supports affect the living team. Legendary/Mythical defender shields protect the team. Taunt is a buff on the defender that redirects single-target enemy attacks. It leaves area attacks, tile columns and ally effects unchanged. Cleanse removes team debuffs before new buffs and healing. Buffs apply before the Special's damage; debuffs apply before its hits.

The complete status audit, revised stacking rules and targeted champion changes are described in [the status review](STATUS-REVIEW.md). Original SPD is removed as a character stat. Original speed buffs/debuffs become **Mana flow (+20% charge)** and **Mana slow (−15% charge)**. They do not affect attack countdowns. Frost-themed champions' former Burn becomes Frostbite, with the same damage-over-time rules.

## Tile-based mana

Mana is measured in matching-color **tile charge**, not points out of 100. Each cleared tile gives every living champion of that color 1 charge; empty lanes give 2. Mana effects can create fractional charge and combine multiplicatively. Charge is kept to two decimal places and capped at the champion's maximum threshold.

| Standard mana speed | Tiles to cast |
| --- | ---: |
| Very Fast | 6.5 |
| Fast | 8 |
| Average | 10 |
| Slow | 12 |
| Very Slow | 13.5 |

Without modifiers, a 6.5-tile champion needs the seventh tile and a 13.5-tile champion needs the fourteenth. Fractional thresholds are exact; a 20% mana bonus can cross them sooner. A match of three clears three tiles and normally grants 3 charge, not one match point.

**Charging mana** has cumulative thresholds, not additional costs:

- Two levels: **8 / 10 tiles**.
- Three levels: **5 / 10 / 15 tiles**.

Twelve champions use this system. Earlier levels offer less damage/healing and fewer or shorter effects. The final level combines the full original A2/A3 kit. Tap the portrait to inspect all levels, cast an unlocked level, or close it and hold for more charge. You may choose a lower unlocked level intentionally. **Casting any level spends all stored charge**, including surplus; it does not advance the board or enemies. The mana bar shows charge thresholds, tile totals and available levels.

## Board and elements

Swap orthogonally adjacent runes to form three or more of one color. Nonmatching swaps cost no move, consume no RNG, and do not advance enemies. Intersecting runs form one connected match. A full cascade, including triggered specials and refills, is one move. Gravity fills from above; a board with no legal moves automatically realigns.

Enemies cover columns 1–2, 3–5, and 6–7 respectively. A cleared rune strikes the living enemy covering its column. Colors with no living matching champion clear normally but grant no damage or charge. Stacked champions combine attack and each gain charge.

A match of four creates a Blast Rune at a surviving matched cell; five or more creates a Prism. Blast clears a 3×3 area. Prism clears its own color when double-tapped or the neighboring rune's color when swapped. Specials can trigger other specials. A newly created rune remains rather than dealing a normal clear on creation.

Red beats Green, Green beats Blue, Blue beats Red. Yellow and Purple beat each other. Strong hits deal 2×; reverse red/green/blue hits deal 0.5×; other hits deal 1×.

Rune power is `0.24 × sum(effective matching ATK × role modifier) × cascade modifier`. ATK roles receive 1.1×; cascade modifier is `1 + 0.2 × (cascade number − 1)`. Defense multiplies damage by `500 / (500 + effective DEF)`; Pierce uses 75% of effective DEF. The defense curve was rescaled for the new stat values. Damage rounds to at least one before shields; shields absorb before HP.

## Effects and turns

Effects share a catalog in `src/effects.js`, used by combat and UI descriptions. Attack Up increases tile/basic/Special damage by 25%; Tile Boost separately increases only tile damage by 35%. Generic and matching elemental Defense Down each multiply effective DEF by 0.75, as does Pierce for its hit. Damage Ward and Vulnerability modify direct damage after armor by −15%/+15%. Barriers absorb up to 20% max HP and refresh their pool on recast. Timed effects are not permanent passives.

Same-ID effects replace their duration/source without stacking. Opposing Attack, Defense, Mana and Protection effects replace one another when successfully applied. Different categories combine. Poison, Burn, Frostbite and Bleed each deal 4% max HP per board move; the four types coexist, while repeats of a type refresh. Regeneration heals 10% max HP. Defense, barriers and direct-damage modifiers do not affect DoT. Cleanse removes ailments; Dispel removes timed buffs, including barriers and Taunt, but neither removes passives.

Mana Block prevents generated and gifted mana without deleting stored charge or disabling a ready Special. Mana Gift grants 1.5 flat tile-equivalent charge to other living allies, capped at their maximum and unmodified by generation effects. Taunt protects allies by redirecting single-target enemy basics and Specials; it never prevents casting. Riposte returns a 50%-ATK strike after surviving direct basic/Special damage, but not after runes or DoT, and cannot chain. Death Ward and passive revival use separate once-per-battle flags.

Every valid board move ticks both sides' regeneration and DoT at its start, then decrements existing timed effects after the enemy phase. Newly applied effects survive the end of their application move. Champion casts, invalid swaps and menus do not advance the clock. Enemy countdowns still advance once per full move/cascade. At zero an enemy gains 4 tile-equivalent charge, modified or blocked by mana effects, and uses its full Special if ready; otherwise it makes a basic attack. Basic attacks have an 8% critical chance for 1.5× damage. Enemy stats scale from the selected team in the introductory encounters.

## Saved games

Team selections, victories, cleared encounters and animation speed keep their independent profile key. Battles use `legends.runes.battle.v3`. v0.2 battles migrate while preserving health, charge, board, RNG and turn counts; old Taunt ailments become buffs on their living source. Older v0.1 active battles restart with full health and zero charge, as in the previous migration. Old records remain backups, and completed victories retain their ID to prevent duplicate credit.

Actions save before visual playback. Local saves are single-player browser data, not a competitive authority. This project does not access the original Warband Legends account, repository, API, deployment or database.

## Hero levels (v0.7)

The table above describes maximum-level baselines. Collected champions start at level 1 and gain XP from victories, quests, or feeding spare Common and Rare copies. Rare donors grant 3× Common XP; a Rare copy of the same character grants 5× its normal Rare XP. Feeding costs 25 Gold per donor and preserves team-assigned copies. XP stops at the current level cap. Mana thresholds and kits do not change with levels. See [current progression rules](ASCENSION.md) for feeding, ascension and Limit Break details.
