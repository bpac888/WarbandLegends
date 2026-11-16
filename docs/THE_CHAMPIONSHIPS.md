# The Championships

A separate asynchronous player-versus-player tournament: attack another player's published five-champion defense while that player is offline. The new painted citadel page has Battle, Warbands, Rankings and Rewards sections. A compact PvP button sits in the navigation row. The original Arena remains available.

## Access

Enter the game with a player account and use the Championships navigation button. The Championships has no practice preview or title-screen shortcut. It lists real published defenses and rankings. If the backend is unavailable, the page shows an unavailable message and a Retry button.

Attack and defense warbands are independent of each other and of the campaign team. Only champions owned by the signed-in account can be selected.

## Ranked rules

| Tier | Points required |
| --- | ---: |
| Bronze | 0 |
| Silver | 120 |
| Gold | 300 |
| Platinum | 600 |

Attack wins earn 30 points and can promote the player. Attack defeats cost 10 points. Defense wins earn no points. Defense defeats cost 1 point. Losses move a player down when their points fall below their tier’s threshold. There are no protection counters.

Each player can begin 20 attacks per Pacific calendar day, with a maximum of three against any one defense. Only one attack may be open at a time. Battles expire after 30 minutes or at the weekly cutoff, whichever comes first; 150 board moves is the combat limit. Abandoning or expiring an attack costs the attacker a defeat. An expired, unfinished battle does not penalize the defender. A completed surrender counts as a defense hold.

Both sides use their current champion levels, Specials, passives, ascensions, Limit Breaks and faction bonuses. Upgrades apply automatically to saved teams. At battle start, the server loads both players’ latest cloud profiles and checks ownership. A battle keeps the stats it started with so its replay remains verifiable. Players save their lineup again only when changing its members.

## Weekly standings and rewards

Weeks end Monday at 12:00 AM in `America/Los_Angeles`, including daylight-saving changes. Rankings require at least one attack victory. Placement orders by points, attack wins, earlier last attack victory, then player ID. Previous-week snapshots stay frozen and the most recent final top 50 is visible in Rankings. Points, tiers and weekly records start over; saved teams and unclaimed rewards remain.

The requested ranges omitted fourth place and overlapped at 25. The implemented, non-overlapping reward bands are:

| Weekly place | Gems | Gold | Loot Tickets |
| --- | ---: | ---: | ---: |
| 1 | 1,000 | 10,000 | 25 |
| 2 | 750 | 7,500 | 20 |
| 3 | 500 | 5,000 | 15 |
| 4–25 | 250 | 2,500 | 10 |
| 26–50 | 100 | 1,000 | 5 |

Finalization allocates each reward automatically. Players collect it from Rewards; collection writes directly to their cloud save and increments its revision in the same transaction. Repeated collection never pays twice. Rewards stay available if resource storage is full.

A transaction lock serializes tournament writes and finalization. Every database entry point checks the current server week. Expired unfinished attacks are charged before the final snapshot; later battle submissions cannot alter a closed week. The snapshot is materialized on the first request after the cutoff (or by an optional scheduled `select public.championship_maintain();`). This preserves the exact cutoff standings even when nobody is online at midnight. No always-running task is required for correctness.

## Connect when Supabase is ready

1. Follow [GitHub Pages + Supabase setup](SUPABASE_GITHUB_PAGES.md). Vercel is not required.
2. The account and Championships SQL scripts must have succeeded once in the same project. Do not rerun completed scripts.
3. Existing projects also apply `supabase/migrations/202611160001_simple_championship_points.sql` when publishing this update. It replaces the old protection rules without deleting progress or historical rewards.
4. Deploy the bundled `warband` Edge Function. Supabase supplies its server credentials; no secret/service-role key belongs in browser code.
5. Publish the prepared game code to GitHub Pages. Ranked mode connects for signed-in players; accounts are required. Register at least two accounts, save each defense and challenge the other.

The server authenticates the account through the existing HttpOnly session, loads champion data and the cloud profile itself, and generates a seeded initial battle. It saves both sides’ starting battle state. The client submits only its action replay. The server replays legal swaps, activations and Specials before accepting a victory; it never trusts a submitted victory flag, arbitrary stats or a submitted score. Match ownership, expiry, one-time settlement, season changes, rewards and revisions are enforced in the database. Tournament tables/functions cannot be read or called directly with the public key or a player's JWT. Only the server's service-role credential can access them.

This is a baseline asynchronous competition system, not a complete competitive anti-cheat system. As with the existing account work, ordinary single-player progress is still submitted by the client; owners should add progression verification and stronger abuse controls before offering valuable real-world prizes. Supabase credentials, live email delivery and a production database are not provisioned by this feature.

## Development and verification

`npm run check` runs unit checks and the production build. `npm run test:championships` checks login requirements, the page, owned-only team editor, ranked battles, backend failure/retry and responsive layouts and absence of client errors in Chromium. The database integration test (`npm run test:championships:database`) requires the development-only tool `@electric-sql/pglite@0.3.14` (installed by CI) and uses a temporary local Postgres-compatible engine to exercise season finalization, access restrictions, reward delivery and repeat settlement.

Artwork: original generated citadel concept art in `assets/championships/citadel.webp`; the tier crests are original SVG interface artwork.
