# Phase 1: roster balance proposal

Reviewed 2026-11-11. Baseline: `b70a629c1f12a680f3b0ac9d23909136f81dd7cd`. **Proposal only; no live champion changes.**

The current roster has 265 champions. The existing audit resolved 885 controlled casts across 295 charge tiers. Attack remains the largest role (146), followed by Support (63) and Defense (56).

## Proposed first balance batch

Prefer targeted improvements over broad nerfs or stat inflation. Preserve rarity, faction, element, artwork and all base stats in this batch. The only proposed speed change is Orrix.

| Champion | Proposed change | Reason |
| --- | --- | --- |
| Ossir, Necropolis Titan (legendary) | Keep Slow 12; extend Taunt and self Damage Ward from 1 to 2 turns. Retain the 176% hit and Attack Down 3. | A Slow Legendary needs a protection window that lasts beyond its activation. |
| The Bronze Juggernaut (legendary) | Keep Slow 12; extend self Damage Ward, team Barrier and Taunt from 1 to 2 turns. Retain damage. | Improve protective uptime without changing this tank into a faster attacker. |
| Nayara, Keeper of the Deep Well (mythical) | Keep Fast 8; increase team healing from 24% to 28% and Ailment Ward from 1 to 2 turns; retain Cleanse and passive. | Give a Mythical cleanser a tangible prevention advantage without copying Sable’s entire kit. |
| Beatrice, Verdigris Mender (legendary) | Keep Fast 8 and 24% team healing/Cleanse; add team Defense Up for 2 turns. | Differentiate the Legendary from Rare Melia with defensive support. |
| Eudoma, Nova Keeper (legendary) | Keep Average 10; healing 26% to 30%, team Attack Up 1 to 2 turns. | Improve the Legendary offensive healer without adding every support effect. |
| Ophira, Seed of Worlds (legendary) | Keep Average 10; healing 26% to 30%, team Ailment Ward 1 to 2 turns. | Make prevention the reason to pick her rather than turning her into another mana healer. |
| Kelydras, Worldbearer (legendary) | Keep Slow 12; team Barrier 2 to 3 turns and team Damage Ward 1 to 2 turns. | Extend actual team protection; do not add Taunt in this first pass. |
| Orrix, Amethyst Bulwark (rare) | Slow 12 to Average 10; retain 125% hit/team Barrier 2 and extend self Riposte 1 to 2 turns. | This is a Rare, so improve access and the counter window rather than giving a Legendary-sized kit. |
| Qingluo, Jade Tempest (legendary) | Keep Slow 12; AoE coefficient 165% to 185%, enemy Defense Down 1 to 2 turns. | Give waiting for this Legendary a clearer damage and setup payoff. |
| Nix, Biosteel Hunter (legendary) | Keep 5/10/15 charge costs and Pierce; damage 90/180/270% to 110/220/340%; retain existing utility. | Make later charge increasingly rewarding; test actual damage because Pierce affects the comparison. |
| Kozhak, Glacier Prowler (legendary) | Keep 5/10/15 costs; damage 85/175/260% to 100/210/330%; final blue Vulnerability 1 to 2 turns. | Reward holding charge while retaining frost and blue-team identity. |
| Phozia, Star Oracle (rare) | Keep Average 10; healing 22% to 28%, team Barrier 1 to 2 turns. | Bring this Rare into a useful protection niche without copying Orsa’s mana utility. |

## Watch without changing yet

- Azhar: Very Fast AoE plus Veldtborn matching mana.
- Sister Carmine and upper Rare healers: compare realized healing before any nerf.
- Magic: preserve requested 5% allied mana per member; test hybrid teams, especially with Veldtborn/Astral.
- The King: preserve requested highest Attack and 25% damaging-Special evasion.
- Yshmir: preserve explicitly requested Very Slow speed and boss-scaling passive.

## Validation before applying

- Compare current and proposed kits in actual battles on identical seeds and boards; evaluate early, middle and fully developed teams separately.
- Cover 1/3/4 enemies, sustained bosses, damaged versus full-health allies, factionless comparisons, faction teams and Magic hybrid teams.
- Measure turns to first Special, damage, effective healing, overhealing, protection uptime, win rate and battle length separately.
- Test every charge tier and confirm manual casting and Auto make legal choices.
- Preserve save compatibility, summon odds, role distribution and faction identities.
- Document effect timing: buffs and debuffs can take effect before the direct hit. Printed coefficients alone are insufficient.

## Limits

- Controlled individual casts, not full-match win rates.
- Proposal values require full-battle tests before application.
- No universal power score: healing, control and damage are not interchangeable.

The existing full review remains in [CHARACTER_BALANCE_REVIEW.md](../CHARACTER_BALANCE_REVIEW.md). Its historical judgments are context, not automatically approved changes. This proposal is the current review deliverable.
