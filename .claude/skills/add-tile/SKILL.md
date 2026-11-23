---
name: add-tile
description: Add a project link to the bathroom wall as a new tile. Use when the user gives a URL to add, or asks to add, move or re-emoji a tile.
---

# Add a tile

The user's request is usually just a URL and a few words. Everything else is yours to decide.

1. **Entry.** Open the URL to learn what the project is. If it can't be opened (the network may block it), ask the user for a one-line description instead of guessing. Write a `tiles.js` entry in the shape of its neighbours: an `emoji` that says what the project is about (a 🪥 beats a ⭐ for a tooth brushing app), a short `title`, a one-sentence `blurb`, and the `href` exactly as given. Done when the entry has all four plus `corners`, filled in by step 2.
2. **Place.** Run `pnpm wall <out.png>` and look at the image. Red patches are taken tiles. Pick a free wall tile, right of x=300, at least 25px across both ways in the photo (every emoji is drawn at 22px), and about 120px from every red patch, near any spot the user named, and on bare tile, clear of fixtures. Run `pnpm tile <x> <y>` on a point inside it. Near the sink the grout is lighter, so the fill leaks with "the region leaks past the grout". Retry with a third argument of 120 to 160. Then run `pnpm wall <out.png> <x> <y> <w> <h>` on the area around the tile. Done when the zoomed render shows the new red patch covering exactly one wall tile.
3. **README.** Add a line to the Projects list in `README.md`, in the form of the lines above it.
4. **Verify.** `pnpm test` and `pnpm build` pass. If a browser tool is available, serve with `pnpm preview` and screenshot at 1280px and 390px wide. Done when the emoji shows on its tile at both widths, at the same size as the others and lying flat on the tile (the page warps it onto the tile's corners), and its link has the right href. Stop the preview server's port afterwards, since stopping the shell task can leave node running.
5. **Ship.** Branch `feat/<slug>-tile` from `main`, commit, push and open a PR. Wait for the `test` check. Merge (`gh pr merge --squash --delete-branch`) when the user asked to ship or merge. Otherwise report the PR link and ask. After a merge, wait for the `deploy` job on `main`, then confirm the new link is on https://georgeroberts1.github.io/ai-stuff/.
