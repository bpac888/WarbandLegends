# Aerie Court — Founding Roster

A mountain civilization of bird-people: most have humanoid bodies below the shoulders, with compact avian heads and necks above. Bronze featherwork, high palaces and richly colored plumage unite the faction without replacing each species’ identity. The pterosaur and twin-headed guardian are ancient branches of the court. Duovrax is a two-headed owl/raven monster-beast. Veyrath, its sole Mythical, combines an eagle head and a horned monster-beast head, branching evenly from the center of one massive quadrupedal body.

Eighteen additions bring the roster from 215 to 233. The rarity spread is 2 Common, 7 Rare, 8 Legendary and 1 Mythical, alongside 10 Attack, 4 Defense and 4 Support champions. All five elements and Very Fast, Fast, Average and Slow speeds are represented. Existing 215 champion/source records and summon rarity odds are unchanged. Subsequent explicitly requested portrait edits are recorded in [Artwork Revisions](ARTWORK_REVISIONS.md).

## Tailwind Guard

Two matching members gain **4% DEF and 5% extra matching-rune mana**. Three or more gain **6% DEF and 10% extra matching-rune mana**, replacing the two-member tier. Only matching members benefit. Tiers lock at battle start; deaths do not remove the bonus. Flat mana gifts receive no multiplier. This trades the larger matching-mana boosts of Astral/Veldtborn for modest protection.

## Champions

| Champion | Species | Rarity | Element | Type | Charge | Special |
| --- | --- | --- | --- | --- | --- | --- |
| Tivren, Gilded Scout | goldfinch | Common | Yellow | Attack | 10 tiles | Sunseed Arrow |
| Dovessa, Rampart Keeper | rock pigeon | Common | Blue | Defense | 10 tiles | Hearthwing Vigil |
| Rosavelle, Coral Cantor | flamingo | Rare | Red | Support | 10 tiles | Rosewater Refrain |
| Tocaren, Canopy Duelist | toucan | Rare | Green | Attack | 10 tiles | Verdant Beakblade |
| Ibsareth, Floodscript Keeper | ibis | Rare | Blue | Support | 8 tiles | Ink of Renewal |
| Cirrivel, Gale Courier | swift | Rare | Yellow | Attack | 6.5 tiles | Crosswind Needle |
| Ossavik, Carrion Judge | bearded vulture | Rare | Purple | Attack | 12 tiles | Last Ration |
| Ardoven, Stillwater Warden | grey heron | Rare | Green | Defense | 10 tiles | Reedwall Shelter |
| Corveth, Bellshadow Huntress | raven | Rare | Purple | Attack | 8 tiles | Silent Bell |
| Avaroc, Sunspire Regent | eagle | Legendary | Yellow | Attack | 10 tiles | Sovereign Talon |
| Macalisse, Scarlet Herald | scarlet macaw | Legendary | Red | Support | 8 tiles | Banner of Many Voices |
| Pterovar, Ashcrest Ancestor | pterodactyl | Legendary | Red | Attack | 12 tiles | Cinderwing Descent |
| Duovrax, Divided Vigil | two-headed owl and raven monster-beast | Legendary | Purple | Defense | 12 tiles | Dusk and Dawn Watch |
| Tyssara, Moonvault Oracle | barn owl | Legendary | Blue | Support | 10 tiles | Lantern of Quiet Skies |
| Rudavain, Torrent Lancer | ruddy kingfisher | Legendary | Red | Attack | 8 tiles | Waterfall Impale |
| Bucorath, Canopy Castellan | great hornbill | Legendary | Green | Defense | 10 tiles | Casque of the Citadel |
| Sagivra, Quillblade Marshal | secretarybird | Legendary | Yellow | Attack | 8 tiles | Seven-Quill Cut |
| Veyrath, Twin-Crowned Sovereign | two-headed eagle / horned monster-beast | Mythical | Purple | Attack | 12 tiles | Concord of Fang and Feather |

## Balance and artwork

Base ATK, DEF and HP sit within 3% of the existing median for each rarity/type, with speed and coverage controlling Special budgets. Fast attacks trade utility or damage for access; area attacks are Slow; Common kits are simpler. Veyrath has Slow area damage, Attack Down and Poison, plus Poison immunity. This is a bounded initial balance pass, not a measured PvP win-rate claim.

Each of the eighteen portraits was generated individually at native **1024 × 1536** and encoded as quality-95 WebP without cropping or upscaling. All were visually reviewed, including the separate heads on Duovrax and Veyrath. Pre-faction portrait baselines are protected, with explicit approved edits recorded separately.

The shared Collection/Codex/Teams filter derives factions from the roster; Aerie Court therefore appears automatically. Its emblem is registered, and the Guide and team composition displays use the shared faction rules.

## Artwork revisions

Tivren and Dovessa have replacement portraits with compact, integrated avian heads. Duovrax and Veyrath have monster-beast bodies; Veyrath’s former lion head is a horned monstrous beast. Veyrath was subsequently renamed from Trivorath, Threefold Sovereign: the serpent head was removed and the remaining beast and eagle necks now split evenly from a central base. His passive display name is Twin-Crowned Vigil. The stable champion ID and internal passive ID are retained for compatibility. Rosavelle, Ardoven, Sagivra and Macalisse retain their established costumes, props and settings with shorter necks. All eight revisions retain native high-definition dimensions and quality-95 WebP encoding. Champion kits, stats, rarities and faction bonuses are unchanged.

## Validation

`npm run check` verifies the whole roster and static build. New native tests fingerprint all 215 previous records and portraits, resolve each new kit and target scope, exercise summon pools and profile normalization, simulate Auto encounters, check stat envelopes and test the exact faction tiers and matching/flat mana rules. `npm run test:aerie-court` checks all new art, dossiers and filters at four viewport widths. Roster audit and controlled-cast balance reports cover all 233 characters.
