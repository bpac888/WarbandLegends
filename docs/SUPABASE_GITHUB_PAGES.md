# GitHub Pages + Supabase

The game stays at **https://bpac888.github.io/WarbandLegends/**. GitHub Pages serves its artwork and game files; the Supabase `warband` Edge Function runs accounts, cloud saves and verified Championships. Vercel is not needed. Appearance, controls, combat, account choices, tiers and rewards are unchanged.

Public configuration is already set in `src/backend-config.js` for project **ksknmdmnqilgkekfdurz**. Its publishable key is intentionally public. Database permissions and verified user tokens protect private data. Secret/service-role keys must never be added to that file or any other browser source.

## 1. Database — already completed for this project

If starting a different project, run `supabase/accounts.sql` and then `supabase/championships.sql` in Supabase SQL Editor. **Do not run them again if they already succeeded.** For release 0.53.6, also apply the [monthly competition update](MONTHLY_COMPETITIONS.md) to enable Tournaments and Titans.

## 2. Deploy one Supabase function

The repository includes a single-file, generated function containing all its required game rules and roster data. It reads credentials from Supabase's runtime environment; no secret keys are embedded in it.

1. In the Supabase project, open **Edge Functions**.
2. Choose **Deploy a new function → Via Editor** (the label may be **Create a new function**).
3. Set the function name to **`warband`**.
4. Open the [complete function bundle](https://raw.githubusercontent.com/bpac888/WarbandLegends/main/supabase/functions/warband/bundle.js), select all, and copy it into the editor, replacing the example code. Use **bundle.js**, not `index.ts`; the bundle contains everything and needs no extra files.
5. Disable **Verify JWT / Enforce JWT verification** for this function. The function itself validates signed-in players through Supabase Auth. Login, registration and CORS requests must also be allowed before a player has a token. This does not make saves or Championships anonymous.
6. Click **Deploy**. If the JWT setting is under the deployed function's **Details** tab, turn it off there after deploying.

Supabase normally supplies `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions automatically. There is no need to paste them into game code. The default allowed browser origin is `https://bpac888.github.io`. A custom domain requires updating the function's `ALLOWED_ORIGINS` secret to a comma-separated list of exact origins (no paths and no wildcard).

Function address:

```
https://ksknmdmnqilgkekfdurz.supabase.co/functions/v1/warband
```

Opening this health-check address should return `{"service":"warband","ready":true}`:

```
https://ksknmdmnqilgkekfdurz.supabase.co/functions/v1/warband?action=health
```

A 401 from the gateway usually means the function's JWT verification switch is still on. A 404 means the function has not yet been deployed under the name `warband`.

Developers can instead deploy from the repository with the Supabase CLI:

```sh
supabase login
supabase functions deploy warband --project-ref ksknmdmnqilgkekfdurz --no-verify-jwt
```

`supabase/config.toml` points deployment at the bundled file. Supabase account login/access tokens are private; never send them in chat or commit them.

## 3. Email authentication settings

In **Authentication → URL Configuration**, set the Site URL to:

```
https://bpac888.github.io/WarbandLegends/
```

Enable the Email provider, allow signups and use a minimum password length of **8**. With **Confirm email** enabled, players must confirm their email and then choose Login in the game. With confirmation disabled, registration enters the game immediately. Configure email delivery as appropriate before a public launch.

## 4. Publish the prepared game changes

The account, Championships and GitHub Pages transport changes must be included in the branch served by GitHub Pages. Draft pull requests do not update the live game automatically. Merge/publish only after the function health check succeeds, so players are not directed to an unavailable backend.

Keep the existing GitHub Pages repository, path and domain. No Vercel deployment or Vercel environment settings are required.

## 5. Verify accounts and Championships

Register two test accounts, publish a defense for each, make progress, log out through Guide → Tools, and log back in. Check that accounts keep separate saves and can challenge each other. Check the Remember me option with a browser restart. Confirm weekly reward collection using a test season before inviting players to a public ranked event.

## Session behavior on static hosting

GitHub Pages cannot issue server cookies, and third-party cookies are unreliable across hosting domains. Instead, the game uses bearer access tokens verified by the Edge Function, with automatic refresh on expiry. Passwords are never saved.

- **Remember me selected:** tokens stay in localStorage on that device for up to 30 days. Refreshing a token does not extend that 30-day deadline.
- **Remember me unselected:** tokens stay in sessionStorage for the current tab and survive reloads; a new browser session asks for login again. Browsers with tab/session restoration can retain tab storage.
- **Log out:** pending progress is saved, the Supabase session is revoked, and this device's stored tokens are removed.
- Browser storage contains account-specific pending save copies as before. Unavailable cloud saves retry; revisions protect against overwriting newer progress on another device.

The retained Node/Vercel API is an alternative adapter, not part of this deployment. A development test may set `backend: null` on `AccountClient` or supply an empty backend configuration to use that adapter. Production configuration defaults to Supabase.

## Building and testing

The browser/runtime has no new package dependency. Rebuilding the function requires development-only `esbuild@0.28.2`:

```sh
npm install --no-save --package-lock=false esbuild@0.28.2
npm run release:stamp
npm run build:supabase
npm run check
npm run test:supabase
```

Browser tests require Playwright/Chromium as with the existing game suites. `test:supabase` serves the game at its real GitHub Pages subdirectory and exercises the actual cross-origin Edge handler with a deterministic Supabase provider fixture. It does not contact or modify production player data. The function bundle is committed so deployment through the dashboard needs no build tools.

For local development against the deployed function, add the exact local origin, such as `http://localhost:4173`, to `ALLOWED_ORIGINS` alongside the GitHub Pages origin. Do not use a wildcard. Live Supabase deployment is a separate step from local tests.


## Updating an existing project to 0.53.2

The GitHub Pages update publishes the interface automatically. Existing Supabase deployments also need these two updates:

1. Run `supabase/migrations/202611160001_simple_championship_points.sql` in the SQL Editor. Do not rerun the original schema scripts. The migration changes defense defeats to −1 point and removes tier protection; it preserves players, teams and past rewards.
2. Edit the existing `warband` Edge Function, replace its code with the import below and deploy it. Keep gateway JWT verification off; the function validates the player session itself.

```ts
import "https://raw.githubusercontent.com/bpac888/WarbandLegends/main/supabase/functions/warband/bundle.js?v=0.53.2";
```

The updated function loads both teams’ latest saved hero upgrades automatically when a battle starts. Games already in progress retain their starting stats for replay verification.
