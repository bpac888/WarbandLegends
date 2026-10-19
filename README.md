# Legends · Runes of War

A new, independent match-3 RPG using the owner's Warband Legends champions and artwork. This repository does **not** modify, launch, or connect to Warband Legends. Step 1 is a playable, browser-based PvE combat prototype.

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

- A 7-column × 5-row rune board, valid swaps, gravity, cascades, automatic dead-board recovery, and chained special runes.
- Five-champion teams, all **135 original champion IDs** preserved, with locally bundled optimized portraits, lore, stats, one merged Special each, and existing passives.
- Five elements, column-based attacks, color stacking, empty-lane mana, tile-based mana and multi-level charging Specials, status effects, and enemy attack countdowns.
- Four-match Blast Runes and five-or-more-match Prismatic Runes.
- Three progressively unlocked PvE encounters, battle log, ability details, hint, 1×/2× animation speed, and reduced-motion support.
- Responsive mouse, touch-drag, and keyboard controls. Use Tab to reach a rune, arrow keys to navigate, and Enter to select each neighbor.
- Separate team, encounter and progress saves on this browser. Reloading resumes the resolved action without replaying it. Clearing browser data removes these saves.

This first build deliberately unlocks the whole roster for experimentation. It has no accounts, summons, monetization, hero feeding, PvP, alliances, or shared online progress. It uses portrait-based animations rather than 3D models. Original A2/A3 kits are merged into one Special. Colors are individually assigned (27 of each), numeric SPD is removed, and stats use the new rarity baselines; see [rules](docs/RULES.md) and [the full roster](docs/ROSTER.md).

## Publish separately on Vercel

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

`npm run roster:build` regenerates the active roster, effects, balance report and roster guide from the archived import and `data/roster-design.json`. Original import data stays outside the runtime build.

`src/engine.js` is pure deterministic combat, `src/storage.js` handles independent saves and v1 battle migration, and `src/app.js` renders the interface. Imported data lives in `data/`; all runtime artwork is in `assets/`. `tools/import_roster.py` is a one-time developer import, not a runtime requirement. It requires Python and ImageMagick if used against an owner's source checkout; existing optimized portraits are retained when source originals are absent.

See [rules](docs/RULES.md), [roadmap](docs/ROADMAP.md), [validation](docs/QA.md), and [asset rights and provenance](RIGHTS.md).

## Updating your local copy

Stop the local server with Control + C, then run `git pull origin main` and `npm start` in this repository. Your team and cleared encounters are retained. An active pre-v0.2 encounter restarts under the new combat rules.
