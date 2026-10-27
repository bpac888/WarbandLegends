# Auto battle

Auto is opt-in for the current encounter. It animates normal game actions at ×2,
uses the same combat rules and rewards, and never starts another battle. Every
new encounter starts with Auto off and speed ×1. Turning Auto off restores the
manual speed selected before it was enabled.

## Decisions

- A module worker keeps planning off the UI thread.
- Evaluate every legal neighboring swap and special-rune activation against five
  independent refill samples. Weight the worst sample as well as the average.
- Look one more board move ahead for the three strongest candidates.
- Score living champions, health, barriers, mana, timed effects, enemy health and
  imminent attacks. Use actual combat resolution for elements, defenses, Taunt,
  counters, passives and guardian phases.
- Evaluate every ready Special charge and every legal living ally/enemy target.
  Compare the best casts against the next exchange before committing. Replan
  after each cast, so support and offensive actions can work together.
- Hold wasted pure heals and blocked buffs. Seek finishes, useful healing and
  cleansing, while accounting for mana expenditure.
- Replace the live RNG seed during board search: planning cannot read future
  refills or random enemy targets. Search creates no animation frames and cannot
  mutate the real battle or claim rewards.

## Controls and lifecycle

Show planned runes/targets briefly, then play ordinary animation frames. Menus
and hidden tabs pause planning. Manual battle input takes over. Auto cancels
outstanding work on departure, encounter completion or failure. No Auto setting
is saved in the profile.

## Validation

`npm run check` includes focused AI decisions and parity between animated and
frameless resolution. `npm run test:auto` checks the real worker, healing targets,
pause/resume, manual takeover, phone/landscape/desktop layouts, victory rewards
and new-encounter reset. Viewport and lifecycle suites cover the shared controls.

Development simulations also exercised campaign, dungeon, arena and event fights,
including mixed teams covering all 135 hero designs. Auto is a heuristic player;
team strength, board refills and enemy targeting can still lead to defeat.
