# Legends improvement plan

Continue only the independent `bpac888/Legends` game. Leave `bpac888/warband-legends` unchanged. The owner authorizes implementing, testing and publishing Legends changes. The old instruction to defer development until the owner returned was satisfied when they asked to begin.

## Current owner direction

Keep the v0.16 screen-filling battle, art-led menus, individual hero copies and Guide. The v0.17 direction promotes fourteen named Commons, balances the remaining Common elements, makes Common feeding required for levels, improves Gem income and summoning outcomes, and polishes the full interface. Preserve earned levels when migrating existing Legends saves.

**No equipment in Legends.** Do not add gear, equipment slots, forging or set bonuses. Keep existing twenty tactical guides, create no new ones. Never modify the original Warband Legends repository. See GEMS-QUESTS.md and REUSE-AUDIT.md for the implemented systems and source audit.

## Completed

- **v0.6:** artwork-led menus, full-art symbolic cards, seven attack lanes and elemental battle effects.
- **v0.7:** visible hero levels/XP, current Collection stats versus maximum Codex stats, gold training, participant XP and repeatable campaign seals. The owner approved discarding the pre-leveling test save; subsequent releases preserve progression. See [progression rules](PROGRESSION.md).
- **v0.8:** 25 stages × Normal/Hard/Nightmare, three progressively ruined map skins, seven dungeons with source-game art and three tiers each. See [adventures](ADVENTURES.md).
- **v0.9:** nine four-champion local Arena rivals, three scheduled monthly events, a token exchange, source-style summoning page/ritual and four reused Tavern illustrations. The owner explicitly removed event practice. **Never restore an event practice button or out-of-window entry.** See [Arena and events](ARENA-EVENTS.md).
- **v0.10:** The Broken Road, an authored opening group of five encounters; a one-time, telegraphed Overpressure guardian phase; Special details generated from the actual ordered combat plan; tactical notes for ten representative heroes across all colors, rarities and roles. Existing saved fights keep their original rules. See [tactics and initial balance probe](TACTICS.md) and [QA](QA.md).

- **v0.11:** The Hollow Covenant, authored stages 6–10 with escort-triggered Last Light; twenty reviewed tactical identities; charge comparisons and current enemy-kit inspection. See [the second chapter](COVENANT.md). No hero numbers changed; existing saves remain intact.

- **v0.12:** visual finishing across navigation, menus, cards, dialogs and mobile screens; scene artwork in Adventure destinations, brighter art framing, clearer secondary text and a tighter mobile Events composition. Existing guides and all gameplay remain unchanged.

- **v0.13:** ascension-gated caps for every rarity, three post-maximum awakening ranks, ten illustrated materials, dungeon/campaign material rewards, shop purchases, dossier requirements and save migration. See [ascension and awakening](ASCENSION.md).

- **v0.14:** midnight/amethyst/gold palette, viewport-sized battles with a landscape hero dock, clear READY ribbons/charge bars, and a framed Astral Gate with separate summon controls. See QA for verification.

- **v0.15:** Gems replace seals; 43 quests; adapted account levels 1–100, milestones, daily gifts/Today’s Path, six portraits, ten faction emblems and three saved teams. Simplified shop departments and quest views, responsive batches and optional gift previews. Fresh save owner-approved; no equipment.

- **v0.16:** Distinct hero copies with separate XP/ascension/awakening, migration from v0.15 saves, Common-hero training, twelve detailed item illustrations, larger screen-filling battles, fully visible event art, compact Guide, readable menus and a disabled Premium shop preview. See [v0.16 design and ownership rules](V016-VISUAL-ROSTER.md).

- **v0.17:** Fourteen Common-to-Rare promotions; twenty Commons balanced four per color; three Fast Mythicals; feeding gates levels; stronger first-clear and selected quest Gem rewards; 50/30/7.5/1.5/11 summon outcomes with twin Commons; final visual polish. See [v0.17 rules](V017-ROSTER-AND-POLISH.md).

## Next priorities

The following gameplay ideas are retained as future planning context; they are not automatic authorization for additional gameplay systems.

1. **Playtest the first two chapters.** Review the fast-flank ambush, relay support and both guardian warnings with real play. Reproducible probes and real UI fights are covered in QA, but human feedback is still needed. Stages 1–10 are authored; stages 11–25 retain existing formations and guardian markers. Extend the next group after reviewing pacing. Do not claim every chapter has unique objectives or phases.
2. **Keep existing guides; no new tactical guides.** The owner explicitly stopped guide expansion. The twenty existing guides remain. Concentrate on presentation, legibility, artwork framing and smooth navigation. Hero kit changes are not part of the current visual scope.
3. **Prototype overheal as the first advanced combat family.** Before implementation, define cap, health display, healing restrictions, barrier interaction, HP-scaled damage and revival. Introduce it to a limited set of healers, then test actual interactions. No overheal rules or values are finalized yet.
4. **Consider simple minions only after the health layer is stable.** Define timing, attack/protection, limits and removal first. Mega Minions, Fiends, troops, talents, alternate kits, Growth/Wither and extra facilities remain later possibilities.
5. **Review long-term collection pacing.** Common feeding now consumes spare, unassigned copies to unlock levels, with boosted first-clear Gem income and twin-Common summons. Observe whether supply keeps pace with Rare and Legendary development before changing prices or XP. Bad-luck protection remains a future design topic.

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

- **v0.18:** Ascension tier levels restart visually at 1 while underlying XP and power remain; each ascension gives immediate 2% ATK/DEF/HP. Two Limit Breaks replace three Awakening ranks for Rare, Legendary and Mythical heroes, adding five levels and 3% immediate stats apiece. Commons finish at their normal cap. Specials always start at full power and never gain ranks. v0.17 saves migrate to schema 12. See [current hero progression](ASCENSION.md).
