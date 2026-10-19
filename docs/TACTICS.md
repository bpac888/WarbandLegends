# The Broken Road and Special clarity · v0.10

The first five campaign crossings now form a small authored chapter, The Broken Road. All three difficulties use its encounter patterns; their existing maps, difficulty scaling, IDs, unlocks and rewards remain in place. The objective is still to defeat the enemy warband. These are varied tactical encounters, not new timed or score-based victory conditions.

| Crossing | Threat | Counterplay |
| --- | --- | --- |
| The Ashen Gate | Scouts spread across seven columns | Break a flank; match into its empty lanes for double charge. |
| The Frozen Pass | Runa starts with Defense Up for two board moves | Dispel, attack the flanks, or wait out the ward. |
| The Veil Sanctum | The Shade Prince starts with four tile charge | Defeat him early or use mana disruption; stored charge and attack countdown are separate. |
| Howling Ford | Weaker flanks attack every two moves; a central Grove Druid attacks every five | Remove the fast attackers and use their empty columns to build charge. |
| Iron Crossroads | The Bronze Juggernaut enters Overpressure once below half health | Hold a dispel or protection Special for the phase; defeat the escorts to open lanes. |

Overpressure triggers **after a completed action** leaves the living boss at 50% HP or below. It never interrupts a cascade or occurs in the middle of a Special. The boss attempts to gain a Barrier and Attack Up for two board moves, then sets its next attack countdown to one. Buff Seal can prevent the new buffs; Dispel can remove them. The countdown change is a guardian rule, not a buff. The phase does not immediately attack, advance the move counter or refill mana. Ordinary enemy attacks still use their normal rules. Killing the boss skips the phase. It cannot recur after the buffs expire, are blocked or are dispelled.

A shield button in the battle title opens encounter tactics and the guardian's current phase. The battlefield remains free of explanatory sidebars. The phase uses the existing elemental protection animation and highlights the boss countdown. Enemy health captions now show the remaining Barrier pool as well.

The phase flag is stored with the battle. Reload, export/import and navigation do not rearm it. Older saved fights that lack the flag keep their original rules; the tactics panel explains this. New fights get the authored opening setup. No collection, XP, ownership, progress or champion ID is reset.

## Special explanations follow execution

All 135 heroes and all 152 charge levels now use the same ordered plan for resolution and description:

1. Cleanse allied ailments.
2. Dispel enemy buffs.
3. Apply timed buffs.
4. Restore health immediately.
5. Grant flat mana gifts.
6. Apply ailments.
7. Deal direct damage.

Only steps actually present in that charge level are shown. Steps retain their order within each category. Detailed views name the recipients, duration and exact mechanics. Periodic damage and regeneration are applied during the cast but first tick at the start of the next valid board move. Invalid swaps, opening details and casting Specials do not tick them.

A Special that targets an enemy uses the selected enemy, even when its caster is a support. Self/ally-targeted Specials with an enemy component automatically pick the living enemy with the lowest **current HP**, not the lowest health percentage. Taunt may redirect that single target. The target is chosen before the sequence resolves, so a single-target Dispel can itself be redirected by Taunt; an area Dispel is different. Area damage reaches every living enemy. These are existing combat rules now described accurately, not a new targeting system.

Ten representative heroes have expandable tactical notes in the dossier, battle inspection and applicable charging dialog:

| Hero | Identity | Decision / limit |
| --- | --- | --- |
| Dragon Mage | Area breaker | Charge 1 attacks sooner; Charge 2 adds an area Dispel before the stronger hit. |
| Shieldmaiden Runa | Focused protector | Time her brief Taunt and Damage Ward before an imminent single-target attack. |
| The Oracle | Board amplifier | Use the short Mana Flow/Barrier window with Tile Boost; the boost does not improve Specials. |
| Dune-Queen Zaya | Preventive support | Prepare wards before ailments arrive; Ailment Ward does not cleanse existing ailments. |
| Selka the Wraith | Fast wardbreaker | Dispel, Vulnerability, Pierce; Taunt can redirect the whole single-target sequence. |
| Redknife Tavin | Affordable finisher | Fast single-target damage and delayed Bleed; no extra tick on a target already killed by the hit. |
| Rimebow Tessa | Early mana pressure | Mana Slow affects future charge, not attack countdowns or an already-ready Special. |
| Grove Druid | Sustain and attrition | Team protection/healing plus automatic lowest-HP pressure; no manual enemy selection. |
| The Bronze Juggernaut | Heavy protector | Team Barriers and self-protection, with a slow charge; DoT bypasses barriers. |
| Frost Sage | Recovery anchor | Cleanse before wards/healing, with regeneration later; a powerful but Very Slow commitment. |

This review spans five colors, all four rarities and all three roles. No hero kit numbers, mana thresholds, rarity assignments or passive behavior were changed. Rare usefulness still comes from role, cost and future eligibility restrictions, not equal general power to higher rarities.

## Initial difficulty probe

`node tools/chapter-smoke.mjs` plays 20 seeds per encounter with a simple first-legal-move policy and ready Specials, using the starter team. It is a regression probe, not a human player or final balance claim.

| Starting level | Gate | Pass | Sanctum | Ford | Crossroads |
| --- | --- | --- | --- | --- | --- |
| 1 | 20/20 | 20/20 | 18/20 | 12/20 | 17/20 |
| 10 | 20/20 | 20/20 | 20/20 | 15/20 | 20/20 |
| 30 | 20/20 | 20/20 | 20/20 | 19/20 | 20/20 |

The ambush punishes ignoring its fast attackers. Human playtesting, target priorities, other teams, later chapters and harder difficulties still need balance work. Training and elemental/charge choices remain useful. The first slice establishes an authored chapter and clearer combat decisions; it does not add tournaments, overheal, minions or online systems.
