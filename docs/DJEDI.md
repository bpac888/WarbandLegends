# Djedi

Eight Djedi champions join the roster, bringing it to 248 characters across fifteen factions. All 240 previous characters, source records, kits and portraits remain unchanged.

**Resonant Discipline:** two or more Djedi champions give **+10% ATK to Djedi members only**. Additional members do not increase that percentage. The starting-team count remains fixed during the battle, including after a member falls. Djedi's ATK bonus and an allied Magic mana aura can coexist.

| Champion | Element | Rarity / role | Speed | Special |
| --- | --- | --- | --- | --- |
| Kobe Jacoby | Green | Legendary Attack | Average | 265% single-target damage, Mana Slow for 2 moves and personal Damage Ward for 1. |
| Commander Pain | Blue | Legendary Attack | Slow | 190% area damage with Pierce; personal Riposte for 2 moves. |
| Jace Gold | Purple | Legendary Attack | Average | 280% single-target damage, Dispel and Buff Seal for 2 moves. |
| Windwalker | Blue | Legendary Attack | Fast | 270% single-target damage and personal Attack Up for 2 moves. |
| Dark Lord | Red | Legendary Attack | Slow | 195% area damage, Mana Slow for 2 moves and Attack Down for 1. |
| Cheeburrash | Green | Legendary Defense | Average | 160% single-target damage; personal Taunt and Defense Up for 2 moves. |
| AR2 | Yellow | Rare Support | Average | Heal all living allies for 22%; grant other living allies 1.5 flat mana. |
| Lord of Darkness | Red | Legendary Attack | Fast | 260% single-target damage with Pierce and Bleed for 2 moves. |

All eight have new detailed HD portraits matching the requested identities and weapons: Kobe's oversized brown hood, long white beard and green energy sword; the commander's four scarred metal arms and four swords; Jace's dark-skinned appearance, flowing platinum-blond dreadlocks and purple sword; Windwalker's black goatee, single braid hanging in front of his shoulder and blue sword; the black-armored Dark Lord with a heavily heat-damaged helmet; Cheeburrash's round head, large round ears, multicolored upper-body fur, crossbow and utility bandolier; AR2's mismatched humanoid metal body and golden disc eyes; and the hooded Lord of Darkness in an oversized black robe, carrying one double-ended red energy weapon.

The faction has its own emblem and appears in Codex, Collection, shared team filters, live draft summaries, the Guide and battle inspection. All eight join their existing rarity summon pools. Rarity odds and previous faction bonuses remain unchanged; no new combat status types or profile fields are required.

Preservation is recorded in `data/roster-expansion-10.json`. Validation: `npm run check`, `npm run test:djedi`, `npm run roster:audit`, `npm run roster:review`. Tests cover exact membership thresholds and recipients, fixed ATK scaling, Magic coexistence, Specials, AR2 healing and flat mana, Cheeburrash protection, Auto, summons, saves, and responsive artwork and filters.
