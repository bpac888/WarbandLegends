# Warband Legends

**Runes of War** · A standalone match-3 RPG with a five-champion warband, campaign, dungeons, Arena and special events.

**[Play Warband Legends](https://legends-runes-boris.givingjoy7.chatgpt.site)** · [Documentation](docs/README.md) · [Game rules](docs/RULES.md)

## The two games

| Game | Repository | Purpose |
| --- | --- | --- |
| **Warband Legends** | **This repository** | Match-3 RPG; runs as a static website with saves stored in your browser. |
| **draft1** | [bpac888/warband-legends](https://github.com/bpac888/warband-legends) | Original prototype, retained as draft1; development continues in this repository. |

Each game has its own code, hosting and saves. Warband Legends bundles its own copies of the owner's artwork and champion designs; running it does not require the draft1 server.

## Play on your phone

Open **[Warband Legends](https://legends-runes-boris.givingjoy7.chatgpt.site)** in your phone's browser. An existing Home Screen shortcut uses that same address. Refresh or reopen the game after an update.

Account progress is stored locally in that browser. Leaving, refreshing or closing a battle abandons it; encounters must be started again. Use the game's save export/import before clearing browser data or changing devices.

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

## Updating the playable version

`main` is the current GitHub source. The phone version is published separately through **ChatGPT Sites**. For game changes, update this repository and publish the matching build to the existing Warband Legends Site. Pushing to GitHub alone does not publish that Site.

The original prototype is draft1. Its source and saves remain separate.

See the [documentation index](docs/README.md) for the full feature list, development details and optional Vercel instructions. Artwork provenance is recorded in [RIGHTS.md](RIGHTS.md).
