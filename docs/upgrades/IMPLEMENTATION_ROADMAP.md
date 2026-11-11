# Gameplay and trailer implementation roadmap

Started 2026-11-11. Current phase: all planned batches implemented; final validation and release. See RELEASE_040.md for implemented behavior and limits. This document tracks the approved direction without claiming later features are implemented.

## Baseline and preservation

- Synced main through `b70a629` (updated logo, favicon and touch icon). Preserve those files exactly.
- 265 champions, 295 Special tiers, 16 named factions and one unaffiliated champion.
- Existing chapter definitions in `src/chapter.js`, encounter phase processing in `src/engine.js`, four saved teams and profile normalization already exist. Extend those systems rather than creating parallel implementations.
- Preserve current artwork, courtyard, existing phone palette, summon odds and character identities.
- Phase-one deliverables: [balance proposal](PHASE_1_BALANCE_PROPOSAL.md), `data/upgrade-balance-proposal.json`, and the full existing controlled-cast review.

## Batch 1 — balance review (approved)

Recomputed 885 controlled casts. The owner approved all twelve specific kit improvements. They are now applied; the proposal is retained as the before-change review record. Watch strong supports and faction combinations in actual battles before any nerfs. Keep Attack the largest role. Preserve the owner's specific requirements for Magic stacking, The King's highest Attack and Yshmir's speed/passive.

## Batch 2 — team management

Add a name for each of the four existing team slots, with short default names and a 24-character limit. Store favorites and locks per owned copy ID, including suffixed duplicates. Favorites aid sorting; locks prevent feeding. Saved-team protections continue to apply even if a champion is not locked. Favoriting is not locking.

Normalize absent fields in old saves; discard references to missing copies. Preserve team assignments, active slot, XP and inventory. Rename, save, load and clear operations must update the same slot consistently. Show active faction bonuses and approximate team power on pre-battle selection. Explain that team power is an estimate and does not price every utility effect. Keep editing usable on 320px phones.

Acceptance: reload persistence, old-save defaults, protected-copy feeding rejection, favorite sorting, empty slots and all five team sizes without overflow. Do not let a cosmetic rename mark the tutorial team-change quest complete.

## Batch 3 — apply reviewed balance changes (implemented ahead of team management after approval)

Implement accepted rows from the proposal, update the canonical roster generation inputs as well as generated data, and explicitly revise preservation fingerprints for approved existing-character edits. Verify future roster builds reproduce the accepted changes. Record before/after changes. Test identical-seed encounters, every charge tier, Auto legality, faction stacking and development levels. Do not bypass existing original-record integrity tests to make changes pass.

## Batch 4 — enemy mechanics

Extend existing authored encounter and phase systems. Begin with one example of each:

1. Telegraph: show a named move and countdown before a stronger attack. Define interruption precisely (defeat or an explicitly supported interrupt); Mana Block alone does not imply interrupting ordinary attacks.
2. Protector: show who protects whom and how to remove the protection. Reuse existing Taunt or defensive effects where possible; introduce new redirection rules only when necessary.
3. Summoner: one scheduled reinforcement wave, bounded by board/lane capacity. Define defeated-slot replacement, target validity and victory timing explicitly. No invisible mid-action enemy respawns.

Trigger phases only after an action/cascade resolves. Test lethal hits, simultaneous kills, Dispels, dead protectors, Auto, battle restore and victory rewards. Use readable warnings and restrained visual effects.

## Batch 5 — two concurrent weekly challenges

Both challenges have independent completion and claim state, rules, rewards and countdowns.

- Weekly Trial: roster restriction; validate that every rotation has enough eligible champions across elements. Include accessible restrictions, not only large-faction collections.
- Weekly Encounter: special lineup or boss mechanic with a different strategic focus from the Trial.

Use a shared deterministic schedule with a named timezone (proposed: Monday midnight America/Los_Angeles). Show the exact reset time and handle daylight saving transitions. Store week identifiers, best results and claimed rewards separately per challenge. Freeze the selected rule set for a battle already in progress at reset. Reward claims must be idempotent and replay-safe. A browser-only save cannot make device-clock manipulation tamper-proof; do not promise server enforcement.

Proposed first rotations: Rare-only Trial paired with a telegraphed boss; then an accessible element restriction paired with a protector encounter. Entry energy, attempts, difficulty tiers and reward amounts remain design decisions after balance testing. No monetization requirement. No loot-ticket bypass for learning these new mechanics.

## Batch 6 — trailer integration pilot

Two supplied portrait videos are available: approximately 14.745s and 15.270s, both 1080×1920. Source copies are attachments, not production assets. Keep full uploads outside the game bundle.

Prepare exact cuts after checking motion frame by frame and matching the current roster portraits:

| Pilot | Source window (approximate) | Behavior |
| --- | --- | --- |
| Splash logo reveal | Second upload, final 2 seconds | Play once, skippable, settle into normal splash. Preserve the owner's current logo: do not let an older baked-in video logo replace it. Composite the current logo if necessary. |
| Ice character detail | First upload, 10–12s | Short entrance animation, then still image; confirm exact character identity first. |
| Alchemical armored character detail | Second upload, 2–4s | Short reveal; confirm appearance and identity. |
| Hooded mage detail/reveal | Second upload, 12–13s | Use only after confirming the character match. |
| Green dragon Special prototype | Second upload, 7–10s | Shorten to a readable payoff; no added input or turn cost, no altered combat outcomes. |

Exact cut points are not finalized. Avoid neighboring shots or abrupt cut frames. Do not force action clips into seamless loops. Use real character IDs only after matching art; a similar appearance is insufficient.

Encode small H.264 MP4 clips with fast-start metadata and static posters. Use `playsinline`, muted playback and graceful autoplay rejection on iPhone. Lazy-load on demand, pause when hidden, and release inactive videos. Respect Reduced Motion and add a cinematic preference if needed. No simultaneous grid videos. Cache only bounded assets; inspect actual transfer sizes on mobile before deciding resolution. Test with missing video, slow loading, background/foreground changes and portrait/landscape views. Do not autoplay trailer audio over game audio.

The Special prototype must be skip-safe, respect battle speed preferences, and return immediately to the same combat state. Review pacing before adopting it for more characters. Selected summons remain skippable and must never award twice after skipping/reloading.

## Batch 7 — campaign story pilot

Extend The Broken Road and The Hollow Covenant instead of duplicating their existing text/mechanics. Add short skippable dialogue before a major boss and a chapter-completion screen. Completion rewards must be claimed once per explicitly defined difficulty scope. Save story-seen flags separately from stage victory and tutorial progress. Allow replay without granting rewards. Keep ordinary stage entry quick.

Use a matching trailer clip only when it serves the actual story. Start with one chapter, review the writing and phone presentation, then expand. Do not automatically reuse Special footage as unrelated enemy or faction art.

## Release checks

Validate existing saves, feed locks, team names, faction rules, reward idempotency, weekly resets and restored battles. Inspect 320/390px phones and desktop. Measure video downloads and test static fallbacks. Run the relevant existing tests plus focused tests for new state transitions. Push only completed, checked batches with a clear description of what is and is not implemented.

## Implementation status

The roadmap above records the original design decisions. All batches are implemented for 0.40.0; [release notes](RELEASE_040.md) describe final behavior, tested coverage and bounded pilot scope.
