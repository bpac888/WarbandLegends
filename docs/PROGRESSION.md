> Current progression: see [Hero progression v0.18](ASCENSION.md). The historical design notes below describe the earlier foundation.

# Hero development

> Current economy/save rules: [Gems and account journey (v0.15)](GEMS-QUESTS.md). Seals and older save migration notes below describe earlier releases.

Current v0.13 adds [ascension gates, illustrated materials and awakening](ASCENSION.md). The original leveling foundation below remains, with caps now opened through ascension and Codex maximums including full awakening.

A complete first loop: win campaign encounters → gain XP and gold → level heroes or train them with gold → use stronger stats against fixed-strength encounters. This is an initial playable balance pass, not final end-game tuning.

## A fresh independent journey

The owner explicitly authorized discarding the prior Legends test progress. v0.7 uses `legends.runes.profile.v2` (profile schema 5) and `legends.runes.battle.v4` (combat schema remains 3). It ignores the prior profile/battle keys rather than clearing other browser data. Older backup profiles cannot be imported as new progression saves. Current XP, collection copies, resources and in-flight battle snapshots export/import and resume normally.

New profiles have the existing rainbow starter team, all at level 1; 500 gold; five seals; and collected-only teams. All 135 roster IDs, maximum stats, elements, rarities, Specials, passives and art are unchanged. No Warband Legends data, account, save or repository is used at runtime or modified.

## Levels and stats

| Rarity | Level cap | XP weight | Gold per remaining XP |
| --- | ---: | ---: | ---: |
| Common | 30 | 1 | 0.4 |
| Rare | 50 | 1.25 | 0.5 |
| Legendary | 70 | 1.6 | 0.65 |
| Mythical | 80 | 2 | 0.8 |

Cumulative XP for level `L`: round(`weight × [60n + 12n(n−1)]`), with `n = L−1`. Level 1 starts at 55% of the maximum roster ATK, DEF and HP. Stats rise linearly, rounded to integers, reaching the exact existing maximum baseline at the rarity's cap. Leveling adds no mana modifiers, extra abilities, skill ranks or equipment. Ascension gates the caps; awakening adds up to9% to maximum stats after full ascension and final level. See the current ascension rules.

Rare heroes are cheaper to develop than higher rarities. Their future tournament role is preserved: rarity/color restrictions and special rules can exclude stronger tiers. No tournament mode or fixed tournament presets are implemented in this release.

## XP and rewards

| Encounter | XP per participating hero, first clear / replay | Gold, first clear / replay |
| --- | ---: | ---: |
| Ashen Gate | 120 / 80 | 500 / 50 |
| Frozen Pass | 180 / 120 | 500 / 75 |
| Veil Sanctum | 270 / 180 | 500 / 100 |

Every collected hero who entered the winning battle earns XP, including fallen allies. The battle team determines recipients, not a later edited team. XP stops at the current ascension cap; overflow is discarded. Ascend to open the next cap. Defeat and abandoned battles do not award XP. First clears give one seal. Every fifth earned campaign victory gives one more seal, stacking with a first-clear seal when both apply. The campaign shows progress toward this repeatable goal. Existing starter quests remain available.

The result shows each participant's XP, level changes and current level progress. Saving and restoring the same resolved victory does not award it again. An active battle keeps the levels/stats captured when it began; development applies to the next encounter.

## Gold training and duplicates

The Development section previews exact current → next-level stats and the gold cost to complete the next level. Cost is ceil(`remaining XP × rarity gold rate`). A confirmation shows the hero, price and resulting stats. The action rechecks ownership, current XP, level cap and available gold. An outdated confirmation cannot train a second level. Cancel spends nothing. Training can be repeated deliberately, one confirmed level at a time.

No XP item or additional currency is required. Campaign XP remains free. Duplicate copies are retained and share one development record per hero ID; no copies are consumed. Separate leveled instances and feeding are not introduced.

## Collection, Codex and playtesting

Collection cards and stat sorting show actual current development. Codex cards and sorting always show maximum-level, fully awakened previews for consistent comparison; ownership/copy counts remain visible. Champion detail shows owned heroes' actual development or an explicit maximum-level preview for an uncollected hero. Cards keep speed names; exact charge gates remain in Special details.

Playtesting is optional in Settings: all 135 heroes at maximum levels, all three existing campaign destinations accessible. The mode is captured when a battle begins. A playtest battle never pays XP, gold, seals, victories or campaign unlocks, even if the setting is later disabled. Changing the setting does not silently alter an existing battle.

Campaign enemies now have authored fixed ATK/DEF/HP. The center guardian has 15% more HP. Match-3 combat, enemy kits/countdowns and mana rules remain unchanged. The existing three encounters form the first progression test loop; expanding the chapter and creating more distinct boss mechanics remains next.
