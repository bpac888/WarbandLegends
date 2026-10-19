# The Hollow Covenant · v0.11

Stages 6–10 now form a second authored campaign chapter, alongside The Broken Road at stages 1–5. The three existing difficulty skins, all 75 stage IDs, sequential unlocks and rewards remain intact. A chapter heading identifies each authored group. Stages 11–25 still use the existing encounter framework; they do not yet have individually authored tactics or guardian phases.

| Crossing | Opening threat | Useful response |
| --- | --- | --- |
| Widow’s Watch | Sable starts with two moves of Regeneration | Focus damage or Dispel; Cleanse removes ailments, not her healing buff. |
| Broken Banner | The right-side Lyra starts at 8/12 tile charge | Mana Block delays her first Special. Afterward, Dispel removes its buffs but cannot undo healing or gifted charge. |
| Salt Marsh | All enemies have two moves of Ailment Ward | Dispel or wait before committing ailments. Direct rune damage still works. |
| Gallows Rise | Both weaker flanks have two moves of Death Ward | Dispel, let the wards expire, or prepare to defeat a revived sentry. Each can return once at 30% HP. |
| Obsidian Gate | Lucifer enters Last Light if both escorts fall while he lives | Defeat him first, Dispel his new buffs, or exploit the open lanes with runes that cannot trigger Riposte. |

## Last Light

The phase triggers once **at the end of a completed action** when both escorts are defeated and the boss is alive. It does not interrupt a Special or cascade, and a simultaneous full clear skips it. The boss attempts to apply Defense Up and Riposte for two board moves. His countdown becomes at least two, so it never schedules an immediate extra attack or shortens a longer countdown. It grants no charge or healing.

Buff Seal can prevent the new buffs; Dispel can remove them. The countdown rule itself is not a buff. Riposte answers direct basic attacks or Specials with a surviving attacker, not rune strikes or DoT. A Special that dispels before dealing damage can remove it before the hit. The two buffs use the existing timer/refresh rules. The triggered flag stays set after expiry, blocking or removal.

This is a different decision from Overpressure: attacking the center first can avoid Last Light, while clearing escorts first opens double-charge lanes but may awaken the guardian. Overpressure at stage 5 still triggers at half health. A development-time comparison confirmed exact v0.10 state/frame equivalence over 482 actions in 50 seeded first-chapter fights after generalizing guardian resolution.

## Better information at the point of choice

Every enemy now has an information button. It opens the actual captured battle stats, current tile-equivalent charge, attack countdown, complete Special, and any passive/tactical notes. It costs no action. Enemy details explain that enemies gain four charge at each attack opportunity and cast the highest charge when full; their mana does not come from player matches.

Each later charge level has an expandable **Compare with Charge …** section. It compares tile requirements, direct-damage coverage and percentage, healing, Pierce, and added/removed/changed effect recipients and durations. It describes tradeoffs rather than labeling every higher charge better. Vex is the clearest example: Charge 2 deals 202% ATK to one enemy; Charge 3 deals 190% ATK to each enemy and extends/widens Mana Slow. Either spends all stored charge. Numeric thresholds stay in details, not compact cards.

Ten additional tactical identities bring the reviewed group to twenty:

| Hero | Role decision |
| --- | --- |
| Fen, the Spore Adept | Heal/ward early or hold for a stronger team ward and automatic enemy pressure. |
| Acolyte Iyr | Focus a heal and Attack Up on one living ally; not a team heal or revival. |
| Drekka the Scavenger | Fast, affordable Attack Down pressure without altering attack countdowns. |
| Caravan Warden Samira | Two-move Taunt lasts longer than her one-move damage protection. |
| Matrix Matriarch Lyra | Cleanse and relay charge to other allies; the flat gift is not amplified by Mana Flow. |
| Auroline, Transmuter Prime | Three focused charges, with Pierce and a yellow-defense reduction at later levels. |
| Vex, the Elixir Apotheon | Trade focused damage for area pressure; regeneration stays self-only. |
| Sir Aurel | Long Taunt, brief team Barrier and a separate once-per-battle revival passive. |
| Sable, Pale Matriarch | Recover into offense; her buff-blocking immunity applies to herself, not every ally. |
| Archangel Lucifer | Early barriers or a longer ward plus short self Riposte; runes bypass the counter. |

No hero stats, mana thresholds, colors, rarities, Special coefficients, passive rules or champion IDs changed. Common/Rare usefulness remains tied to role and development cost, with future tournament restrictions still planned. Overheal, minions and tournaments are not implemented in this release.

## Initial difficulty probes

Run `node tools/chapter-smoke.mjs --covenant` for first-living-enemy targeting, or add `--flanks-first` to prioritize escorts. Both use first-legal-move board choices and ready Specials over 20 seeds per stage. They are reproducible regression probes, not human playtests or a final balance verdict.

| Starting level | Watch | Banner | Marsh | Rise | Gate |
| --- | --- | --- | --- | --- | --- |
| 1, first-living | 20/20 | 15/20 | 18/20 | 20/20 | 14/20 |
| 10, first-living | 20/20 | 18/20 | 20/20 | 20/20 | 17/20 |
| 30, first-living | 20/20 | 20/20 | 20/20 | 20/20 | 20/20 |
| 1, flanks-first | 20/20 | 15/20 | 18/20 | 20/20 | 15/20 |
| 10, flanks-first | 20/20 | 17/20 | 20/20 | 20/20 | 17/20 |
| 30, flanks-first | 20/20 | 20/20 | 20/20 | 20/20 | 20/20 |

At the Gate, Last Light triggered in 3/1/2 of 20 seeds for first-living targeting at levels 1/10/30, versus 10/5/5 for flanks-first. Target choice affects whether the phase appears. Different boards, colors, teams and human tactics still need evaluation. The boss/flank HP proportions were adjusted during development so the escort-triggered phase can occur naturally while retaining the boss-first counterplay.

All existing browser save namespaces and profile schema remain unchanged. Old saved fights keep their captured enemies, stats and absence of a new phase; they are not silently converted to a different formation. New encounters use the authored setup. The original Warband Legends game remains untouched.
