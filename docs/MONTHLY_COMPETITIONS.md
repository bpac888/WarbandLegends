# Monthly Tournaments and Titans — release 0.53.6

## Activate on the existing Supabase project

GitHub Pages serves the game. Supabase runs the competition rules and stores shared scores. Both must be updated for the new modes to work.

1. Open [monthly-competitions.sql](../supabase/monthly-competitions.sql) on GitHub and use **Copy raw file**. In Supabase **SQL Editor**, open a new query, paste the entire contents, and click **Run**. The existing accounts and Championships setup must already be installed. This adds the monthly modes and is safe to rerun.
2. Open **Edge Functions → warband → Code**. Replace the contents of `index.ts` with this single line, then deploy:

   ```ts
   import "https://raw.githubusercontent.com/bpac888/WarbandLegends/main/supabase/functions/warband/bundle.js?v=0.53.6";
   ```

3. Keep the function's **Verify JWT** gateway setting off; the function itself verifies the signed-in player. Existing project credentials and account settings stay in place.
4. Refresh the game. The Tournaments tab should show February's Only Rares event. Titans should show December's upcoming hunt, or the current hunt if its randomly chosen dates have arrived.

No scheduler or manual switch is required on opening day. Server time controls access on each request; the page refreshes event state while open. Rewards are finalized on the first request after the cutoff, using scores accepted before it.

The combined SQL file is generated from `tournaments.sql` and `titans.sql` with `npm run build:monthly-sql`. Never put a secret or service-role key in the game.

## Tournaments

The first tournament starts **February 1, 2027 at midnight Pacific**, with registration opening **January 30 at midnight Pacific**. Each following tournament runs for one calendar month; registration opens two Pacific calendar days before it begins. The next registration period can overlap the current event's final days.

Register with a saved team from Teams that meets the month's rule. The last defense registered before the cutoff locks automatically when the tournament begins, including its champion stats. Players can revise it during registration. Later team edits and upgrades do not change that tournament's locked defense.

Attacks use the player's current active team and current stats. The server checks its ownership and eligibility every time. Ineligible teams cannot start a tournament attack. No default defense is registered for the player.

Rules rotate monthly in this order:

1. Only Rares.
2. Only Red.
3. Only Blue.
4. Only Green.
5. Only Purple and Yellow.
6. Every color except Green.
7. No Mythicals and no Blue.
8. No Mythicals and no Red.
9. No Mythicals and no Purple or Yellow.
10. Only Rares and no Yellow.
11. Only Rares and no Blue or Purple.

Scoring uses +30 for an attack win, −10 for an attack loss and −1 for a defense loss. Bronze, Silver, Gold and Platinum use the weekly Championships thresholds. Attacks have a 20-per-Pacific-day limit, at most three against the same opponent per day, and one open attack per player. Battles expire after 30 minutes or at the event cutoff and allow at most 150 board moves.

Monthly rankings and rewards are separate from weekly Championships. Reward amounts match the weekly five bands: 1, 2, 3, 4–25 and 26–50. A new month resets tournament standings; locked historical results and unclaimed rewards remain. Tournament wins do not count toward weekly Championships milestone quests.

## Titans

Titan events begin in **December 2026**. Each month the server chooses one of four Titans and a random start date. It appears for five Pacific calendar days, entirely within that month. Future random dates and the next Titan's identity are hidden from players until the hunt begins.

- **Ember Titan — Red:** Cinder Cataclysm attacks all champions and burns them. Weak to Blue.
- **Worldroot Titan — Green:** Worldroot Crush attacks all champions, poisons them and lowers defense. Weak to Red.
- **Glacier Titan — Blue:** Glacial Ruin attacks all champions, inflicts Frostbite and slows mana. Weak to Green.
- **Ultimate Titan — Yellow and Purple:** Eclipse Annihilation pierces defense, dispels buffs and blocks mana. Its attacks and incoming hits have neutral elemental affinity: neither Yellow nor Purple gains an advantage against it.

The three elemental Titans have 5,000,000 shared HP; the Ultimate Titan has 10,000,000. All players damage the same killable health pool. The active team is used for every attack. Each player has **six total attacks per event**, including abandoned or expired attempts. There is no daily refill. Each attempt lasts at most 30 board moves, until the team falls or the Titan is defeated, and expires after 30 minutes or at the event cutoff. Retreat records damage from the verified actions already taken.

Damage comes from replaying legal battle actions on the server. The client cannot submit an arbitrary damage amount. Percentage-of-health damage uses a 50,000 HP base to keep it proportional to a raid boss. A repeated result does not add damage twice. Global HP stays at zero when defeated; no new attacks can start. Already-open attacks may finish before their expiry, and their verified contributions count toward rankings. Final rewards wait for these attacks to settle or expire.

Rewards are based on cumulative verified damage, even if the Titan survives the event:

| Place | Gems | Gold | Loot Tickets |
| --- | ---: | ---: | ---: |
| 1 | 1,000 | 10,000 | 25 |
| 2 | 750 | 7,500 | 20 |
| 3 | 500 | 5,000 | 15 |
| 4–50 | 250 | 2,500 | 10 |

Only positive damage ranks. Ties use the earlier final damage contribution, then player ID. Final rankings are immutable and each award can be collected once. Titan damage does not affect weekly or monthly tournament points.

## Verification

`npm test` includes calendar, eligibility, combat, replay, milestones and service checks. `npm run test:championships`, `npm run test:tournaments` and `npm run test:titans` exercise authenticated browser flows, real combat replays, team selection, rewards and phone layouts. Their `:database` counterparts exercise transactions, cutoff times, repeat settlement, one-time awards and restricted database access using development-only PGlite. Supabase tests use a local mock; these checks do not deploy or inspect the live Supabase project.

Local release checks: 520 unit tests, production build, all three competition browser flows, all three competition database suites, Supabase account transport and tutorial refinements pass. The older `test:campaign-atmosphere` still fails its map-height assertion; that same check failed on the previously published commit before this update. This release does not change campaign layout styles.
