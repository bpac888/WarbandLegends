# Step 1 rules

## Matching and targeting

Swap orthogonally adjacent runes to form three or more of one color. Nonmatching swaps cost no move, consume no RNG, and do not advance enemies. Intersecting runs form one connected match. A full cascade, including triggered specials and refills, is one move. Gravity fills from above; a board with no legal moves automatically realigns.

Enemies cover columns 1–2, 3–5, and 6–7 respectively. Each cleared rune strikes the living enemy covering its column. Tiles in empty lanes grant double mana. Colors with no living champion clear normally but grant no attack or mana. Every living champion matching a cleared color gains mana, so stacked teams charge together.

A match of four creates a Blast Rune at a surviving matched cell; five or more creates a Prism. Blast clears a 3×3 area. Prism clears its own color when double-tapped or the neighboring rune's color when swapped. Specials can trigger other specials. The created rune remains on the board instead of dealing a normal clear on its creation.

## Elements and damage

Ember (red) beats Verdant (green), Verdant beats Frost (blue), Frost beats Ember. Radiant (yellow) and Umbral (purple) beat each other. Strong hits deal 2× damage; reverse red/green/blue hits deal 0.5×; other hits deal 1×.

Rune power is `0.24 × sum(effective matching champion ATK × role modifier) × cascade modifier`. ATK roles receive 1.1×; cascade modifier is `1 + 0.2 × (cascade number − 1)`. Defense multiplies damage by `130 / (130 + effective DEF × 0.5)`. Pierce reduces the defense coefficient to 0.375. Damage is rounded, with at least one damage before shields. Shields absorb damage before HP.

Each cleared rune grants 10 mana to matching champions, or 20 in an empty lane. Mana is capped at 100. Quickened multiplies gains by 1.2 and Slowed by 0.85; both can coexist.

## Abilities and adaptations

All champion identities, original IDs, source lore and base stats are retained. Their original A3 effect lists and passives are reused; their original A2 lists are retained as data but are not separate buttons in this first puzzle build. A normal attack is represented by matched runes, and a signature ability costs 100 mana. Casting does not consume a board move or advance enemies.

ATK and DEF signature abilities strike at 240% effective ATK, single-target or all enemies according to their kit. SUP abilities heal a selected living ally for 65% effective ATK + 12% target max HP, then strike the weakest enemy for 45% ATK (all enemies when their kit has AoE). Kit debuffs apply before the hit. Buffs affect self, except support buffs affect all living allies and Legendary/Mythical defender shields protect the whole team. Cleanse removes debuffs from all living allies.

ATK/DEF up/down modify the respective stat by +25%/−25%; Strengthen reduces damage by 15%, Weaken increases it by 15%. Shield is 20% max HP (modified by shield passives). Poison/Burn each deal 5% max HP per affected-unit turn and bypass shields. Regeneration restores 10% max HP; passive regeneration uses its imported value. Counterattack strikes for 50% ATK without recursively triggering a counter. Death ward revives once at 30% HP; passive revival uses its imported fraction and a separate once-per-battle flag. Buff seals, debuff wards, passive immunities, shield boosts and unblockable buffs are honored.

Durations count the affected unit's turns. Heroes take a turn with each valid board move; enemies take one when their countdown reaches zero. Effects newly applied during a move are not decremented at the end of that same move. Taunt forces an enemy's basic attack toward its living source and blocks a taunted champion's signature cast. Rune column targeting is unchanged by taunt.

## Enemies and progression

One full board move advances every living enemy's countdown once. At zero it attacks a living champion and resets; every third attack uses its signature skill. Quickened shortens the reset interval by one, Slowed increases it by one (minimum one). Normal enemy attacks have an 8% critical chance and 1.5× critical damage. Enemy HP, ATK and DEF scale from the selected team's mean stats for these three introductory encounters.

Defeating all enemies wins and unlocks the next encounter. Losing all champions ends the encounter. Encounters can be replayed; there are no consumable costs or item rewards in step 1. Victories are recorded once per saved encounter ID.

## Independent persistence

The seeded engine is deterministic. Saves use only `legends.runes.profile.v1` and `legends.runes.battle.v1`; there is no API, authentication or original-game storage dependency. Actions resolve and save before visual playback, so leaving mid-animation resumes the completed action. Local saves are not tamper-resistant and are appropriate for this single-player prototype. Competitive play will require a separate authoritative server.
