# Legends · Runes of War — detailed project guide

A new, independent match-3 RPG using the owner's Warband Legends champions and artwork. This repository does **not** modify, launch, or connect to Warband Legends. The current foundation includes playable campaign, dungeons, Arena, monthly Special Events, summoning, collection, and a connected game shell.

## Play locally

Install Node.js 22 or newer, open a terminal in this repository, and run:

```sh
npm start
```

Open **http://localhost:4173**. No package dependencies, environment variables, database, Docker, Render service, or original-game account are needed. Do not open `index.html` directly; browsers require an HTTP server to load the roster.

```sh
npm test          # deterministic combat, roster and save tests
npm run build    # produces dist/ for static hosting
npm run check    # tests and production build
node tools/serve.mjs --dist  # preview the production build
```

## What's playable

- Richer blue, violet and gold menus, larger readable text, a compact Guide for general rules, and vivid full-art event panels. Battles use the available screen area while fitting desktop, phone and short landscape viewports.
- Account levels 1–100, ten level milestones, a 180-day gift calendar followed by a 30-day loop, Today’s Path, six source portraits, ten faction emblems and three saved warbands in the Codex Teams tab. [Reuse audit](REUSE-AUDIT.md). No equipment.
- A cinematic splash screen, Citadel hub, Adventure map, dedicated roster/codex, animated summoning portal, quests, inventory, and settings.
- Five level-1 starting champions, 500 Gems, independently leveled duplicate hero copies, 200 Gems per first-clear Campaign stage, and 43 quests with Gems, gold, materials, account XP and champion XP.
- Ascension tiers with retained power and immediate stat gains, two five-level Limit Breaks for Rare and higher heroes, ten illustrated materials, earned dungeon drops and confirmed gold purchases in the Supply Exchange. See [hero progression](ASCENSION.md).
- Individual hero levels, XP bars and stat-growth previews. Consuming a spare Common grants at least 360 XP; battles and quests also grant XP. Gold alone cannot raise a hero's level. See [roster and summoning balance](V017-ROSTER-AND-POLISH.md).
- Summoning odds: Common 50%, Rare 30%, Legendary 7.5%, Mythical 1.5%, or two independently owned Commons 11%. Fourteen former Commons are Rares, and the remaining twenty Commons are balanced four per element.
- Campaign wins give each participating collected hero XP, including fallen allies. Replays grant XP and gold; every five victories earns 50 bonus Gems.
- Fixed encounter strength: enemies do not scale up when your heroes improve.
- Save export/import, collection-only or open-roster playtesting, and device-based reduced-motion support.
- Full-art Collection/Codex cards without unowned dimming, combined element/rarity/mana/type/faction filters, name/stat sorting and clear-filter controls.
- A five-element crest and midnight/amethyst/gold visual identity; a portal with accelerating swirls, light trails and bright champion emergence.
- Prominent gold READY ribbons, available charge levels, glowing mana bars, a readiness count and a tap prompt.
- A centered battle scene without text sidebars: seven visible attack lanes, straight-column rune projectiles, target previews, and elemental damage/healing/protection animations.
- Illustrated Adventure and Campaign pages, image-led destination cards, and new world-map artwork.
- Compact character cards with speed names, rarity/role symbols and icon-based stats; tile costs stay inside detailed ability explanations.
- A 7-column × 5-row rune board, valid swaps, gravity, cascades, automatic dead-board recovery, and chained special runes.
- Five-champion teams, **150 champions** including all **135 original champion IDs** preserved, with locally bundled optimized portraits, lore, stats, one merged Special each, and existing passives.
- Five elements, column-based attacks, color stacking, empty-lane mana, tile-based mana and multi-level charging Specials, status effects, and enemy attack countdowns.
- Four-match Blast Runes and five-or-more-match Prismatic Runes.
- A second authored chapter at stages 6–10, including an escort-triggered Last Light guardian and clear counterplay.
- Inspectable enemy kits/current charge and on-demand comparisons between Special charge levels.
- An authored five-encounter opening chapter with wards, precharged enemies, fast flanks and a one-time guardian Overpressure phase.
- Numbered Special explanations in actual execution order, accurate targeting, and tactical notes for twenty representative heroes.
- 75 campaign encounters: 25 stages each in Normal, Hard and Nightmare, independent progress, guardian crossings and progressively ruined skins of the same illustrated world.
- Nine local Arena rivals with four champions per team, rating, Arena Tokens and a token exchange.
- Three monthly Special Events with original artwork, scheduled windows, 20 attempts per window and event-token rewards. No event practice option.
- A framed Astral Gate with summon controls below the artwork, clear Gem prices/shortages, and the original Warband Legends portal ritual adapted to Legends for single and ten-champion summons.
- Four original Tavern illustrations reused as Citadel destinations.
- Seven playable dungeons with original Warband Legends art, themed guardians, three difficulty tiers, saved clears, gold/XP and first-clear Gems.
- Battle log, ability details, hint, 1×/2× animation speed, and reduced-motion support.
- Fifteen high-density jewel tile images: elemental shields, four-match dragon crests and five-match prismatic gems; bright full-art champion cards and status badges, damage/healing numbers, and a tappable effect field guide.
- Responsive mouse, touch-drag, and keyboard controls. Use Tab to reach a rune, arrow keys to navigate, and Enter to select each neighbor.
- Team and account progress are saved in this browser. Battles are session-only: leaving, reloading or closing abandons the attempt. Event attempts are spent on entry and are not refunded. Clearing browser data removes account saves.

