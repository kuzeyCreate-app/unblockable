# Unblockable

A small browser-game launcher with a revised frontend, numeric game routes, a frontend revision preview, and a hidden utility/admin deck.

## Games

- **2048** — original Gabriele Cirulli engine, distributed locally under the MIT License.
- **Cookie Clicker** — opened/loaded from Orteil's official DashNet site.
- **Slither.io** — opened/loaded from the official Slither.io site.
- **Zombs Royale** — opened/loaded from the official ZombsRoyale.io site.
- **Hextris** — opened/loaded from the original Hextris project site; original project is GPLv3.
- **Agar.io** — opened/loaded from the official Agar.io site.

Third-party games are not copied into this repository unless their license explicitly permits redistribution. External games may refuse iframe embedding; the UI therefore includes an official-site fallback.

## Routes

Each game has a numeric launcher route under `public/g/<id>/`.

## Frontend revision

Open `revision.html` to preview the live frontend at desktop, tablet, and mobile widths.

## Admin deck

The utility deck appears at the bottom-right after scrolling near the end of the home page. Shift+A also toggles it. It is intentionally only a UI utility, not authentication or a security boundary.

## Legal

Privacy, Terms, Cookies, and Credits pages are included in `public/`.

## Deployment

A GitHub Pages workflow is included at `.github/workflows/pages.yml` and publishes the `public/` directory when GitHub Pages is enabled for the repository.

Vercel can also serve the same `public/` directory using `vercel.json`.

## 2048 provenance

The upstream 2048 engine is by Gabriele Cirulli and retains its MIT License in `public/games/2048/LICENSE.txt`.

Deployment trigger: 2026-09-30
