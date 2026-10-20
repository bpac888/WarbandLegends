# Gems, quests and the Keeper's journey · v0.15

The owner approved a fresh start for this economy. New independent keys: `legends.runes.profile.v3` (schema 9 at v0.15; v0.16 migrates it to schema 10), `legends.runes.battle.v5` (existing combat schema 3). Older keys are ignored, not deleted; old profile backups cannot be imported into this fresh economy. Nothing in Warband Legends is reset or changed.

## Gems

A new profile starts with five collected level 1 champions, 500 gold and 500 Gems. Summon Seals are removed from current resources, rewards, store offers and summoning controls. The blue-diamond Gem icon is locally bundled at `assets/items/gem.svg`. Buff Seal remains a status effect; it is unrelated to the retired currency.

- One summon costs 100 Gems. Ten cost 900 Gems and guarantee at least one Rare, retaining the previous rarity roll rules (50% Common, 35% Rare, 13% Legendary, 2% Mythical). Since v0.16, each summoned copy has its own development.
- Each campaign first clear gives 100 Gems; campaign replays give none except 50 bonus Gems every fifth campaign victory.
- Each dungeon's first tier-clear gives 100 Gems; each replay gives 10 Gems.
- Special Event victories give 100 Gems on the first clear of each event and 25 on subsequent wins. Monthly attempt/calendar restrictions are unchanged.
- Token exchanges: 40 Arena Tokens → 100 Gems; 24 matching event tokens → 100 Gems. The existing 20 Arena Tokens → 500 gold offer remains.
- The shop also spends Gems: 100 → 1,000 gold; 500 → 5,500 gold. Each ascension/awakening material can be bought for either its existing gold price or `ceil(goldPrice/10)`Gems, one at a time with confirmation.
- The Gem cap is 999,999,999. Purchases check affordability and storage before committing; insufficient funds never consume RNG or partially summon. Ten pulls are atomic.

Valid battle payouts are settled once. Sandbox/abandoned/defeated fights do not award Gems or account XP. Daily/calendar/quest claims persist and do not pay twice on reload. The local game is not a server-secured competitive economy.

## 43 milestone quests

Quests cover campaign difficulties, dungeon wins and unique vaults, Arena, monthly events, summons, unique collection, champion XP, ascensions, awakening and account levels 10–100. Active, Ready and Completed views plus categories keep the page manageable. Small batches load more on demand.

Rewards combine Gems, gold, existing material items, account XP and (for some quests) champion XP. Champion XP is granted to each collected hero in the current five-hero team. Unowned playtest selections get none; XP stops at the current ascension cap, and extra XP is not banked. Current battles keep captured stats. Quest progress is derived from actual saved accomplishments, not UI visit counters. Each quest ID can be claimed once.

## Account progression and daily rewards

Overall account levels 1–100 are separate from hero levels. The XP curve and battle-XP scaling were adapted from the original game's progression module. Account levels change no combat stats; every tenth level opens a reward quest. New profiles begin at account level 1 / 0 XP. Source max-level threshold is 1,226,843 total account XP.

The daily calendar has 180 main days followed by a repeating 30-day loop. It follows Los Angeles midnight, keeps progress after missed days and allows one claim per day. Gifts include Gems/gold, occasional Arena Tokens, and ascension/awakening materials in place of source gear. Upcoming gifts can be previewed.

Today's Path needs two real wins, 150 Gems earned today and one summon. Its once-daily chest grants 125 Gems, 400 gold, two Star Thread and 50 account XP. Calendar gifts, quests and token-exchange Gems count as earnings; spending Gems does not. Sandbox battles grant no progress. Clock rollback does not unlock an extra daily gift/chest.

Six source profile portraits, ten faction emblems and three owned-team slots are integrated. Saved teams change the next encounter only. No equipment, gear slots, forging, or set bonuses are added. See [the reuse audit](REUSE-AUDIT.md) for source mapping and exclusions.

All 135 hero IDs and the 20 existing tactical guides are retained. No new tactical guides are created. Current ascension, awakening, battle rules, animation speed and viewport layout remain intact. Economy values are an initial balance pass to playtest and tune.
