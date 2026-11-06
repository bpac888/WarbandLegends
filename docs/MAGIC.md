# Magic — the elite wizard faction

Magic has six champions: five elemental Legendaries and one ancient Mythical. The roster now has 240 champions across fourteen factions. The original thirteen factions retain eighteen members each; all 234 previous character records, kits and portraits are preserved.

## Arcane Resonance

One Magic champion activates **+5% mana generation for every ally**, including themselves. Each additional Magic champion adds another 5%, reaching **+25% at five members**. These increases add together; they are not separate compounding 5% multipliers. Starting-team counts stay fixed for the battle, including after a member falls.

The aura multiplies other generated-mana modifiers, including matching faction bonuses and Mana Flow/Slow. Empty-lane generation benefits normally. Mana Block still prevents charge gain and mana caps still apply. Flat Mana Gifts and Nether opening mana are unchanged. The aura applies to the player's team; existing enemy faction rules remain unchanged.

## Wizards

| Champion | Element | Rarity / role | Speed | Special |
| --- | --- | --- | --- | --- |
| Vaelric, Cinder-Crowned Magus | Red | Legendary Attack | Slow | 230% damage to all enemies; Burn for 2 moves. |
| Iseldra, Glacial Archmage | Blue | Legendary Defense | Average | 160% damage to one enemy; team Barrier and Damage Ward for 2 moves. |
| Merovant, Verdant Archmage | Green | Legendary Support | Average | Heal all allies for 32%; Cleanse; Mana Flow for 2 moves. |
| Caldrien, Dawn Wanderer | Yellow | Legendary Attack | Average | 195% damage to all enemies; Dispel and Attack Down for 2 moves. |
| Nyzara, Voidweaver | Purple | Legendary Attack | Fast | 280% damage to one enemy; Dispel and Mana Block for 1 move. |
| Eldravon, the First Arcanum | Purple | Mythical Attack | Slow | 235% damage to all enemies; Dispel, Mana Block for 1 move, and team Damage Ward for 1 move. Immune to Mana Block. |

The five Legendaries have premium stat lines and strong specialist kits. Eldravon has 960 ATK / 870 DEF / 1,660 HP and an intense cosmic artwork theme showing all five elements. Caldrien uses a classic grey-bearded wandering wizard silhouette with a pointed hat, travelling robes and radiant staff. All six portraits retain detailed 1024 × 1536 artwork. A new Magic emblem appears with faction labels.

The faction is integrated into the Codex, Collection, shared team filters, team summaries, battle inspection and faction Guide. All six are summonable within their existing rarity pools; global summon odds remain unchanged. No copies or free items are granted to existing saves.

`data/roster-expansion-9.json` fingerprints the preserved 234-character baseline. New tests verify exact stacking and recipients, modifiers and flat gifts, death persistence, valid snapshots, Specials, Auto, summons, filters and responsive HD portraits. Validation: `npm run check`, `npm run test:magic`, `npm run roster:audit`, `npm run roster:review`.
