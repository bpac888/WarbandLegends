# Legends design direction · reference notes

This records the owner's conceptual reference supplied after the v0.6 visual redesign was prepared. It is inspiration and analysis, not a finalized specification or authorization to implement every listed system. It does not change gameplay. The separately scheduled task remains the visual redesign's browser verification and publication; these notes do not expand that task into new combat/economy systems.

## Intended experience

A five-hero collection RPG in which board choices, team composition, charge timing and collection progression affect one another. Matching is a tactical input to the heroes' combat, rather than an isolated puzzle that merely awards generic damage. The desired depth comes from understandable interactions, distinct heroes, and meaningful goals between battles.

The combat loop: read the enemy lanes and countdowns, choose which colors and columns to clear, create cascades or specials, decide when to spend a hero's Special, and adapt as enemies die and lanes become empty. The collection loop: earn reliable rewards, recruit or develop heroes, build a team for a specific challenge, and return to combat with new choices.

Existing owner decisions stay the anchor: Common/Rare/Legendary/Mythical, Legendary as the main powerful playable tier, ATK more numerous than SUP and DEF least common, five colors, one Special plus passives, standard mana categories and two-/three-stage charging. Rare uses the supplied Epic stat baseline; Epic is not a new rarity. Character cards show speed names and symbols; exact charge calculations belong in detailed ability views.

## Closest fit with current Legends

Already present: a 7×5 board, five-hero color teams, column-based rune attacks, empty-lane double charge, color stacking, a five-color advantage system, 6.5/8/10/12/13.5 standard thresholds, 8/10 or 5/10/15 charging, distinct Special/passive data, board-move effect timers and an independent local collection/save foundation.

Important differences from the supplied reference: off-color tiles currently clear for zero damage and zero charge, rather than a one-damage token hit. Yellow/Purple same-color attacks are currently neutral, rather than self-resisted. Troops, buildings, leveling/ascension, costumes/talents, overheal, minions/fiends, Growth/Wither, pity/exchange and online multiplayer are not implemented. These differences are design decisions to evaluate; the reference does not automatically override them.

## Mana timing and breakpoint lessons

A useful simplified calculation is `required non-ghost tiles = ceil(base threshold / charge multiplier)`, assuming a fixed modifier, no flat gifts and no rounding complications. Actual board moves depend on match sizes, cascades, ghosting, effect duration and the selected charge level.

- Average 10 with +12%: 9 tiles give 10.08 charge. This changes four three-tile matches to three.
- Fast 8 with +15%: 7 tiles give 8.05 charge, but seven and eight both require three ordinary match-threes if nothing else contributes. The improvement becomes relevant with other match sizes, ghosting or fractional gains.
- Very Fast 6.5 with +12%: 6 tiles give 6.72 charge. This can change three ordinary match-threes to two, a particularly strong breakpoint.

Therefore a nominally small mana bonus can be far more valuable than a similar ATK bonus. Balance charge bonuses by the turns they save, not their percentage alone. If bonuses are introduced, choose one clearly described progression source first, explain addition vs multiplication, enforce consistent precision, and test both regular and multi-charge heroes. Do not automatically copy several simultaneous troop/talent/costume/family bonus systems.

## Hero identity and combat clarity

Each hero should have a recognizable job and a reason to be chosen: an early cleanser, delayed area attacker, focused protector, mana disruptor or charging hero with a real cast-now/hold decision. Merging imported A2/A3 effects is a starting point; final kit tuning should emphasize purpose rather than the longest effect list.

Fast vs slow should offer credible tradeoffs. A slower, stronger skill needs enough survivability or payoff to justify holding it. Support heroes should influence battle tempo, not only refill HP. Defenders should create interesting targeting/protection choices. Lower rarities should remain useful through inexpensive development and appropriate challenge rules, while Mythical heroes gain distinct identities rather than making Legendary teams obsolete.

The visual direction supports this depth: seven clear attack lanes, visible empty-lane opportunities, readable enemy countdowns, element-coded impacts and different visual language for damage, healing and protection. Detail remains available on demand without filling the battlefield with explanatory panels.

## Long-term progression without unnecessary overhead

The reference's base-building systems serve a purpose: battles supply resources, facilities convert those resources into future team development, and the player has a reason to return. That purpose is more important than copying Food, Iron, Recruits and several specialized facilities immediately.

A first coherent progression loop could use the existing gold and seals, add one comprehensible hero-development system and give the Citadel a small number of meaningful illustrated destinations. A future Training Hall, Forge and Summoning Gate are possible concepts, not selected requirements. Avoid resource currencies with no useful sink, upgrades that exist only to unlock other upgrades, or duplicate costs whose consequences are unclear.

The current foundation has finite starter seals and one-time quests/first-clear rewards; a sustainable repeatable earned-seal path needs design before collection becomes the long-term focus. Duplicates are retained today. Any later feeding, training or exchange system should protect the last owned copy and clearly preview what is consumed and received.

## New mechanic families to consider in stages

Overheal is a promising visible extension for healers, provided its cap and interaction with shields, HP-scaled damage, healing restrictions and revival are defined first. It should have a separate readable health treatment.

A simple minion system could later add a protective layer and an attack on a consistent board-move clock. Mega Minions and Fiends should follow a stable basic system, with explicit limits and clear rules for healing absorption, attack timing and removal. Avoid turning every turn into lengthy overlapping playback.

Growth and Wither describe battle-long stat changes, not account-wide progression. If explored, keep them separate from baseline hero data, give them caps and visible indicators, and state what cleanse/dispel can remove. Unbounded permanent-in-battle modifiers risk runaway snowballing.

Troops could support lane presentation and a small strategic modifier. A large stat/mana equipment layer is optional. Alternate appearances could begin as cosmetic choices; multiple mandatory stat-boosting costumes would create a much larger balance and collection burden.

## Collection fairness and replayability

Borrow the purpose of bad-luck protection and duplicate exchange: steady progress despite unlucky random pulls. Set the actual thresholds, eligible rarities, participating pools and exchange prices for Legends' own earned-resource economy. Do not adopt the reference's exact 100/10/15/20 numbers as settled requirements.

Depth should reward a varied bench through different encounters, restrictions and counters. Avoid requiring dozens of fully developed heroes before the player can participate meaningfully. Establish a fair single-player progression and reward loop before building asynchronous PvP, alliance bosses or wars. Shared competitive rewards require an independent authoritative online foundation later; they are not part of this offline visual update.

## Suggested development order

1. Finish and verify the current battle/menu/card presentation, then playtest lane clarity, mana timing and pace.
2. Build a complete campaign-to-reward-to-hero-development loop with reliable repeatable goals.
3. Refine a representative set of distinct kits and status counters across colors, roles and rarities.
4. Add one progression/modifier system at a time, checking real charge breakpoints and lower-rarity usefulness.
5. Explore advanced mechanic families and varied challenge formats; add online/social systems after the core loop is proven.

The desired result is a polished tactical collection game with long-term team building. This reference clarifies that aim while leaving room for an original Legends economy, terminology, art direction and combat identity.
