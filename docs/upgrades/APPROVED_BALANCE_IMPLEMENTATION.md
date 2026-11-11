# Approved balance batch — implemented locally

The owner approved the twelve proposals on 2026-11-11. All twelve are now implemented. The original [proposal](PHASE_1_BALANCE_PROPOSAL.md) and JSON retain the before-change record; this document records implementation status.

- No base stats, rarity, element, faction, identity, passive or artwork changed.
- Orrix moves from Slow 12 to Average 10. The other eleven retain their existing charge costs.
- Nayara, Beatrice, Eudoma, Ophira and Phozia gain the approved support improvements.
- Ossir, Bronze Juggernaut, Kelydras and Orrix gain the approved protection/access improvements.
- Nix, Kozhak and Qingluo gain the approved charge/damage improvements.
- Source descriptions and canonical design overrides match the new live kits. Legacy source `kit` hints remain historical metadata; explicit design tiers are authoritative.
- The source generator preserves existing live records. A repeat roster build produces identical roster/source/design hashes.

## Verification

- 58 test files pass, including focused tests of every changed charge tier, targets, effects, mana spending, unchanged board turns, legal Auto continuation and existing-save progression.
- 48 real Auto battles (24 paired before/after matches; twelve champions × two fixed seeds). All completed legally and all won Ashen Gate. This is an entry-stage smoke check, not evidence that the proposed changes improve PvP win rate or all difficulty levels.
- 885 controlled Special casts regenerated for the full roster audit.
- Production build passes; the retired, unused `crest.svg` check was removed while preserving the owner's replacement logo files.
- Historical expected hashes remain unchanged. The new strict before/after adapter reverses only these documented edits for historical comparisons and rejects any unexpected edit to an approved character.

Detailed machine records: `src/upgrade-balance-revision.js`, `data/upgrade-battle-smoke.json`, `data/character-balance-review.json`.

The remaining gameplay and trailer batches are implemented in release 0.40.0; see RELEASE_040.md. Strong-support nerfs and faction changes were not approved in this batch and have not been applied. The combined release is pushed only after final validation.
