# Status review · Legends v0.3

The previous system inherited turn-based effects that partly fit the match-3 game, but three interactions needed correction: Taunt disabled Specials, enemies used a much slower status clock than heroes, and Frost Sage's passive referenced the removed SPD ailment. This update gives effects a common clock, useful counters and clearer damage categories.

## Decisions

| Previous mechanic | Decision | Reason in match-3 combat |
| --- | --- | --- |
| Attack Up / Attack Down | Keep; mutually replace | Both affect matching-color tile attacks and direct Special/basic damage. An attacker remains useful between Specials. |
| Defense Up / Defense Down | Keep; mutually replace | Work naturally against columns and Specials. Defense Down combines with color-specific armor reductions. |
| Strengthen / Weaken | Keep as Damage Ward / Vulnerability; mutually replace | These adjust direct damage after armor, giving a distinct role from DEF changes. They do not modify DoT. |
| Shield | Keep as Barrier; recasts reset its pool | A visible absorption pool is useful, but repeated casts must not accumulate unlimited shields. DoT is a counter. |
| Immediate healing / Heal-over-time | Keep separate | A Special's immediate healing is not a status. Regeneration is a timed, dispellable buff; instant healing and regeneration can work together. |
| Mana Flow / Mana Slow | Keep; mutually replace | They modify generated tile charge rather than a removed speed stat or enemy countdown. |
| Taunt as an ailment on the opposing team | Replace with a buff on its defender | The old version locked everyone out of Specials, even cleansing/healing, while tiles still ignored the forced target. New Taunt redirects single-target attacks without disabling casting. |
| Counterattack | Keep as Riposte | Reacts to direct basics and Specials; no arbitrary retaliation against the entire party for a column of tiles. Runes and DoT cannot trigger it, and counters cannot chain. |
| Death ward | Keep; once per battle | Gives planned protection against lethal damage. It is a removable buff, distinct from permanent revival passives. |
| Buff Seal / Ailment Ward | Keep; clarify timing | Seal prevents new timed buffs; Ward prevents new ailments. Neither removes something already present. Instant healing and gifts are not timed buffs. |
| Cleanse | Keep; add its missing counterpart | Cleanse removes ailments from allies; Dispel removes buffs from enemies. Neither removes passive abilities. |
| Poison / Burn / Frostbite | Keep; normalize to 4% max HP per board move | The former per-unit-turn clock made enemy DoT much slower. Different types can coexist; each individual type refreshes rather than multiplying its own stacks. |
| AoE / Pierce | Keep as damage properties | They are not timed buffs or ailments and never need a status badge or cleanse. |
| SPD-related passive immunity | Update | Frost Sage now resists Mana Slow. Yshmir's obsolete Taunt-ailment immunity becomes Mana Block immunity. Passive identities are retained. |

## Targeted additions

These give selected champions distinct roles; they are not granted to the whole roster.

| Addition | Implementation and representative users |
| --- | --- |
| Tile Boost | +35% tile damage only; multiplies with Attack Up's +25%. The Oracle and Jade-Mender Lian empower allies; Gharn and Sahri empower their own tiles. |
| Elemental Defense Down | −25% effective DEF against one color, multiplicative with generic Defense Down and Pierce. One specialist per color: Vhessa/red, Ilyra/blue, Syth/green, Auroline/yellow, Neve/purple. |
| Mana Block | Prevents new generated/gifted charge without deleting existing mana or silencing an already-ready Special. Shade Prince, Vesper and Zero have short control windows; Zero gains it only at full charge. |
| Mana Gift | Flat +1.5 tile charge to other living allies, capped, unmodified by generation buffs and blocked by Mana Block. Lyra and Suyin support team timing without refunding their own cast. |
| Dispel | Removes enemy timed buffs before damage. Selka, Desert Assassin, Sora and full-charge Dragon Mage can answer Barrier, Taunt and protection buffs. |
| Bleed | A fourth 4%-HP DoT identity for blades and blood magic: Redknife Tavin, Lady Death, Crimson Castellan and Nera. |

Selected Specials trade an older effect for a new one. Additive utility on Desert Assassin, Sahri and Nera comes with lower immediate damage; Suyin trades some healing for Mana Gift. Full-charge gates are preserved. The exact authored overrides are in `data/status-design.json`; `npm run roster:build` regenerates the active roster and complete champion guide. IDs, rarities, color assignments, mana thresholds, portraits and stat baselines from v0.2 stay intact.

## Stacking and counterplay

- **Same ID:** the new effect replaces the previous duration/source. It never doubles its magnitude, and a shorter recast can shorten the remaining duration.
- **Opposing categories:** Attack Up/Down, Defense Up/Down, Mana Flow/Slow, and Damage Ward/Vulnerability replace their opposite when successfully applied. A blocked effect does not erase its opposite.
- **Different categories:** Attack Up × Tile Boost boosts tile power; Defense Down × matching elemental reduction × Pierce reduces effective armor. These factors do not multiply the entire final damage by those percentages; they enter their documented damage layers.
- **DoT:** Poison, Burn, Frostbite and Bleed can coexist, one of each. Their combined maximum is 16% max HP per board move before rounding. Defense, direct-damage wards and barriers do not alter it. Cleanse, Ailment Ward, healing and appropriate passives provide answers.
- **Taunt:** the most recently applied living Taunt redirects single-target offensive effects as well as hits. Equal-time ties use the existing unit order. Area attacks, ally effects, and tile columns remain unchanged. Dispel removes it.
- **Passives:** no timed-effect cleanup removes a permanent passive. A passive revival and a timed Death Ward have separate once-per-battle flags.

## One clock

A valid swap or special-rune activation advances the board move once, including every cascade. Both sides tick Regeneration, passive regeneration and DoT at the start of that move. Previously existing effects lose one duration at the end, after enemies have acted. Newly applied enemy effects survive that same move's end. Free champion casts, invalid swaps, menus and animation speed changes do not tick statuses. Enemy attack countdowns are separate.

## Interface and saves

Badges use separate buff/ailment colors, vector symbols and remaining-board-move numbers. They can be tapped on mobile to read current effects. The effect field guide separates buffs, ailments and instant actions and explains stacking. Updated ability cards use the same descriptions as combat's shared catalog. Floating damage/healing numbers and an upkeep animation beat help expose what changed.

New saves use the v3 battle key. v0.2 battles migrate without restarting: HP, charge, board, RNG, turn counts and progress remain. Old Taunt ailments become Taunt buffs on their living source. The old record remains untouched. Much older v0.1 active battles retain the previously documented restart migration because their stats and 100-point mana model differ.

## Not added yet

Stun, blanket silence, blindness, mana theft and board conversion are deferred. They need additional targeting, resource and pacing work; the current set already creates combinations and clear counters. This is an initial balance pass, with automated interaction checks and browser validation, rather than a claim that final player balance is settled.

See the in-game effect field guide for all values, and [the complete roster](ROSTER.md) for every revised Special.
