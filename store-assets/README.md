# Chrome Web Store listing images

Three complete design options for every image the store listing accepts, plus the
generator that produced them.

```bash
node store-assets/build.mjs           # render everything into out/
node store-assets/build.mjs a c       # only directions A and C
node store-assets/build.mjs --keep-html   # keep the intermediate HTML for debugging
```

Rendering uses headless Chrome (auto-detected; override with `CHROME_PATH`). No npm
dependencies. Every screenshot is composed from the real UI captures in
[Screenshots/](../Screenshots) — nothing in these images is a mockup of a feature the
extension doesn't have.

## What the store asks for

| Store field | Size | Required | Files |
| --- | --- | --- | --- |
| Store icon | 128×128 | yes | `out/store-icon/` — 3 options |
| Screenshots | 1280×800 | at least 1, up to 5 | `out/<direction>/screenshot-*.png` — 4 per direction |
| Small promo tile | 440×280 | needed to be listed in a category | `out/<direction>/small-tile-*.png` |
| Marquee promo tile | 1400×560 | only for homepage/collection features | `out/<direction>/marquee-*.png` |

Pick **one direction** and use it for all of them — the store shows the tile and the
screenshots together, so mixing directions looks accidental.

## The three directions

| | Direction | Look | Best when |
| --- | --- | --- | --- |
| **A** | `a-spotlight` | Dark charcoal, orange glow, screenshots in a browser frame | You want it to read as a polished dev tool. Highest contrast against the store's white chrome. |
| **B** | `b-sunrise` | Full-bleed brand orange, white type, poster-style marquee with no screenshot | Maximum shelf impact in a grid of tiles. The marquee is pure branding, so it stays legible when scaled down. |
| **C** | `c-blueprint` | Light graph-paper grid, dark type, orange as an accent only | Feels academic and matches the extension's light theme. Safest, least "salesy". |

Recommendation: **A** for the screenshots (the dark surface makes the popup UI pop) or
**B** if you care most about the tile getting clicked in a crowded category page.

## Screenshot set (same 4 slides in each direction)

1. `01-popup` — the popup, dark EN and light HE side by side
2. `02-customize` — options page, color schemes and per-department toggle
3. `03-hebrew` — Hebrew RTL options page
4. `04-moodle` — Moodle auto-add, split layout on the Courses panel

## Store icons

- `store-icon-a-transparent` — the current icon art, rescaled so it sits inside the
  96×96 safe area with 16px transparent padding. The shipped `icon-128.png` bleeds to
  the canvas edge, which the store crops inconsistently; this fixes that.
- `store-icon-b-orange-tile` — flat white bars on an orange rounded tile. Redrawn as
  vector because the 3-D art turns to mush at 16px.
- `store-icon-c-dark-tile` — the original orange art on a dark rounded tile.

These are for the **listing** only. Swapping the in-product `extension-icons/*.png` is a
separate change and would need all four sizes regenerated.

## Editing

All wording lives in the `COPY` object at the top of `build.mjs`. Colors, backgrounds and
typography live in `DIRECTIONS`. Crop rectangles for a slide are in source-image pixels.
