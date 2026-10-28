# Warband Legends Roster Audit — 162 Champions

All **12 recommendations from the [150-champion audit](history/ROSTER-AUDIT-150.md)** are now implemented. The new group contains **9 Legendary and 3 Rare; 8 ATK, 2 DEF and 2 SUP**. No Mythicals or Commons were added. All previous 150 character records and portraits are preserved.

## Before and After

| Category | Before | Added | After |
| --- | --- | --- | --- |
| Total | 150 | 12 | 162 |
| Mythical | 15 | 0 | 15 |
| Legendary | 58 | 9 | 67 |
| Rare | 57 | 3 | 60 |
| Common | 20 | 0 | 20 |
| Attack | 77 | 8 | 85 |
| Defense | 34 | 2 | 36 |
| Support | 39 | 2 | 41 |
| Red | 30 | 3 | 33 |
| Blue | 30 | 2 | 32 |
| Green | 30 | 2 | 32 |
| Yellow | 30 | 2 | 32 |
| Purple | 30 | 3 | 33 |

**ATK remains the majority: 85/162 (52.5%)**, alongside 36 DEF and 41 SUP. Colors differ by at most one champion: red/purple 33 each, blue/green/yellow 32 each. Mythicals remain at 15 (9.3%). Existing rarity-wide mean HP, ATK and DEF are unchanged.

## The 12 Additions

| Champion | Faction | Element | Rarity | Type | Speed |
| --- | --- | --- | --- | --- | --- |
| Torvek, the Void Battery | Ironclad | Purple | Legendary | ATK | Fast |
| Kaitha, Caldera Fury | Chymera | Red | Legendary | ATK | Slow |
| Lysandre, Winter Vein | Bloodcourt | Blue | Legendary | ATK | Charging |
| Velka, Ashen Veil | Umbra | Red | Legendary | ATK | Average |
| Zhenya, Sun-Dragon Lancer | Dragon Dynasty | Yellow | Legendary | ATK | Very Fast |
| Sahir, Emerald Talon | Dune Riders | Green | Legendary | ATK | Fast |
| Nix, Biosteel Hunter | Neon Syndicate | Green | Legendary | ATK | Charging |
| Draeven, Gravefrost Headsman | Nether | Blue | Legendary | ATK | Average |
| Melia, Dawn-Pollen Mender | Wildgrove | Yellow | Rare | SUP | Fast |
| Nyrali, Moon-Pride Keeper | Veldtborn | Purple | Legendary | SUP | Fast |
| Haska, Hearth Guard | Frost | Red | Rare | DEF | Average |
| Orrix, Amethyst Bulwark | Chymera | Purple | Rare | DEF | Slow |

Ironclad now has purple, Chymera red, Bloodcourt blue and Umbra red. Every faction now has all five elements. The other additions fill previously absent faction/element/type combinations. No existing hero was recolored, retyped or rebalanced.

## Faction Coverage

| Faction | Before → After | Red / Blue / Green / Yellow / Purple | Mythicals (Element) |
| --- | --- | --- | --- |
| Bloodcourt | 14 → 15 | 9 / 1 / 1 / 1 / 3 | Sable, Pale Matriarch (Purple); Sir Aurel, the Crimson Paladin (Red) |
| Chymera | 14 → 16 | 1 / 2 / 7 / 4 / 2 | Vex, the Elixir Apotheon (Green) |
| Dragon Dynasty | 14 → 15 | 4 / 3 / 4 / 2 / 2 | Dragon Empress (Red) |
| Dune Riders | 14 → 15 | 1 / 1 / 2 / 7 / 4 | Ashwind Warden (Yellow); Nayara, Keeper of the Deep Well (Blue) |
| Frost | 14 → 15 | 2 / 9 / 1 / 2 / 1 | Frost King (Blue); Frost Sage (Blue) |
| Ironclad | 14 → 15 | 5 / 3 / 1 / 5 / 1 | Aurelia, the Last Foundry (Yellow); Vorrek, the Walking Siege (Red) |
| Neon Syndicate | 13 → 14 | 2 / 4 / 2 / 3 / 3 | Zero, The Singularity (Purple) |
| Nether | 13 → 14 | 4 / 3 / 4 / 1 / 2 | Malzhur, the Abyss Lord (Red) |
| Umbra | 14 → 15 | 1 / 1 / 1 / 1 / 11 | Yshmir, the Worldwound (Purple) |
| Veldtborn | 13 → 14 | 2 / 3 / 2 / 4 / 3 | Azhar, the Rosetted Sun (Yellow) |
| Wildgrove | 13 → 14 | 2 / 2 / 7 / 2 / 1 | Oakenhart, the First Warden (Green) |

Factions now contain 14–16 champions. Chymera has 16 because it had two distinct gaps in the approved list; every other faction has 14–15. Strong color identities remain intentional. Mythical element counts remain **4 red, 3 blue, 2 green, 3 yellow and 3 purple**.

## Speed Coverage

| Speed | Mythical | Legendary | Rare | Common | Total |
| --- | --- | --- | --- | --- | --- |
| Very Fast | 1 | 2 | 2 | 4 | 9 |
| Fast | 5 | 9 | 13 | 5 | 32 |
| Average | 1 | 22 | 41 | 11 | 75 |
| Slow | 3 | 22 | 1 | 0 | 26 |
| Very Slow | 1 | 2 | 0 | 0 | 3 |
| Charging | 4 | 10 | 3 | 0 | 17 |

The new group adds one Very Fast, four Fast, three Average, two Slow and two Charging champions. Average remains the most common speed, with 75/162 (46.3%). Charging uses cumulative gates of 8/10 or 5/10/15. **Yshmir remains the only Very Slow Mythical.** Zhenya’s Very Fast skill has a restrained damage multiplier and a brief one-enemy debuff.

## Balance and Validation

Summon outcome odds remain 50% Common, 30% Rare, 7.5% Legendary, 1.5% Mythical and 11% twin-Common. The ten-call guarantee is unchanged. A larger pool reduces the chance of one particular Legendary or Rare; no additional Mythicals are recommended merely to equalize counts.

The build and tests fingerprint all 150 previous records, exercise each new charge tier and effect recipient, check summon eligibility and save compatibility, and verify legal Auto actions. Browser checks cover the Codex, portraits, dossiers and mobile layouts. `npm run roster:audit` regenerates the current report. This is a coverage and kit audit, not proof of equal matchup strength; later balance decisions should use real play results.
