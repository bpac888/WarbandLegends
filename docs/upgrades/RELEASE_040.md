# Gameplay and trailer release 0.40.0

Later fixes: [0.40.1](PATCH_0401.md), [0.40.2](PATCH_0402.md), and [0.40.3](PATCH_0403.md). The latest patch restores the original trailer ending and adds conversational dialogue bubbles.

## What is implemented

### Approved roster balance

All twelve approved kit changes are applied. Base stats, rarity, faction, element, passives, artwork and the owner's current logo remain unchanged. Orrix alone changes speed (Slow 12 → Average 10). Full before/after snapshots and historical fingerprints are checked; see [approved balance batch](APPROVED_BALANCE_IMPLEMENTATION.md).

### Teams, favorites and feeding locks

All **four** existing team slots remain. Rename them in Collection → Teams. Champion detail pages offer Favorite and Lock from feeding. Locks protect the individual owned copy, including duplicates; saved teams remain protected independently. Favorites First is available in Collection/Codex and team-picker sorting. Estimates based on developed ATK + DEF + HP/4 appear in team slots, the picker and pre-battle previews alongside faction bonuses. Estimates are explicitly approximate and do not price every ability.

Old saves receive default names and empty preferences. Naming does not advance the tutorial's team-change quest. The current Collection/Codex palettes and artwork sizes are preserved.

### Three new enemy mechanics

Campaign stages 11–13 introduce these mechanics, and Weekly Encounters reuse them:

- Gathering Storm: an announced move-3 phase grants the living captain Attack Up for 2 moves and schedules its next attack in 1 move. Defeat it early, Dispel the buff or prepare protection. It cannot trigger again.
- Sworn Protector: the left escort starts with 4-move Taunt and Defense Up. Single-target Specials redirect; rune columns and area attacks retain their existing behavior. The visible notice updates when Taunt ends or the escort falls.
- Call of the Fallen: from move 3, a living summoner replaces one defeated escort at 65% HP once. This happens after the action/cascade resolves and never after the summoner dies. Existing lanes and enemy identities remain valid.

Existing first-ten-stage mechanics remain intact. Visible battle notices supplement the tactics popup.

### Two weekly challenges

Adventure → Weekly Challenges contains two concurrent, independent challenges:

- Trial: four rotating restrictions (Common/Rare only, two elements, no Mythicals, three elements).
- Encounter: four rotating lineups using telegraph, protector or reinforcement mechanics.

Both rotate Monday at midnight **America/Los_Angeles**, including daylight saving changes. The page shows reset time and refreshes at the boundary. Entry costs no Energy; retries are unlimited. Trial gift: 100 Gems + 500 Gold. Encounter gift: 150 Gems + 750 Gold. Gifts are claimed separately, once per week and challenge. Battle replays give no additional Gold, Gems or XP. Unclaimed completed older gifts remain available. A battle started before reset keeps its week/rules when it finishes. Entry and victory validation reject mismatched challenge keys or roster restrictions.

This remains a browser-save game. It does not claim server-authoritative clock or cheat protection.

### Owner-trailer cinematics

Five silent mobile HD H.264 MP4 cuts (720×1280, 24 fps; approximately 4.05 MB total, each below 2 MB) are loaded only when needed:

- Once-per-session skippable splash introduction. The old baked-in branding is blurred behind the current live logo and wordmark.
- Short detail-page animations for Iseldra, Bronze Juggernaut, Vex and Qingluo; static portraits remain the fallback.
- A matching Legendary/Mythical summon can play a short reveal. Show Results/Skip bypasses it; charges and awards occur once before playback.
- Qingluo's Jade Tempest has a skippable green-dragon Special prototype, shortened at ×2 speed. Combat outcomes are committed independently of playback.
- The first chapter's Bronze Juggernaut dialogue reuses its matching clip.

Guide → Tools → Character cinematics disables these sequences. System Reduced Motion prevents automatic playback and video downloads. Failed playback, absent files, backgrounding and navigation release the video and return to static UI. Detail grids remain static; the original two full trailer uploads are not bundled. No new art was generated.

`data/cinematic-manifest.json` records source hashes, exact cuts, identities, dimensions and output sizes. Rebuild cuts with `tools/prepare-cinematics.py` and the two original trailer files.

### Campaign story pilot

The Chapter Journal in Adventure provides replayable dialogue. The first three chapters now have brief skippable pre-guardian scenes; the first chapter is the featured video pilot. Completion screens include artwork and a short conclusion. A chapter gift (150 Gold + 25 Gems) can be claimed once per chapter per difficulty, either on the results screen or later in the journal. Replaying dialogue grants nothing and does not alter campaign victory progress. Existing clears qualify for unclaimed chapter gifts.

## Validation

- Full unit suite and production build, including all historical roster and artwork checks.
- New unit coverage for save normalization, individual locks, weekly DST boundaries, restrictions, once-only claims, prior-week settlement, all three mechanics and chapter gifts.
- 48 paired before/after Auto battle smoke matches for the balance batch; 885 controlled casts for the full roster review.
- Phone (320/390px) and desktop (1440px) browser layouts, persisted team controls, real Auto weekly victory, real campaign boss victory and dialogue/gift flow.
- Real seeded Legendary summon with video reveal; ritual Skip bypass, all four character clips, missing-media fallback and Reduced Motion preventing downloads.
- Actual Qingluo Auto battle tests the Special cinematic and Skip/resume behavior.

Commands: `npm run check`, `npm run test:upgrades`, `npm run test:cinematics`, `npm run test:jade-special` (set `CHROMIUM_PATH` when needed). Build checks enforce mobile clip size budgets.

## Scope and limits

The roster balance batch is targeted, not an exhaustive PvP win-rate guarantee. The initial weekly rotation set and story chapters are intentionally bounded, with reusable definitions for later expansion. No courtyard redesign, portrait replacement, summon-odds change, Premium purchase activation or deployment workflow changes are included.
