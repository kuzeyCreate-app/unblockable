# Unblockable

A small self-hosted arcade. Every playable game, script, and stylesheet is served from the same origin. There are no external game iframes, proxies, CDNs, advertisements, trackers, or runtime dependencies.

## Included games

- **2048** — Gabriele Cirulli’s MIT-licensed game engine, bundled locally with a custom interface. Its full licence is retained in `public/games/2048/LICENSE.txt`.
- **Cookie Foundry** — original incremental baking game with upgrade purchases, automatic production and local saves. This is not the actual Cookie Clicker.
- **Neon Snake** — original Snake game with keyboard/touch input, pause, restart, and local high scores.

## Run

From the repository root:

```sh
python -m http.server 8000 --directory public
```

Open http://localhost:8000. No installation or build step is needed. Serve over HTTPS in production. Saves belong to the browser and origin; they are not synced between devices or domains.

## Deploy

Upload the contents of `public/` to any static web host. On Vercel, use framework preset **Other**, no build command, and output directory **public**. On GitHub Pages, use a Pages-enabled repository and publish `public/` through an Actions workflow or move its contents to your configured Pages source folder.

Self-hosting changes where game files are loaded from. It does not guarantee availability on filtered networks. Only add games whose licences or authors permit redistribution, and keep the required notices. A third-party web address alone is not a distributable game.

## Source provenance

The original engine files `game_manager.js`, `grid.js`, and `tile.js` were retrieved from https://github.com/gabrielecirulli/2048 (master) on 2026-09-30. These engine files are unmodified. The input, rendering and namespaced storage adapter is written for this site.
