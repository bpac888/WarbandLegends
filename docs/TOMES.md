# Tomes of Power

These items are initially shown only in Shop → Premium, as unavailable previews. No prices, purchasing, acquisition, drops, quest rewards or item consumption have been enabled. Existing Premium offers remain unchanged.

| Tome | Planned level increase | Eligible character |
| --- | --- | --- |
| Epic Tome of Experience | Up to 20 | Any element or rarity |
| Legendary Tome of Experience | Up to 60 | Any element or rarity |
| Lesser Elemental Tome | Up to 20 | Matching element, any rarity |
| Greater Elemental Tome | Up to 40 | Matching element, any rarity |

Lesser and Greater variants each exist in Red, Blue, Green, Yellow and Purple, for twelve items in total. The intended effect stops at the character's current unlocked level cap and does not bypass ascension or Limit Break requirements. These descriptions define the future item behavior; using a tome is not available in this preview release.

`src/tomes.js` defines the catalog and renders the Premium previews. Twelve detailed illustrations share a single locally bundled atlas at `assets/tomes/power.webp`, shown at 72–80 CSS pixels. Validation uses `npm run check` and `npm run test:tomes`; the browser suite checks all variants, displayed benefits and restrictions, disabled controls, Premium-only placement, unchanged saved profile and four viewport widths.
