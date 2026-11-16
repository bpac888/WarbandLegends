# Player accounts

**Current deployment: GitHub Pages + Supabase Edge Functions. Follow [this setup guide](SUPABASE_GITHUB_PAGES.md); Vercel is not required.** The cookie-based Node/Vercel adapter described below remains available as an alternative.

Accounts use Supabase email/password authentication and Postgres cloud saves, accessed through a same-origin `/api/account` function on Vercel. This requires a server; GitHub Pages alone cannot run accounts. The game starts fresh for every new account and does not import old browser saves.

## Activate on Vercel

1. Create a Supabase project at https://supabase.com/dashboard. Keep the database password private.
2. In the SQL editor, run `supabase/accounts.sql` once. This creates one save per authenticated user, row-level read protection and an atomic save function. Only the signed-in user can access their save.
3. Under Authentication → Providers → Email, enable email/password signups. Set the minimum password length to **8** (the game accepts 8–128 characters). Supabase enforces one identity per email address; the game trims and lowercases emails.
4. Choose email confirmation behavior. With **Confirm email disabled**, registration signs the player in immediately. With confirmation enabled, the game asks the player to check their inbox and return to Login. Set Authentication → URL Configuration → Site URL to your deployed game URL and configure your email delivery provider before inviting players. Supabase can deliberately return a generic confirmation response for existing emails to prevent account enumeration; it still never creates duplicate accounts.
5. In the Vercel project connected to this repository, set `SUPABASE_URL` to the Supabase project URL and `SUPABASE_ANON_KEY` to its publishable or legacy anon key. Do **not** use the service-role/secret key. Add these for each deployment environment you intend to use. They belong in Vercel environment settings, not GitHub source files.
6. Redeploy. Existing `vercel.json` builds `dist/`; Vercel also deploys `api/account.js` as a Node function. Use HTTPS in production.
7. Register two test accounts. Change progress, log out via Guide → Tools, sign in again, and confirm each account gets its own progress. Test the same account on another device and test Remember me with a browser restart.

No live Supabase project is bundled or provisioned by this change. Until settings and the SQL schema are supplied, the dialog reports that accounts are unavailable and does not let players start unsaved games.

## Local development

Requires Node.js 22+. Copy `.env.example` to `.env`, fill the two values, and run:

```sh
node --env-file=.env tools/serve.mjs
```

`npm start` also works when these variables are already exported. It serves the same account API locally; the static build alone does not include the backend. Never deploy the development server as production hosting.

## Behavior and persistence

- Enter the Courtyard first checks the existing session. Signed-in players enter directly; others choose Register or Login, then email, password, Remember me and Enter.
- Remember me keeps the HttpOnly session cookie for 30 days. Without it, the cookie is a browser-session cookie. Browser session-restore features can retain session cookies; logging out explicitly clears it. Supabase session expiry/revocation settings also apply.
- Passwords are sent only for authentication over HTTPS and are hashed/stored by Supabase. The game stores neither passwords nor session tokens in localStorage. Tokens live in an HttpOnly, SameSite=Lax cookie (Secure in production). POSTs verify same-origin requests. Supabase provides auth request limits; configure CAPTCHA and tighter provider limits before a large public launch if needed.
- Progress is saved after changes, with a short debounce, and retried while online. A local per-account pending copy survives interrupted requests. Closing a page before upload can delay the cloud copy until this device reconnects; other devices only see uploaded progress. Active battles remain session-only as before.
- Concurrent saves use revisions. A stale device/tab cannot silently replace a newer cloud save. Reload and choose **Load latest cloud save** to discard that device’s pending changes and continue from the cloud. The pending copy is otherwise retained. Account changes in another tab block uploads rather than mixing progress.
- Log out waits for pending progress to upload. If saving fails, it leaves the player signed in and shows the error so progress is not silently abandoned. Logout revokes this session and clears its cookie; other devices stay signed in.
- Restart Journey resets the signed-in account’s cloud progress too.

Password recovery is not included in this change. Supabase dashboard account management is available to the owner; a player-facing recovery flow can be added separately.

## Verification

`npm run check` runs unit tests and the build. `npm run test:accounts` tests the courtyard dialog, account isolation, returning sessions, logout and responsive layout using a deterministic account API fixture. Unit API tests cover cookie security, rejected cross-origin writes, login validation, refresh and account ownership. Live email delivery and database policy behavior must also be checked against the configured Supabase project before publishing.
