# Tomes of Power

These items are initially shown only in Shop → Premium, as unavailable previews. Purchases, drops and starter stock remain disabled. Owned tomes appear in Inventory with a Choose Champion button and a confirmation before use.

| Tome | Level increase | Eligible character |
| --- | --- | --- |
| Epic Tome of Experience | Up to 20 | Any element or rarity |
| Legendary Tome of Experience | Up to 60 | Any element or rarity |
| Lesser Elemental Tome | Up to 20 | Matching element, any rarity |
| Greater Elemental Tome | Up to 40 | Matching element, any rarity |

Lesser and Greater variants each exist in Red, Blue, Green, Yellow and Purple, for twelve items in total. The effect stops at the character's current unlocked level cap and does not bypass ascension or Limit Break requirements. Using a tome consumes one item, grants levels up to the unlocked cap and contributes to the Daily Path level-up objective. Matching-element restrictions are enforced. Canceling or selecting an ineligible champion spends nothing.

`src/tomes.js` defines the catalog and renders the Premium previews. Twelve transparent detailed illustrations share a single locally bundled atlas at `assets/tomes/power.webp`, shown at 72–80 CSS pixels. Validation uses `npm run check` and `npm run test:tomes`; the browser suite checks all variants, displayed benefits and restrictions, disabled controls, Premium-only placement, unchanged saved profile and four viewport widths.