Collected-only teams and level-1 heroes are the default. Enable open-roster playtesting in Settings to try all champions at maximum level; those battles award no XP, resources, victories or unlocks. Collection cards show actual development; the Codex always previews maximum-level, fully Limit Broken stats. Campaign, Dungeons, local Arena, monthly Special Events and the Supply Exchange are playable. Alliance remains a foundation page. Arena opponents are preset teams, not online players. There are no online accounts, working real-money purchases, competitive play, or shared online progress. The Premium shop section is a disabled layout preview. It uses portrait-based animations rather than 3D models. Original A2/A3 kits are merged into one Special. Colors are individually assigned (27 of each), numeric SPD is removed, and stats use the new rarity baselines; see [rules](RULES.md) [the full roster](ROSTER.md), and [the effect review](STATUS-REVIEW.md).

## Hosting and updates

The current phone version is hosted on [ChatGPT Sites](https://legends-runes-boris.givingjoy7.chatgpt.site). GitHub and Sites have separate source repositories. Keep game changes in this repository and publish the matching update to the existing Site. A GitHub push alone does not update that Site. Browser-local saves belong to the browser and site address.

### Optional Vercel hosting

Create a **new Vercel project** importing `bpac888/Legends`. Leave the existing Warband Legends Vercel project connected to its existing repository.

| Setting | Value |
| --- | --- |
| Framework | Other |
| Root directory | Repository root (`.`) |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | Default (no dependencies) |
| Environment variables | None |

The included `vercel.json` supplies the build/output settings. This game is static: it does not consume Render bandwidth or need MongoDB. Hosting plan limits still apply.

## Project layout

`npm run roster:build` regenerates the active roster, effects, balance report and roster guide from the archived import and `data/roster-design.json`. The shared `src/effects.js` catalog and `data/status-design.json` define the current effect language and selected champion overrides. `npm run art:build` verifies the fifteen curated tile assets. These are image-generated WebP sprites embedded in self-contained SVG wrappers; this command preserves the new artwork instead of regenerating the old vector placeholders. Original import/design data stays outside the runtime build.

`src/shell.js` and `src/shell.css` provide the game shell; `src/identity.css` defines the teal/gold identity and full-art cards, and `src/collection.js` shares roster filtering/sorting with team selection. `src/development.js` defines hero growth, XP and ascension level caps; `src/development-ui.js` and `src/development.css` present development. `src/hero-copies.js` handles unique hero-copy identity and migration, `src/feeding.js` handles Common-hero training, `src/guide-ui.js` groups outside-battle explanations, and `src/progression.js` handles local collection/rewards, and `src/save-files.js` validates portable backups. `src/card-ui.js` supplies shared accessible card symbols, `src/battle-fx.js` renders resolved combat events without modifying state, and `src/experience.css` styles the illustrated experience. `src/engine.js` is pure deterministic combat, `src/storage.js` handles independent saves (new progression namespaces ignore the discarded pre-v0.7 test journey), and `src/app.js` renders the interface. Imported data lives in `data/`; all runtime artwork is in `assets/`. `tools/import_roster.py` is a one-time developer import, not a runtime requirement. It requires Python and ImageMagick if used against an owner's source checkout; existing optimized portraits are retained when source originals are absent.

See the [game blueprint](GAME-BLUEPRINT.md), [rules](RULES.md), [roadmap](ROADMAP.md), [validation](QA.md), and [asset rights and provenance](../RIGHTS.md).

## Updating your local copy

Stop the local server with Control + C, then run `git pull origin main` and `npm start` here. The owner approved a fresh start for v0.15's Gem economy: five collected level-1 heroes, 500 gold and 500 Gems. New profile/battle namespaces ignore prior test progress without deleting old browser keys. Current v0.15 saves migrate to separately tracked hero copies; progress is retained. Export/import remains available. [Gem economy and quests](GEMS-QUESTS.md) explain the rules. Original Warband Legends remains unchanged.
