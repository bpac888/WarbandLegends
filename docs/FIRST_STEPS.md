# Guided first steps

The tutorial follows actual gameplay, alternating every activity with a quest reward claim:

1. Complete one free practice battle: make a normal three-tile match, cast a Special, create and manually activate a four-match Blast Rune, then create and manually activate a five-match Prismatic Rune → claim **Your First Battle Lesson** (100 Gold, 50 Gems, 25 profile XP). No quest visits interrupt the six actions.
2. Win a Normal campaign battle → claim **Across the Broken Gate**.
3. Summon a champion → claim **An Answer from Beyond**. Its one-time reward now includes one spare Common Cult Zealot copy for training, alongside the existing rewards.
4. Raise a champion by at least one level through feeding → claim **A Stronger Champion** (150 Gold, 25 Gems, 25 profile XP).
5. Visit the main Shop tab → claim **Know Your Supplies** (100 Gold, 25 Gems, 25 profile XP).
6. Visit Token Exchange, Premium and Inventory → claim **Explore Your Resources** (100 Gold, 25 Gems, 25 profile XP).
7. Save a changed team, including a changed order → claim **Shape Your Warband** (100 Gold, 25 Gems, 25 profile XP).
8. Open the Guide → claim **Knowledge for the Road** (100 Gold, 25 Gems, 25 profile XP).

The final claim opens a one-time “You’re ready to start your adventure!” message with a campaign shortcut. Browsing never requires purchases or item activation. Suggested navigation never claims rewards, summons or feeds automatically. Feeding retains its explicit consumption warning, confirmation, Gold cost and protection for team members.

Each new tutorial quest unlocks after the preceding reward is claimed. Visits made before unlocking a lesson do not count. The resource lesson persists all three individual visits, and saving an unchanged team does not count. Feeding counts only when it produces at least one actual level. Normal quest XP, battle XP, tomes and boosters do not satisfy that feeding lesson.

`profile.tutorial` stores normalized boolean flags. Existing short-tutorial completion does not skip these new lessons; the dismiss preference still hides suggestions. Tutorial quests remain usable through their Continue actions after dismissal. The final celebration is acknowledged in the save before display, preventing repeats on reload. Tutorial activity is not recorded in open-roster playtesting.

There are 66 quests total: the original 60 plus six linked tutorial quests. Practice is the first quest, with one combined reward after its six actions. Current tutorial reward claims are prioritized in the quest list; locked tutorial quests are hidden until available. Reward claims remain idempotent, including the Common copy grant.

Validation: `npm run check` and `npm run test:journey`. Unit tests cover gates, feeding, copy grants, team changes, visits, normalization and repeated claims. The browser journey performs an actual first battle, summon, training, all visits, changed team save, Guide visit and reward claims, then checks the finale and reload behavior. The compact battle result view is also checked at 320, 390 and 1440 pixels. Practice uses normal casts, swaps and special-rune creation; its enemies cannot meaningfully threaten the player, Auto is disabled, and unexpected actions leave the guided board intact. Leaving practice early grants nothing and lets the player retry.

Practice refill seeds are chosen so newly created special runes survive for manual activation. The normal selection and second-tap activation controls are used, with the created rune highlighted during each activation step. The final tutorial celebration includes an original transparent gold trophy illustration.
