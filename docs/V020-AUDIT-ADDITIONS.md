# The Twelve Audit Additions

The twelve recommendations from the 150-champion audit are implemented as new, independent characters. The catalog now contains 162 champions: 67 Legendary, 60 Rare, 15 Mythical and 20 Common. The new group has 8 ATK, 2 DEF and 2 SUP; no existing hero changes are included.

Each new hero has an original high-resolution portrait in the established painterly fantasy style, faction-specific lore, a named Special and a supported mana speed. Lysandre has two charge tiers; Nix has three. The other ten use standard mana gates. All factions now cover all five elements.

The current [roster audit](ROSTER_AUDIT.md) lists the new heroes and current faction, element, rarity, role and speed counts. The prior [150-champion audit](history/ROSTER-AUDIT-150.md) is preserved as history. The build fingerprints every previous character record against the 150-champion baseline.

Rarity-wide average maximum HP, ATK and DEF are unchanged. Summoning odds, the ten-call guarantee, feeding, leveling, saved copies and existing progress are unchanged. The new Rare characters participate in the existing Rare feeding rules.

`tests/audit-additions.test.mjs` checks every charge tier and recipient, supported effects, summoning and save normalization, legal Auto choices, and six completed Auto battles across three new team combinations. `tests/audit-additions-browser.mjs` checks all 162 Codex portraits and the twelve new dossiers at four viewport widths.

Validation completed: all 24 native test files pass. All 162 Codex portraits load, and all twelve new portraits retain 768×1152 resolution without a tint or filter. All 48 new character-page/viewport combinations pass at 320, 390, 760 and 1440 pixels with no missing assets, horizontal overflow or browser errors. Existing energy entry, exit/no-refund, midnight refill, level-up refill and free Special Event entry checks also pass. Roster regeneration preserves all 162 complete records byte-for-byte.
