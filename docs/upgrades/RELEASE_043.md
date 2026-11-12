# 0.43.0 — original team colors retain tile damage

Tile damage now includes all original team members of the matched color, even after they fall. A color that was absent from the starting team still deals no tile damage. Multiple same-color champions retain their contributions independently. Living champions use their current modified attack; fallen champions contribute base attack without lingering temporary buffs. Only living champions gain mana, including double mana from empty lanes.

Normal matches, cascades, blasts and prisms all use the same rule. No new battle-save fields or migration are required because original team members remain in the battle state. Auto simulations use the same engine. Defeat still occurs when the entire team falls. The guide explains the rule briefly.

Verification: dedicated ordinary-match, absent-color, red/purple losses, special-rune, stacked-color, expired buff, mana and save/Auto cases; full unit suite/build; real phone and desktop battle interaction.
