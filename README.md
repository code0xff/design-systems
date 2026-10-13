# Design systems, side by side

One set of screens — an overview, a shelf of controls, and the palette and specimen behind them —
drawn once as HTML and rendered seven times, once per design system.

**[Open the page →](https://code0xff.github.io/design-systems/)**

| System | In one line |
|---|---|
| Graphite | Monotone and dark-first. No accent colour at all: hierarchy is luminance, and status is shape plus a word. JetBrains Mono throughout. |
| Slate | Lilac-cast neutrals, colour only for status and one violet accent, soft curves, every free-standing control a pill. |
| Charcoal | Graphite's ladder read through role tokens. Buttons are outline-only; only a held control inverts. |
| Injective | Charcoal's structure in a saturated blue. Anything held, asked for or vouched for is filled. One scheme. |
| Quartz | A rounded monochrome workbench. Two text roles rather than three, and a primary action that is a solid inverse block. |
| Prism | Quartz's neutrals and corner scale to the character, with colour returned to everything that carries meaning: a blue accent, three status tones, and HTTP methods coloured by effect. |
| Lumen | Pure ink and pure paper with nothing between them. Square corners, one hairline weight, and emphasis spent on a single inversion. |

## How it stays honest

`index.html` holds the sample screens in three `<template>` elements. `app.js` clones each template
once per selected system and sets two attributes on the copy: `data-ds` and `data-scheme`. Nothing
else differs between the columns — not a class, not a style, not a word of markup.

`systems.css` is therefore the whole experiment. It declares one variable contract and fills it
seven times. Where a system has no equivalent for a name in the contract, the gap is recorded in a
comment beside the value that stands in for it:

- **Graphite** has no accent colour, so its accent is the brightest luminance step. It also has two
  readable text steps rather than three — its floor is `ink-400`, with `ink-500` kept for text a
  reader may skip — so a label sits alongside secondary text.
- **Charcoal** and **Injective** define their status hues as *toast borders* (35% lightness at 0.7
  alpha in dark). That is correct on a border and unreadable as text, so `--ok-text` and
  `--danger-text` lift the same hue to a readable lightness. These are the only derived values here.
- **Quartz** has two text roles, `text` and `muted`, so `--ink-soft` and `--ink-faint` are the same
  value. **Prism**, built on the same ladder, restores a third.
- **Injective** has one scheme. Choosing light leaves it dark, and its frame says so.
- **Lumen** has two values and nothing between them, so it is the only column that cannot simply
  fill the contract. A hover tint, a held-back border, a focus wash and a quieter grey label are all
  values it does not have, and each needs a rule of its own at the end of `styles.css`, named for
  what it stands in for. That block is the longest here, and its length is the finding: a contract
  written from the other six turns out to assume a third value exists.

## Rules applied to all seven

**Shape carries the kind before colour does.** A disc settled, a diamond waiting, a ring refused.
The monochrome systems have no hue to spend, so there the shape is the whole signal; elsewhere it is
one more. A colour alone would leave them showing three identical pills.

**Focus is each system's own.** Slate and Prism ring in the accent, Charcoal in `line-hover`,
Injective in its blue, Graphite in a luminance step. Quartz is the only one that splits focus by
control: a field changes its existing 1px border and draws no second outline, a button takes a 1px
outline, and a filled primary leaves a 2px gap. Lumen rings at seven pixels of offset rather than
two — on a page with no fills, a ring drawn tight to a control reads as part of the control.

**Where a system's own rules predict how it will look here, the page lets it.** Lumen is not built
for dense data: with a single ink a table header cannot be subdued and a hairline between every row
becomes a grid of solid black. The overview screen draws exactly that, uncorrected — a comparison
page that quietly fixes a system's weakest screen is not comparing anything.

## Fonts

**Pretendard for the interface and JetBrains Mono for machine values is the default pair**, and
four of the seven columns plus the page chrome take it. Both are served from `fonts/`, so first
paint waits on no CDN. Both are SIL OFL; the licences sit beside the files.

Three columns are not Pretendard. Graphite and Charcoal set the interface in JetBrains Mono as well
as the data — a monospace interface is the point of those systems. Lumen uses Manrope, served from
`fonts/manrope/`; it has no CJK, so its Korean falls through to the Pretendard subset.

Pretendard renders `0x1F` as `0×1F` and `<=>` as an arrow through `calt`/`clig`, which is an edit
to a value rather than a rendering of it. The features are switched off once, on the body, and the
three columns that are not Pretendard take their own back.

## Running it

Any static server over this directory:

```sh
python3 -m http.server 8099
```
