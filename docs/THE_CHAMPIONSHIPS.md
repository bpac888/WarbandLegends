# The Championships

A separate asynchronous player-versus-player tournament: attack another player's published five-champion defense while that player is offline. The new painted citadel page has Battle, Warbands, Rankings and Rewards sections. Its navigation button sits by the wallet above the normal icon row on phones. The original Arena remains available.

## Available before account setup

Open `#/championships`, use **Explore The Championships** on the title screen, or use the Championships navigation button. Anyone can explore the page, save separate practice teams on this device, search the loan roster, and fight three explicitly labeled training defenses. Practice loans are level 40 (or the champion’s level cap), carry no upgrades, and never earn points, weekly placement, currency or rewards. The leaderboard stays empty rather than showing invented players.

Campaign progress and teams are unchanged. Ranked attack and defense teams are also independent of each other and of the campaign team.

## Ranked rules

| Tier | Points required |
| --- | ---: |
| Bronze | 0 |
| Silver | 120 |
| Gold | 300 |
| Platinum | 600 |

Attack wins earn 30 points, reset defense-loss strikes and can promote the player. Attack defeats cost 10 points. Defense wins earn no points and never promote. Defense defeats cost 10 points and add one strike. A player can drop **one** tier only when they have at least three defense-loss strikes and their score is below the current tier's threshold; demotion resets those strikes. The counter measures losses since the last active win or demotion, rather than requiring consecutive losses. One passive loss can never cause demotion.

Each player can begin 20 attacks per Pacific calendar day, with a maximum of three against any one defense. Only one attack may be open at a time. Battles expire after 30 minutes or at the weekly cutoff, whichever comes first; 150 board moves is the combat limit. Abandoning or expiring an attack costs the attacker a defeat. An expired, unfinished battle does not penalize the defender. A completed surrender counts as a defense hold.

Both sides use saved champion stats, Specials, passives, ascensions, Limit Breaks and faction bonuses. The defender uses the existing automated enemy battle rules. Publishing defense freezes its current upgrades; editing attack alone does not refresh the defense snapshot. Attack teams are checked against current ownership at battle start; consumed heroes cannot be used to start new attacks. A published defense remains until republished.

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

1. Complete [player account setup](PLAYER_ACCOUNTS.md), including `supabase/accounts.sql` and Vercel settings.
2. Run `supabase/championships.sql` once in the same project's SQL editor.
3. Add **`SUPABASE_SERVICE_ROLE_KEY`** to Vercel's **server-only** environment variables. Use the project's legacy service-role key. Never put it in source control, browser code or any `VITE_`/`NEXT_PUBLIC_` variable. The public/anon account key is not sufficient for verified tournament writes.
4. Redeploy. Ranked mode automatically connects for signed-in players; guests can still use practice. Register at least two accounts, save each defense and challenge the other.

The server authenticates the account through the existing HttpOnly session, loads champion data and the cloud profile itself, and generates a seeded initial battle. It saves that state and the opponent's frozen defense. The client submits only its action replay. The server replays legal swaps, activations and Specials before accepting a victory; it never trusts a submitted victory flag, arbitrary stats or a submitted score. Match ownership, expiry, one-time settlement, season changes, rewards and revisions are enforced in the database. Tournament tables/functions cannot be read or called directly with the public key or a player's JWT. Only the server's service-role credential can access them.

This is a baseline asynchronous competition system, not a complete competitive anti-cheat system. As with the existing account work, ordinary single-player progress is still submitted by the client; owners should add progression verification and stronger abuse controls before offering valuable real-world prizes. Supabase credentials, live email delivery and a production database are not provisioned by this feature.

## Development and verification

`npm run check` runs unit checks and the production build. `npm run test:championships` checks the page, team editor, practice battle, navigation, responsive layouts and absence of client errors in Chromium. The database integration test (`npm run test:championships:database`) requires the development-only tool `@electric-sql/pglite@0.3.14` (installed by CI) and uses a temporary local Postgres-compatible engine to exercise season finalization, access restrictions, reward delivery and repeat settlement.

Artwork: original generated citadel concept art in `assets/championships/citadel.webp`; the tier crests are original SVG interface artwork.
