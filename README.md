# AI Stuff

A personal collection of AI stuff (games, trackers and experiments), built with Vite and pnpm. The home page is a photo of a tiled bathroom wall, and each glowing tile on it shows its project's emoji and links to it.

```text
pnpm install
pnpm dev      # dashboard at http://localhost:5173
pnpm build    # static site in dist/
pnpm optimize # rebuild the responsive photo files in public/img from assets/source
pnpm audit:page [url] [runs]  # Lighthouse mobile audit of a running `pnpm preview` (THROTTLING=devtools for real throttling)
pnpm tile <x> <y>  # prints the corners of the photo tile under a point, for tiles.js
pnpm wall out.png [x y w h]  # draws the photo with a grid and the taken tiles in red
pnpm test     # checks every tile links somewhere real and every photo file exists
```

## Add a new project

In Claude Code, paste the URL with a few words about it ("add a tile for https://... , a recipe app"). The `add-tile` skill in `.claude/skills` writes the entry, picks a free tile, checks it and opens a PR.

By hand, for a project hosted elsewhere (the usual case), add an entry to `tiles.js` with its https URL.

Built in this repo:

1. Make a folder with its own `index.html`, such as `my-app/`.
2. Add it to `build.rollupOptions.input` in `vite.config.js`.
3. Add an entry to `tiles.js`

Either way, give the entry the four corners of a tile on the photo (clockwise from top left, in the 1400x1050 pixels of the photo). `pnpm tile 528 232` finds them from any point inside a tile. Keep tiles right of x=300 (phones crop the photo there) and about 120px apart, or the tests fail.

## Hide a tile

Add `hidden: true` to its entry in `tiles.js` and it disappears from the wall and the list once `main` deploys. Hidden tiles still keep their spot and still have to pass the tests. To preview them on the live site, add `?all` to the URL for every hidden tile, or `?show=Choirmash` (titles, comma-separated) for just some. Previewed tiles are drawn dashed.

## Projects

Each one lives in its own repo and is linked from a tile.

- 🥔 [Poteto Mode: the Playbook Quest](https://georgeroberts1.github.io/poteto-playbook-quest/) ([repo](https://github.com/georgeroberts1/poteto-playbook-quest)) is a learner's game about the `/poteto-mode` playbooks in [pstack](https://github.com/cursor/plugins/tree/main/pstack), the AI coding skills Lauren Tan (poteto) built at Cursor. It has a harder CS mode.
- 🪥 [Brushing Stars](https://brushing-stars.vercel.app/) is a mobile-first tooth brushing tracker for young children.
- 🚶 [Thames Path](https://walk-tracker-omega.vercel.app/?completed=7%2C8%2C9%2C10%2C11%2C12%2C13%2C14) is a walk tracker for the Thames Path.
- 🍽️ [Restaurant Metrix](https://restaurant-metrix-xiwa.vercel.app/) is a restaurant rating aggregator (hidden).
- 🎶 [Choirmash](https://choirmash-v2.vercel.app/) is an app for choir singers to sing together remotely (hidden).
- ⚽ [Match Ranker](https://match-ranker.vercel.app/) ranks Premier League football matches.
- 🔭 [Tonight's Sky](https://georgeroberts1.github.io/tonights-sky/) shows the Moon, planets and stars above your town tonight.
- 🕵️ [Conspiracy or Real?](https://georgeroberts1.github.io/conspiracy-or-real/) is a quiz game: did it really happen, or did we make it up?

The photo is a CC0 image from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Old_bathroom_with_subway_tiles.JPG). `pnpm optimize` turns the 6.9 MB original into AVIF, WebP and JPEG files at six widths (the 1600px AVIF is 51 KB, the 828px phone file 20 KB), and the page picks one with `srcset`.

The site is static, so GitHub Pages serves `dist/` (Settings, Pages, source GitHub Actions, which the workflow needs).

CI (`.github/workflows/ci.yml`) runs the tests on every PR and push to `main`. Pushes to `main` build with Vite and deploy `dist/` to GitHub Pages only when the tests pass.
