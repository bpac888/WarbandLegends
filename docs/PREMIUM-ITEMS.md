# Premium boosters and advancement tomes

Premium purchases remain previews. The four new items are registered in `src/premium-items.js`; their transparent WebP icons are in `assets/items/`. They are not sold for Gems, Gold, or tokens, and no starter stock is granted.

- Experience Booster: +25% feeding XP for 24 real hours after activation. Existing donor, matching-element and matching-copy multipliers apply first; the total is rounded down and respects the current level cap. Battle XP is unchanged.
- Gold Booster: +25% Gold from campaign/dungeon clears, Arena wins and event wins for 24 real hours. Bonuses apply after first-clear multipliers, round down, and respect storage limits. Other currencies and non-battle income are unchanged.
- Tome of Ascension: consumes one tome for one ascension tier, without materials or Gold. The champion must be owned, below the final tier, and at the current level cap.
- Tome of Limit Break: consumes one tome for one break, without materials or Gold. Full ascension, the current level cap, a non-Common rarity and an available break are required. The second Limit Break grants its role buff for three board turns at battle start.

Owned items appear in Inventory. Boosters require confirmation and save their expiry timestamps; the clock continues while the game is closed. A second booster of the same type cannot be activated while the first is active. Both types may be active together. Expiry is evaluated for each feeding/reward and the inventory status refreshes at expiry. Tomes offer only eligible owned champions; cancellation or ineligible targets spend nothing. The character's Ascension and Limit Break panels also link to owned tomes.

`premiumItems` stores item counts and `boosters` stores expiry timestamps. Both are optional extensions of profile version 13, normalized and validated during load/import; existing profiles receive empty stock. Backup export/import preserves both fields.

Verification: `npm test`, `npm run build`, `npm run test:premium-items`, `npm run test:token-exchange`, and `npm run test:team-editor`.
