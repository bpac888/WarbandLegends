# 150-Champion Expansion and Steady Auto Battles

Added 15 original champions: 1 Mythical, 11 Legendary and 3 Rare; 8 ATK, 4 DEF and 3 SUP. Each has a new 768×1152 portrait, lore, stats, Special and supported passive where appropriate. All 135 existing records and portraits remain unchanged. Summon outcome odds and existing rarity stat means are unchanged.

The [roster audit](ROSTER_AUDIT.md) covers rarity, color, faction, type and speed, and proposes 12 future additions. These suggestions are not implemented. Run `npm run roster:audit` to regenerate the report and its machine-readable cross tables.

Auto no longer displays the intermittent action-message strip. Status badges overlay portraits without changing their dimensions. Auto also disables card lunges, portrait squash, stage shake and hit-edge flashes. Rune projectiles, damage numbers, spell effects, ready indicators and Mythical cinematics remain visible. Manual battle impact feedback is retained.

Validation:

- All 23 native test files pass, including exact original-record fingerprints, all new Special tiers, effect recipients, summoning, save compatibility and legal Auto actions.
- Roster regeneration preserves all 150 records byte-for-byte.
- All 150 Codex portraits load; all 15 new portraits retain full resolution with no tint/filter.
- All 15 new dossiers checked at 320, 390, 760 and 1440 pixels with no horizontal overflow.
- Auto portrait positions and dimensions sampled through casts, cleansing, status changes and rune moves at 320×844, 390×844, 844×390 and 1440×1000. No shifting, resizing, action strip or stage shake.
- Existing Auto worker healing, pause/resume, manual takeover, victory rewards and per-battle reset checks pass. Energy spending and daily/level refills also pass.

Roster coverage is not a substitute for measured matchup balance. Future tuning should use battle results; this expansion does not alter existing heroes.
