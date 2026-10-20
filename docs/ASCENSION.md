# Ascension and awakening · v0.13

Open a collected champion's dossier and follow Development → Ascension → Awakening. Ascension opens the next level cap; awakening improves stats after all ascensions and the final level. Neither consumes champion copies or resets levels, XP, collection, or progress. Active fights keep their starting stats.

## Level caps

| Rarity | Starting cap | Ascension caps | Awakening eligibility |
| --- | ---: | --- | --- |
| Common | 20 | 30 | Fully ascended, Lv. 30 |
| Rare | 30 | 40 → 50 | Fully ascended, Lv. 50 |
| Legendary | 40 | 50 → 60 → 70 | Fully ascended, Lv. 70 |
| Mythical | 40 | 50 → 60 → 70 → 80 | Fully ascended, Lv. 80 |

Reach the current cap, gather the displayed materials and gold, and confirm an ascension. The cap increases, while current level, XP and stats remain the same until new levels are earned. XP stops at the current cap; overflow is not stored. The existing unawakened maximum stats, XP curves, gold training rates, mana speeds, Specials and passives are unchanged.

## Materials and acquisition

| Material | Earned from | Gold price per item |
| --- | --- | ---: |
| Star Thread | Every campaign/dungeon victory: 1 | 75 |
| Aether Crystal | Every dungeon victory: 1 | 300 |
| Sovereign Crown | Every Hard/Nightmare dungeon victory: 1 | 1,500 |
| Awakened Ember | Every Nightmare dungeon victory: 1 | 2,000 |
| Astral Heart | Every Nightmare dungeon victory: 1 | 4,000 |
| Ember Sigil | Supply Exchange; red champions | 200 |
| Glacier Sigil | Supply Exchange; blue champions | 200 |
| Verdant Sigil | Supply Exchange; green champions | 200 |
| Dawn Sigil | Supply Exchange; yellow champions | 200 |
| Twilight Sigil | Supply Exchange; purple champions | 200 |

All ten have distinct scalable illustrated icons, inventory entries and shop offers. The shop sells one at a time with confirmation. Gold is earned in-game. The existing Arena/event token exchanges remain available. Campaign/dungeon previews show material rewards; results show awarded materials. Replays pay the listed drops. Losses, abandonments, locked encounters and playtesting grant none. A resolved battle pays only once. Each material has a 999,999 storage cap.

## Ascension costs

Rarity weight `w`: Common 1, Rare 2, Legendary 3, Mythical 4. For the next ascension step `s`:

- Gold: `500 × w × s`.
- Star Thread: `2 × w × s`.
- Matching-color Sigils: `w × s`.
- Rare and higher: `s × (w−1)` Aether Crystals.
- Legendary step 3: 1 Sovereign Crown.
- Mythical steps 3/4: 2/3 Sovereign Crowns.

Example: a Legendary champion's first ascension at Lv. 40 needs1,500 gold, 6 Thread, 3 matching Sigils and 2 Crystals. It opens Lv. 50.

## Awakening

Each champion has three awakening ranks after reaching the final level and completing every ascension. Each rank adds 3% of unawakened maximum ATK, DEF and HP, up to 9% total. Bonuses are additive to the base maximum, not compounded: `round(base × [1 + 0.03 × rank])`.

For next awakening rank `s`, using the same rarity weight `w`:

- Gold: `1,500 × w × s`.
- Awakened Embers and matching Sigils: `w × s` each.
- Ranks 2/3 additionally require 1/2 Astral Hearts.

The dossier previews the resulting stats and exact owned/required quantities. Confirmation rechecks ownership, full ascension, maximum level, materials, gold and current rank. A stale confirmation cannot advance another rank. Cancel spends nothing. Specials, mana speed and passives are unaffected.

## Stats, saves and compatibility

Collection shows actual level and awakening stats. Codex shows final-level, rank 3 maximum stats. An owned champion's dossier shows their current development; unowned dossiers clearly preview maximum stats. Optional open-roster playtest battles retain unawakened maximum stats and pay no rewards.

Profile schema 8 uses the existing profile/battle keys. Schemas 5–7 migrate XP with the minimum ascensions needed to retain earned levels; no reset or stat loss. At an exact cap, that cap is retained until its next ascension is earned. Existing fully leveled heroes keep the ascensions needed for their level and start at awakening rank 0. Materials start empty. Current-schema saves validate tiers, ownership, XP caps, counts and awakening eligibility; exports/imports retain all new fields. Active battles retain captured stats even if a champion ascends or awakens outside the battle.

All 135 hero IDs, source roster baselines/art and 20 existing tactical guides are preserved. The original Warband Legends repository is untouched. Prices, costs and bonuses are an initial playable balance pass and can be tuned later.
