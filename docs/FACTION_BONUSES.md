# Faction Bonuses

Bonuses apply only to matching members of the player’s starting five-character team. Two unlocks the 2-member bonus; three, four or five use only the 3-member bonus. Counts stay fixed for that battle even if members fall. Two different factions can activate together in a 3+2 or 2+2+1 team. There are no enemy faction bonuses.

| Faction | 2 Members | 3+ Members |
| --- | --- | --- |
| Astral Concord | +15% mana from matching runes. | +25% mana from matching runes. |
| Bloodcourt | Recover 3% max HP each turn. | Recover 6% max HP each turn. |
| Chymera | 50% chance for each Special ailment applied to an enemy to last 1 extra turn. | Special ailments applied to enemies last 1 extra turn. |
| Dragon Dynasty | +5% ATK. | +5% ATK and DEF. |
| Dune Riders | +5% DEF. | +10% DEF. |
| Frost | Immune to Burn. | Immune to Burn and Poison. |
| Ironclad | +5% max HP. | +10% max HP. |
| Neon Syndicate | +3% max HP and ATK. | +4% max HP, ATK and DEF. |
| Nether | At battle start: each member has a 50% chance to gain 10% of their own maximum mana. | At battle start: each member gains 15% of their own maximum mana. |
| Umbra | Each member rolls separately each turn: 10% chance to gain 2% ATK, DEF and max HP. Stacks. | Each member rolls separately each turn: 15% chance to gain 2% ATK, DEF and max HP. Stacks. |
| Veldtborn | +10% mana from matching runes. | +30% mana from matching runes. |
| Wildgrove | Recover 2% max HP each turn. | Recover 4% max HP each turn; start with +5% max HP. |

## Timing and Stacking

- A turn is one valid board move: a successful swap or rune activation. Invalid swaps, casting Specials and extra cascades do not add turns or rolls.
- Healing and Umbra rolls happen at the beginning of that move, before existing Regeneration and damage-over-time, only for living members. Faction recovery coexists with other healing and does not revive.
- Starting stat bonuses apply after levels, ascension and Limit Break stats. HP bonuses increase starting max/current HP together. They do not increase enemy scaling, alter saved hero development, or rerun after casts or snapshot loading.
- Faction bonuses are innate, not timed buffs: Buff Seal, Dispel and Cleanse do not remove them. Frost immunity coexists with a champion’s own passive immunities.
- Matching-rune mana bonuses include empty-lane double charge and board-rune clears, multiply with Mana Flow/Slow, respect Mana Block, and do not amplify flat mana gifts. Internal charge keeps six decimals to prevent repeated percentage rounding drift.
- Each Chymera enemy-ailment application rolls independently after immunity/ward checks. Instant Dispel, allied buffs and blocked ailments never extend. One turn is added to the usual duration, including 3 → 4. Recasting refreshes rather than adding the old duration again.
- Each Nether member has one independent opening roll for their own charge. At 2 members it is 50% for 10% of that member’s maximum mana; at 3+ it is guaranteed for 15%. Success does not grant charge to other Nether members.
- Each living Umbra member rolls independently, once per board move. Only the successful character gains a stack. Each stack adds 2% of that member’s battle-start ATK, DEF and max HP; gains are additive across stacks. Increasing max HP grants the same increase to current HP, retaining existing wounds. Growth lasts for the battle, cannot be dispelled, and does not transfer to allies.

## Astral Mythical Passives

- **Alkyron — Titan’s Resolve:** permanently immune to Attack Down and Burn, only on Alkyron.
- **Asterox — Moonforged Aegis:** Barriers received by Asterox have 50% larger pools (normally 30% max HP instead of 20%). Allied Barriers remain normal.

All champion identities and artwork are unchanged. All seventeen Mythicals now have passives.

## Validation

Native tests cover all twelve factions at 1–5 members, mixed teams, local recipients, tier replacement, exact percentages and charge precision, independent chance rolls, dead members, cast/cascade timing, blocked and extended ailments, innate vs timed effects, developed stats, passive interactions, snapshot validity and Auto battles. Browser checks cover the Warband selector, Guide, battle inspection, Auto and the two passive dossiers on phone and desktop.
