# Step 1 validation

Validated with Node.js 24 and Chromium on 2026-10-18 (first foundation and v0.2 roster update).

## Automated checks

`npm run check` runs 38 combat/data/save tests and builds the production site. These cover seeded boards, legal moves, elemental rules, invalid swaps, intersecting matches, gravity/cascades, Blast/Prism creation and chains, missing colors, same-color stacks, empty lanes, enemy countdowns, dead enemies, signature targeting and mana, healing/cleanse/buffs, immunities, status expiry, revival, win/loss, kit descriptions, deterministic save recovery and malformed saves. Thirty seeded encounters simulate through completion. Initial boards are checked across 100 seeds.

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

The browser test loads the built files through an intercepted test origin and verifies home rendering, 135-champion roster/search, encounter start/help, 35 runes, five heroes, three enemies, keyboard swaps and restored focus, drag swaps, save/reload, animation speed, charged-skill targeting, victory unlocks, and 390px/320px layout without horizontal overflow. It checks for browser errors, missing files, and external requests. Six screenshots are written to ignored `artifacts/` for visual review.

Desktop home/battle and mobile battle screens were visually reviewed. Effects and projectile animation have reduced-motion support. These checks establish the first playable foundation; long-term balance and broader device/user playtesting remain part of the next phase.

## Unified-Special and tile-mana update

Additional checks cover exact 6.5/8/10/12/13.5 standard thresholds, 8/10 and 5/10/15 charging gates, fractional gains, early and full casts, charge spending/caps, no numeric SPD, all source A2/A3 effects surviving in full Specials, passives/rarities/IDs unchanged, 27 champions in every color, the reference stat averages and ranges, and each of 135 champions casting every one of their levels. Mana buffs are checked separately from enemy countdowns. Legacy active battles restart while team/progress and the backup are preserved; completed victories remain idempotent.

Browser coverage includes the Charging roster filter, all-level Special previews, returning to a filtered roster, both charging formats, holding charge, disabled locked levels, zero-move casts, 320px charging dialogs and v1 migration feedback. Visual review includes the mobile charge dialog and filtered roster.

A simple policy using the first legal move and spending ready Specials was simulated for 50 seeds per encounter. Results were 50/50 Ashen Gate wins (8.0 moves average), 50/50 Frozen Pass wins (10.6), and 25/50 Veil Sanctum wins (12.4). This is a regression smoke check, not a claim of final balance or optimal play. It used the original saved starter team after color reassignment; new profiles now start with a rainbow team. Wider player testing remains necessary.
