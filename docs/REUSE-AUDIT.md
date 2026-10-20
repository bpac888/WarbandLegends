# Warband Legends content reuse audit

Source repository is read-only: `bpac888/warband-legends`. Its current remote main was verified at `acf554c4666208758a0c198f9fc2c1aef6e54aa4`. The local source checkout is `7acb93f92e7fd6975e9546f36d998b31fa4ee8c1`; source progression, consumables, equipment catalog and team-panel blobs match the current remote. The complete remote file tree and local pages/catalogs were inspected. Nothing is written back to that game.

## Reused in Legends

| Source content | Legends adaptation |
| --- | --- |
| 135 champions, IDs, names, factions, rarity, lore and portraits | All 135 retained; combined match-3 Specials, five elements, tile mana, compact stats and passive rules already adapted |
| Seven dungeon illustrations, magma boss art and themed guardians | Seven independent dungeons × three tiers already playable |
| Campaign structure and difficulty concept | 25 stages × three independent difficulties, with Legends' existing map art and progressively ruined skins retained |
| Arena roster presets and arena illustration | Nine local rivals, four champions each; original art and token economy adapted |
| Three monthly bosses, event imagery, calendar and tokens | Original themes, LA calendar, 20 attempts/window and exchange retained; event practice stays removed |
| Four Tavern/menu illustrations and portal ritual | Citadel destinations and summoning visuals already reused; redesigned Legends portal keeps activation timing |
| Account XP curve, account cap and level milestones (`backend/progression.py`) | Levels 1–100; `floor(100 × level^1.22)` XP per next level; source battle-XP scaling, with rewards for valid wins only; account XP remains separate from hero XP |
| Level milestone rewards | Claimable quests every ten levels, source gold formula, Gems replacing old summon resources, materials replacing equipment; no stat bonuses from account level |
| Daily calendar: 180 days, then 30-day loop | Source gold/token schedule and cadence adapted to Gems and ascension materials. No missed-day reset; one claim per LA calendar day, rollback guarded |
| Today's Path | Two wins, 150 earned Gems and one summon; fixed 400 gold, 125 Gems, two Star Thread and 50 account XP chest, once per LA day |
| Six original profile portraits | Optimized local embedded-WebP SVGs; selectable in Settings, shown beside account progression |
| Ten available faction emblems | Local optimized art on Codex/Collection cards. Veldtborn has no supplied source emblem, so no broken placeholder is rendered |
| Three saved warband slots (`TeamsPanel.jsx`) | Save/load owned five-champion teams in Settings; no item picks and no effect on an in-flight battle |
| Store/exchange/reward patterns | Gems, gold/material purchases, existing token exchanges and 43 milestone quests with explicit previews and once-only claims |
| Ascension/awakening progression ideas | Legends' existing gated levels and material-based awakenings retained and connected to quests/rewards |

Six portraits and ten faction emblems were copied/optimized. Their source hashes and local output paths are recorded in `data/reuse-manifest.json`. Images are local; the game never calls the original server.

## Explicit exclusions

**No equipment in Legends.** This is an explicit owner instruction. Do not add gear, equipment slots, forging, gear upgrades, gear stats or set bonuses. Source gear artwork/catalogs were inspected solely to identify and exclude them. Crowns, crystals and other existing ascension materials are consumable progression resources, not equippable gear.

Existing twenty tactical guides stay; create no new tactical guides. No new guide content was added in this pass.

## Content needing a different match-3 implementation

| Original feature | Disposition |
| --- | --- |
| Health Potion / Revive Scroll | Catalog reviewed (15% heal / 50% revival, max20, campaign/dungeon only). Not copied as turn-based actions; a later battle-item design must define targeting, move cost, healing restrictions, defeat handling and per-battle limits before adding it |
| Speed/turn-order combat, A1/A2/A3 kit selection | Retain Legends' one-Special, tile-charge, board-move combat. Source descriptions/assets were adapted, not its incompatible turn loop |
| Original accounts/authentication/backend/database/hosting | Kept separate. Legends stays a local independent game; no original player accounts, credentials, saves or economy are accessed |
| Original gear-based drops and milestone gear rewards | Equipment excluded. Daily/milestone rewards use Gems and existing champion materials instead |
| Quick-battle flow and original enemy scaling | Legends keeps fixed encounters and board-driven battles; no unreviewed reward bypass or auto-resolution added |
| Alliance, raids, tournaments and online identity | No pretend online play. Arena remains preset local teams; future tournaments should preserve the importance of Rare heroes |

## Visual cleanup

Shop departments separate materials, gold-for-Gems and token exchanges. Material cards show both gold and Gem prices, avoiding duplicate item galleries. Quests use Active/Ready/Completed filters, categories, and small progressive batches (six on phones, twelve on desktop). Upcoming daily gifts are an optional disclosure. Account XP is labeled separately from champion XP. Existing battle viewport sizing and the purple/blue/gold palette remain intact.
