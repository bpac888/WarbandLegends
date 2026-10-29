# Teams

Manage warbands in **Codex → Teams**. Team 1 starts with the current warband. Create or edit a lineup, then use **Make Active** to select it for every battle mode. Editing an inactive team keeps the active choice; saving edits to the active team updates it immediately.

Four slots retain the current lineup plus up to three previously saved warbands. On the first load after this update, the current lineup becomes Team 1 and distinct old saved lineups fill the remaining slots. Existing progress and hero copy IDs are retained.

The profile stores `teamsVersion: 1`, `activeTeamSlot` and `teamSlots`. `profile.team` mirrors the active slot and remains the battle-entry source for Campaign, Dungeons, Arena and Special Events. Reloads and save export/import retain the active choice. Saved copies remain protected from feeding. Turning off playtesting removes unavailable saved lineups and repairs the active team to collected heroes.

Collection and Codex filters include Faction. Rarity, Element and Faction sorts each support both directions; rarity defaults to highest first. Secondary rarity/name ordering stays consistent within each primary group.

Checks: `npm run check` and `npm run test:active-teams` cover migration, editing, activation, save round-trips, playtesting, sorting and real battle entry in all four modes.
