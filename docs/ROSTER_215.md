# Road to 215 Champions

This expansion adds eight Rares and seven Legendaries: eight Attack, four Defense and three Support characters. Attack remains the most frequent role at 115/215 (53.5%). No Commons or Mythicals are added. All 200 previous champion records, kits, artwork and source records are preserved exactly; the expansion manifest fingerprints that baseline.

Hjolven replaces the proposed name Veska. Calveris replaces the proposed marine guardian Pelagra: Chymera's direction for new additions is alchemical, informed by Auroline's brass laboratory apparatus, glass vessels, luminous reagents and ornate craftsmanship. Existing Chymera designs are unchanged.

## Additions

| Character | Faction / Element | Rarity / Role / Charge | Purpose |
| --- | --- | --- | --- |
| Hjolven, the Violet Rime | Frost / Purple | Rare / Attack / 8 tiles | Accessible Purple Frost attacker; focused suppression rather than Skeldra’s charging control. |
| Maerith, Mosslight Exile | Umbra / Green | Rare / Support / 10 tiles | First Green Umbra support; targeted rescue and team purification. |
| Brannik, Verdigris Sapper | Ironclad / Green | Rare / Attack / 8/10 tiles | First Green Ironclad attacker; accessible charging choice. |
| Xuelan, Amethyst Fang | Dragondynasty / Purple | Rare / Attack / 8 tiles | First Purple Rare Dragon Dynasty attacker; direct Pierce without extra control. |
| Calveris, the Azure Retort | Chymera / Blue | Legendary / Defense / 10 tiles | First Legendary Chymera defender; alchemical apparatus and protective reagents, not a marine creature. |
| Nyxel, Nullwall Marshal | Neon Syndicate / Purple | Legendary / Defense / 8/10 tiles | First Purple Neon defender; early interception or sustained team protection. |
| Solvex, Gridbreaker | Neon Syndicate / Yellow | Legendary / Attack / 12 tiles | First Yellow Legendary Neon attacker; deliberate area Dispel before damage. |
| Rukora, Emberhide Sentinel | Veldtborn / Red | Legendary / Defense / 10 tiles | First Red Veldtborn defender; team Barrier without Riposte or healing. |
| Mavren, Dusk-Horn Hunter | Veldtborn / Purple | Rare / Attack / 12 tiles | Slow Rare burst alternative to Average Phaedra; no chained control. |
| Nesira, Keeper of Rain Jars | Duneriders / Blue | Rare / Support / 10 tiles | Accessible Blue Dune support below Mythical Nayara; single-ally rescue, not team healing or Ward. |
| Harvek, the Caravan Shield | Duneriders / Red | Rare / Defense / 8 tiles | First Red Dune defender; brief Fast interception rather than lasting team protection. |
| Zamrukh, Thornstorm Rider | Duneriders / Green | Legendary / Attack / 12 tiles | Slow area Pierce complements Yaqut’s Fast single-target poison. |
| Elythra, Eclipse Cantor | Astral Concord / Purple | Rare / Support / 10 tiles | First Purple Astral support; purification and brief prevention with no healing or mana gifts. |
| Vaedros, Comet Shear | Astral Concord / Green | Legendary / Attack / 8 tiles | First Green Legendary Astral attacker; focused buff removal with restrained burst. |
| Orastel, Sunwake Herald | Astral Concord / Yellow | Legendary / Attack / 10 tiles | Predictable Yellow area pressure alongside Ixanth’s charging single-target kit. |

## Balance boundaries

Element totals are 43 Red, 43 Blue, 44 Green, 42 Yellow and 43 Purple. Rarity totals are 27 Common, 76 Rare, 95 Legendary and 17 Mythical. Roles are 115 Attack, 47 Defense and 53 Support. Eleven factions have 18 characters; Wildgrove has 17.

The new kits use existing effects and targeting rules. Chymera can extend Calveris's one-turn Attack Down, but never his allied protection. Astral and Veldtborn matching-mana bonuses apply normally; they do not amplify flat gifts, and none of the new kits generates mana. Charging choices use the existing rule: casting either tier spends all stored charge. Cleanse and Dispel resolve before healing and damage. Targeted healers restore one chosen ally while purifying all living allies. No revival, new status type, save reset, summon-odds change or economy change is introduced.

All fifteen portraits are individually generated at native 1024 × 1536 resolution, then encoded as quality-95 WebP without cropping or upscaling. Existing portraits are not re-encoded. Art references include Auroline, Odravic and Huying; faction identity, readable faces, detailed materials and distinct silhouettes guide the new compositions.

## Validation

`npm run check` runs native regression tests and production asset checks. `npm run test:roster-215` exercises the Codex, all fifteen portraits and dossiers, filters, ownership, development controls and four viewport widths. The native expansion tests cover baseline hashes, exact expansion composition, every Special tier, effect recipients, summon eligibility, saved profiles and Auto encounters. The current roster audit and controlled-cast balance review are regenerated from the 215 records. These checks demonstrate correctness and coverage; they do not establish measured PvP win rates or final long-term balance.
