# Goblins

Sixteen champions establish Goblins: **eleven Legendaries and five Rares**, with nine attackers, three defenders and four supports. The roster totals 264 champions across sixteen factions. All 248 previous character records, source records, kits and portraits are preserved by the expansion-11 manifest.

## Scrappy Minds

Active with **one Goblin**. Each Goblin has a **70% chance to resist each incoming Mana Slow or Mana Block application**, including refresh attempts. This protects Goblins only, does not stack with additional members and does not remove ailments already active. A blocked application leaves existing buffs and ailment timers untouched. Other ailments—including Frostbite—and positive mana effects are unaffected. Ailment Ward and passive immunities are checked first. Rolls use the battle's deterministic RNG, so saving and replaying a state cannot reroll the outcome.

## Founding roster

| Champion | Theme | Rarity | Role |
| --- | --- | --- | --- |
| Riffix, Brassstring Bard | Bard musician | Legendary | Support |
| Vexra, Velvet Knife | Cloaked assassin | Legendary | Attack |
| Brondak, Ironhorn Rider | Rhino-mounted warrior | Legendary | Defense |
| Karvosh, the Greatblade | Great swordsman | Legendary | Attack |
| Zizzara, Storm-in-Hand | Lightning-ball mage | Legendary | Attack |
| Tickrul, Hourglass Heretic | Time manipulator | Legendary | Support |
| King Grumvold | Goblin king | Legendary | Attack |
| Piknet, Reedpoint | Spearman | Rare | Attack |
| Rukko, Rustroad Captain | Biker-gang captain | Legendary | Attack |
| Nibsy, Hoodwink Scoundrel | Hooded thief | Rare | Attack |
| Molgrik, Cinderfiend | Lava demon | Legendary | Attack |
| Bubzle, Bottlebrewer | Alchemist | Rare | Support |
| Urdra, Gatebreaker | Shield marshal | Legendary | Defense |
| Snaggle, Trapthorn | Beast trapper | Rare | Attack |
| Morvessa, Moonbone Oracle | Moon oracle | Legendary | Support |
| Boltragg, Scrapwall | Scrap engineer | Rare | Defense |

Every champion has original detailed HD portrait artwork, a unique Special and lore. The faction is available in Codex, Collection, shared team filters, live team summaries, battle inspection and the faction Guide. Goblins join their matching rarity summon pools; global rarity odds remain unchanged. No new stock is granted to existing profiles.

Validation: `npm run check`, `npm run test:goblins`, `npm run roster:audit`, `npm run roster:review`. Tests cover the exact 70% RNG boundary, personal recipients, new applications versus existing timers, other effects, membership counts, all sixteen Specials, summons, saves and responsive artwork/UI integration.
