# Design systems, side by side

One set of screens — an overview, a shelf of controls, and the palette and specimen behind them —
drawn once as HTML and rendered five times, once per design system.

**[Open the page →](https://code0xff.github.io/design-systems/)**

| System | In one line |
|---|---|
| Graphite | Monotone and dark-first. No accent colour at all: hierarchy is luminance, and status is shape plus a word. JetBrains Mono throughout. |
| Slate | Lilac-cast neutrals, colour only for status and one violet accent, soft curves, every free-standing control a pill. |
| Charcoal | Graphite's ladder read through role tokens. Buttons are outline-only; only a held control inverts. |
| Injective | Charcoal's structure in a saturated blue. Anything held, asked for or vouched for is filled. One scheme. |
| NightBrowser | A rounded monochrome workbench. Two text roles rather than three, and a primary action that is a solid inverse block. |

## How it stays honest

`index.html` holds the sample screens in three `<template>` elements. `app.js` clones each template
once per selected system and sets two attributes on the copy: `data-ds` and `data-scheme`. Nothing
else differs between the columns — not a class, not a style, not a word of markup.

`systems.css` is therefore the whole experiment. It declares one variable contract and fills it five
times. Where a system has no equivalent for a name in the contract, the gap is recorded in a comment
beside the value that stands in for it:

- **Graphite** has no accent colour, so its accent is the brightest luminance step. It also has two
  readable text steps rather than three — its floor is `ink-400`, with `ink-500` kept for text a
  reader may skip — so a label sits alongside secondary text.
- **Charcoal** and **Injective** define their status hues as *toast borders* (35% lightness at 0.7
  alpha in dark). That is correct on a border and unreadable as text, so `--ok-text` and
  `--danger-text` lift the same hue to a readable lightness. These are the only derived values here.
- **NightBrowser** has two text roles, `text` and `muted`, so `--ink-soft` and `--ink-faint` are the
  same value.
- **Injective** has one scheme. Choosing light leaves it dark, and its frame says so.

## Two rules applied to all five

**Shape carries the kind before colour does.** A disc settled, a diamond waiting, a ring refused.
The monochrome systems have no hue to spend, so there the shape is the whole signal; elsewhere it is
one more. A colour alone would leave them showing three identical pills.

**Focus is each system's own.** Slate rings in its accent, Charcoal in `line-hover`, Injective in
its blue, Graphite in a luminance step, and NightBrowser draws no ring at all — its control's
existing 1px border becomes `text`.

## Fonts

Wanted Sans (split woff2 set, `unicode-range` per subset) and JetBrains Mono (Latin) are served from
`fonts/`, so first paint waits on no CDN. Both are SIL OFL; the licences sit beside the files.

Pretendard, which Injective and NightBrowser use, is **not** bundled here. Those two columns fall
back to the platform face, so their letterforms are not what those systems actually specify.

## Running it

Any static server over this directory:

```sh
python3 -m http.server 8099
```
