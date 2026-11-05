# Loot Tickets

Buy a pack of five tickets in Shop → Token Exchange for **10 Arena Tokens** or **6 tokens from any one Special Event**. Ticket capacity is 999,999. Tickets are not sold for Gems, gold or in Premium, and do not drop from battles or quests.

Open a previously cleared campaign stage and choose **Use Loot Ticket**. Review the costs and rewards, then confirm. Each instant replay spends one ticket and the usual Energy: Normal 1, Hard 2, Nightmare 3. Insufficient Energy or tickets prevents the operation without spending anything. A clear is required on that exact stage and difficulty. Tickets cannot open new stages, clear dungeons/events/Arena, or be used in playtesting. Inventory shows the balance and provides a Campaign shortcut.

Rewards use the same settlement as an ordinary campaign replay: stage gold, champion XP for the five active owned copies (subject to level caps), profile XP, materials, win/quest/daily-objective progress and the 50-Gem five-victory bonus when due. There is no first-clear payout or battle simulation. Normal account-level Energy refills still occur if reward XP causes a profile level-up.

The confirmation is revalidated at consumption. A persistent use sequence prevents duplicate reward settlement from stale confirmations, even after older receipt history is removed. Ticket and Energy spending and rewards are returned as one new profile and saved together. Existing profiles without the two new counters normalize to zero; backup import/export retains them.

Validation: `npm run check` covers replay parity for all 75 campaign stages, all token currencies, currency limits, missing resources, wrong difficulties, first-clear rejection, playtesting, active battles, stale confirmations, individual-copy XP, reward milestones and backup persistence. `npm run test:loot-tickets` exercises buying/cancelling, inventory, instant clear/cancelling/reload, ordinary 1/2/3 Energy costs, rewards and four viewport widths.
