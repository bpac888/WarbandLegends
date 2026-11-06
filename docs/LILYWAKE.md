# Ondelle, Lilywake Huntress

Ondelle is a blue Rare Attack champion in Wildgrove. Her addition brings the roster to 234 champions, with exactly eighteen in each of the thirteen factions. Wildgrove now has three blue champions and nine attackers, six supports and three defenders. Its rarity mix becomes three Commons, eight Rares, six Legendaries and one Mythical.

- Baseline: 690 ATK, 565 DEF, 1,060 HP.
- Average speed: ten matching tiles.
- **Lilywake Undertow:** 255% ATK damage to one selected enemy and Mana Slow for two turns. Mana Slow reduces generated tile charge by 15%; it does not alter attack countdowns.
- No passive, area damage, healing, new combat effects or changes to the Wildgrove bonus.

The new 1024 × 1536 portrait depicts an armored pond huntress with lily-pad armor, water magic and a willow spear, standing among flowering lily pads in Wildgrove’s forest. The detailed artwork is bundled locally as `assets/champions/ondelle_lilywake_huntress.webp`.

She enters the existing Rare summon pool and all automatic Codex, Collection, team, feeding and development flows. Summon rarity odds remain unchanged. `data/roster-expansion-8.json` fingerprints all 233 previous records, source records and portraits, while the earlier Aerie Court manifest retains its bounded historical batch. No previous character was changed.

Validation: `npm run check`, `npm run test:lilywake`, `npm run roster:audit` and `npm run roster:review`. Tests cover the preserved baseline, faction counts, stat envelope, targeting and Mana Slow, charge spending, Auto, Wildgrove synergy, summons, saves/backups, filters, HD portrait rendering, and phone/tablet/desktop character pages.
