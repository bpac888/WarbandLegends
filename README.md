# Warband Legends

A standalone match-3 RPG with 240 collectible champions across 14 factions (13 with 18 members, plus six elite Magic wizards), a five-champion warband, campaign, dungeons, Arena and special events.

·[Documentation](docs/README.md) · [Game rules](docs/RULES.md)

## Develop locally

Requires **Node.js 22 or newer**. No package dependencies, database or environment variables are needed.

```sh
npm start        # open http://localhost:4173
npm test         # combat, roster and save checks
npm run build    # create dist/ for static hosting
npm run check    # tests and production build
```

Serve the game over HTTP; opening `index.html` directly cannot load the roster.

## Where things live

| Folder | Contents |
| --- | --- |
| `src/` | Game logic, interface and styles |
| `assets/` | Bundled artwork and icons |
| `data/` | Champion roster and design data |
| `tests/` | Automated checks |
| `tools/` | Local server, build and asset tools |
| `docs/` | Rules, setup, design notes and historical checkpoints |


See the [documentation index](docs/README.md) for the full feature list, development details. Artwork provenance is recorded in [RIGHTS.md](RIGHTS.md).

Aerie Court adds eighteen bird-people champions with native 1024 × 1536 portraits and the Tailwind Guard faction bonus. See [the faction roster and balance notes](docs/AERIE_COURT.md).
