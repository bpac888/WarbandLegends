# Legends improvement plan

Continue only the independent `bpac888/Legends` game. Leave `bpac888/warband-legends` unchanged. The owner authorizes implementing, testing and publishing Legends changes. The old instruction to defer development until the owner returned was satisfied when they asked to begin.

## Completed

- **v0.6:** artwork-led menus, full-art symbolic cards, seven attack lanes and elemental battle effects.
- **v0.7:** visible hero levels/XP, current Collection stats versus maximum Codex stats, gold training, participant XP and repeatable campaign seals. The owner approved discarding the pre-leveling test save; subsequent releases preserve progression. See [progression rules](PROGRESSION.md).
- **v0.8:** 25 stages × Normal/Hard/Nightmare, three progressively ruined map skins, seven dungeons with source-game art and three tiers each. See [adventures](ADVENTURES.md).
- **v0.9:** nine four-champion local Arena rivals, three scheduled monthly events, a token exchange, source-style summoning page/ritual and four reused Tavern illustrations. The owner explicitly removed event practice. **Never restore an event practice button or out-of-window entry.** See [Arena and events](ARENA-EVENTS.md).
- **v0.10:** The Broken Road, an authored opening group of five encounters; a one-time, telegraphed Overpressure guardian phase; Special details generated from the actual ordered combat plan; tactical notes for ten representative heroes across all colors, rarities and roles. Existing saved fights keep their original rules. See [tactics and initial balance probe](TACTICS.md) and [QA](QA.md).

- **v0.11:** The Hollow Covenant, authored stages 6–10 with escort-triggered Last Light; twenty reviewed tactical identities; charge comparisons and current enemy-kit inspection. See [the second chapter](COVENANT.md). No hero numbers changed; existing saves remain intact.

## Next priorities

1. **Playtest the first two chapters.** Review the fast-flank ambush, relay support and both guardian warnings with real play. Reproducible probes and real UI fights are covered in QA, but human feedback is still needed. Stages 1–10 are authored; stages 11–25 retain existing formations and guardian markers. Extend the next group after reviewing pacing. Do not claim every chapter has unique objectives or phases.
2. **Continue the hero-kit review in small groups.** Twenty tactical identities are reviewed; all heroes now have accurate ordered details. Review another representative group, focusing on distinguishable jobs, fast/slow tradeoffs and useful lower-rarity counters. Change numbers or remove merged-kit clutter only with concrete combat evidence. Preserve one Special plus passives and the existing standard/multi-charge concepts.
3. **Prototype overheal as the first advanced combat family.** Before implementation, define cap, health display, healing restrictions, barrier interaction, HP-scaled damage and revival. Introduce it to a limited set of healers, then test actual interactions. No overheal rules or values are finalized yet.
4. **Consider simple minions only after the health layer is stable.** Define timing, attack/protection, limits and removal first. Mega Minions, Fiends, troops, talents, alternate kits, Growth/Wither and extra facilities remain later possibilities.
5. **Review long-term collection pacing.** Earned gold, training, seals and token exchanges work. Duplicates are retained and share development; no feeding or consumption exists. Any consumption feature must protect the last copy and clearly preview costs. Bad-luck protection is a design topic, not an approved numerical system yet.

## Rare heroes and future tournaments

Legendary and Mythical remain generally strongest. Rare heroes are important because future tournaments may restrict eligible rarities or colors, or apply special battle conditions. Stronger high-rarity heroes will sometimes be ineligible. Preserve affordable Rare progression and distinct utility rather than making every Rare generally as strong as a Legendary.

Tournaments are not implemented. Future rules should be visible before team selection, validate consistently and explain ineligible heroes. Rare-only or color-restricted formats are examples, not settled presets. Avoid requiring a large fully developed bench just to enter.

## Design anchors

- Common, Rare, Legendary, Mythical; Legendary is the main powerful playable tier. Epic is only the Rare stat reference.
- ATK most common, SUP less common than ATK, DEF least common.
- Five colors; column-based rune attacks, color stacking, empty-lane charge and readable enemy countdowns.
- Standard mana: Very Fast 6.5 / Fast 8 / Average 10 / Slow 12 / Very Slow 13.5 tiles. Charging: 8/10 or 5/10/15. Compact cards show speed names; exact costs live in details.
- Keep portraits prominent, rarity distinct from element, details on demand and the battlefield clear. Learn from reference hierarchy without copying its screens or asset designs.
- Preserve all 135 champion IDs, ownership, copies, levels, campaign/dungeon progress and independent browser saves. No additional reset is authorized or needed.
- Arena currently uses preset local defense teams. Events use the browser's LA calendar; online competition needs a separate authoritative foundation.

Read [design direction](DESIGN-DIRECTION.md) for the conceptual reference and [QA](QA.md) for real verification results. Reference mechanics are inspiration, not an instruction to implement all of them.
