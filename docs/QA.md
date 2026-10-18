# Step 1 validation

Validated with Node.js 24 and Chromium on 2026-10-18.

## Automated checks

`npm run check` runs 26 combat/data/save tests and builds the production site. These cover seeded boards, legal moves, elemental rules, invalid swaps, intersecting matches, gravity/cascades, Blast/Prism creation and chains, missing colors, same-color stacks, empty lanes, enemy countdowns, dead enemies, signature targeting and mana, healing/cleanse/buffs, immunities, status expiry, revival, win/loss, kit descriptions, deterministic save recovery and malformed saves. Thirty seeded encounters simulate through completion. Initial boards are checked across 100 seeds.

All 135 original IDs were compared with the source definitions; a fixed source-ID digest guards against accidental renaming. Every champion's local portrait exists and the production build verifies its size and path. The source checkout and original remote branch remain unchanged.

## Browser smoke checks

`npm run test:browser` requires Playwright as a development-only tool. To run it on your own machine:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
npm run build
npm run test:browser
```

Optional `PLAYWRIGHT_MODULE` and `CHROMIUM_PATH` environment variables select an existing installation. They are only for local QA and are not hosting configuration.

The browser test loads the built files through an intercepted test origin and verifies home rendering, 135-champion roster/search, encounter start/help, 35 runes, five heroes, three enemies, keyboard swaps and restored focus, drag swaps, save/reload, animation speed, charged-skill targeting, victory unlocks, and 390px/320px layout without horizontal overflow. It checks for browser errors, missing files, and external requests. Four screenshots are written to ignored `artifacts/` for visual review.

Desktop home/battle and mobile battle screens were visually reviewed. Effects and projectile animation have reduced-motion support. These checks establish the first playable foundation; long-term balance and broader device/user playtesting remain part of the next phase.
