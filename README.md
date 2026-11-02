# Warband Legends

A standalone match-3 RPG with 200 collectible champions, a five-champion warband, campaign, dungeons, Arena and special events.

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
