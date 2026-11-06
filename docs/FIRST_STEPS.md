# First steps and battle rewards

New players receive one optional recommendation at a time: first Normal campaign win, first victory quest reward, first summon, then viewing a champion's Special and development options. Navigation never claims rewards, summons or spends automatically. Suggestions disappear after viewing the suggested champion, five campaign wins or three summons, and are suppressed in open-roster playtesting. The close button permanently dismisses them for that saved journey; restarting resets the preference.

The flags `onboardingDismissed` and `onboardingComplete` normalize to booleans without changing profile versions. Older saves default to false; established players are excluded by actual progress.

The victory dialog shows a compact reward grid and collapsed champion gains. Expanding gains retains a visible Return to Courtyard action and a scrollable content region. Defeat and sandbox copy remain distinct, and reward calculations and claiming rules are unchanged.

Validation: `npm run check` and `npm run test:journey`. The browser journey completes a real first campaign battle with Auto, checks reward layouts at 320, 390 and 1440 pixels, explicitly claims a quest and summons, and verifies durable completion/dismissal without unintended spending.
