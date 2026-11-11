# 0.40.1 — make the opening changes discoverable and improve contrast

- Splash now has an explicit Play Intro control. Successful playback alone marks the automatic intro as seen. Rejected autoplay or Reduced Motion never consumes the once-per-session viewing. Manual replay remains available after viewing. The main Dragon Empress splash artwork stays unchanged.
- Campaign stage 1 now opens with a brief, skippable introduction before Energy is spent. It appears once per difficulty, with replay available through the Chapter Journal. Guardian dialogue at stages 5, 10 and 15 remains.
- A compact Journal button sits beside the campaign difficulty controls, preserving map space.
- Team power labels are darker on parchment. Chapter gift headings, text and buttons have explicit readable colors rather than inherited dark-theme text.
- Measured new-feature contrast at phone and desktop widths: normal copy meets 4.5:1; large and disabled copy meets 3:1. Covered team controls, weekly cards, battle previews, journal, dialogue, chapter gifts, empty quests and cinematic settings. This is a targeted check, not a claim that every existing game screen has been audited.

Validation commands: `npm run check`, `npm run test:splash-intro`, `npm run test:contrast`, `npm run test:campaign-opening`. Browser tests cover rejected autoplay, replay, Skip/Escape, Reduced Motion, campaign intro persistence and charging Energy only after beginning the battle.
