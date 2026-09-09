# metallic-colors

Metallic paint swatches in CSS or Sass — layered gradients calibrated from photographed readings of the real surface.

**[Live demo](https://lotusk08.github.io/metallic-colors/)**

A metallic has no one colour. Turn a painted sample in the light and it runs from a dark flop, through the colour it shows face-on, to the bright specular of the flake itself: a gold that flashes lemon, a blue that flashes cyan, a pearl that goes almost white. A flat hex cannot say that, and a lighter copy of the face is not what the flake does. This package treats a tone as a set of **readings** of one surface at different angles and lays them out as light would — an opaque body, a specular band that peaks in the tone's real sheen, and a fainter band crossing it so the two interfere the way brushed metal does.

- Zero dependencies. TypeScript, ESM, ~3 KB.
- Works anywhere CSS does: a `background` value plus one small stylesheet.
- A Sass-only version of the same recipe — mixins and `!default` settings, no JavaScript.
- Optional React wrapper.
- Forty calibrated tones included — a photographed paint deck and the classic metals — and the scripts to calibrate your own.

## Install

```bash
npm install metallic-colors
```

Or straight from GitHub (it builds on install):

```bash
npm install github:lotusk08/metallic-colors
```

## Use

Import the stylesheet once. It supplies what a background alone cannot: the flake blended soft-light so it grains the colour rather than greying it, the bevel, and the sweep of light that crosses the swatch on hover in the tone's own sheen.

```js
import "metallic-colors/metallic.css"
```

### Plain DOM

```js
import { metallicSurface } from "metallic-colors"

const gold = { face: "#ec9d00", sheen: "#fffd89", mid: "#ffeb5e" }
const el = document.querySelector(".swatch")
const s = metallicSurface(gold)

el.classList.add("metallic")
el.style.backgroundImage = s.background
el.style.setProperty("--metallic-sheen", s.sweep)
```

`face` and `sheen` are required; `mid` (part-turned) and `flop` (turned away from the light) are derived when you don't have them.

### React

```jsx
import "metallic-colors/metallic.css"
import { Metallic } from "metallic-colors/react"

<Metallic tone={{ face: "#527fb2", sheen: "#c5eeff" }} className="h-24 w-24 rounded-lg" />
```

`Metallic` renders a `span` (or `as="div"`, etc.) carrying the `metallic` class and the surface as inline style. Size and shape it with your own classes; the class does not set dimensions.

### Presets

```js
import { PAINT_DECK, CLASSIC_METALS, PRESETS, presetByCode } from "metallic-colors/presets"

presetByCode("M17")       // { code: "M17", name: "Gold", face: "#ec9d00", mid: "#ffeb5e", sheen: "#fffd89" }
presetByCode("rose-gold") // { code: "rose-gold", name: "Rose Gold", face: "#c98a7e", mid: "#e8b8ad", sheen: "#ffe9e3" }
```

- `PAINT_DECK` — twenty-four metallic wall-paint tones, each read three times from a printed colour card (face-on, part-turned, into the light).
- `CLASSIC_METALS` — sixteen familiar metals (silver, chrome, platinum, aluminium, titanium, pewter, gunmetal, graphite, white gold, champagne, yellow gold, brass, rose gold, copper, bronze, steel blue), authored rather than photographed. Use them as they are, or as starting points.
- `PRESETS` — both, and `presetByCode` looks a tone up by code, case-insensitively.

### Sass

The same recipe in Sass alone, for a project with no JavaScript in its styling. Mixing happens in oklab through `color.mix($method: oklab)`, so it needs Dart Sass 1.79 or newer.

```scss
@use "metallic-colors/scss/metallic";            // emits the .metallic class
@use "metallic-colors/scss" as metallic;         // the mixins and settings

.gold {
  @include metallic.surface(#ec9d00, #fffd89, $mid: #ffeb5e);
}
```

With a bundler, point Sass at `node_modules` (`loadPaths`) or use the `pkg:` importer: `@use "pkg:metallic-colors/scss"`.

`surface($face, $sheen, $mid: null, $flop: null)` writes the `background-image` and `--metallic-sheen`; the element still needs the `metallic` class, or `@include metallic.base` on its own selector. `surface-background(...)` and `surface-sweep(...)` return the values if you would rather place them yourself.

Every setting is a `!default`, overridable at `@use` time. Sass configures a module only on its first load, so put the `with` block on whichever of the two you load first — the class entry forwards the settings:

```scss
@use "metallic-colors/scss/metallic" with (
  $band-angle: 135deg,   // where the light comes from
  $band-alpha: 0.7,      // a harder, brighter flash
  $cross-alpha: 0.2,     // a calmer surface
  $flop-drop: 0.16,      // a deeper flop for a coarse flake
  $flake: none,          // no grain
);
@use "metallic-colors/scss" as metallic;         // already configured
```

| Setting | Default | What it is |
| --- | --- | --- |
| `$body-angle`, `$body` | `120deg`, 4 stops | The opaque body: the face, falling toward the flop. |
| `$band-angle`, `$band`, `$band-alpha` | `120deg`, 10 stops, `0.55` | The specular band, peaking in the sheen at 35%. |
| `$cross-angle`, `$cross`, `$cross-alpha` | `60deg`, 8 stops, `0.35` | The fainter crossing band. |
| `$flake`, `$flake-size` | fractal-noise SVG, `90px 90px` | The grain; `none` for no grain. |
| `$flop-drop`, `$flop-chroma` | `0.1`, `0.85` | How a derived flop sits below the face (oklab L) and how much chroma it keeps. |
| `$sweep-alpha`, `$sweep-angle`, `$sweep-duration`, `$sweep-easing` | `0.55`, `112deg`, `0.55s`, cubic-bezier | The hover sweep. |
| `$bevel` | five shadows | The chip's edge; `none` for a flat fill. |

Ladders are lists of `<stop> <p>` pairs, where `p` places each rung between the readings (−1 flop, 0 face, 0.5 mid, 1 sheen). The Sass and JavaScript versions produce identical colours; the test suite holds them to a channel step of each other, and `metallic.css` is the compiled Sass entry.

### The sweep

The swatch sweeps its sheen across itself when hovered, when a hovered ancestor carries `metallic-trigger` (a button wrapping the swatch), or when it carries `is-lit`. Add `metallic-flat` for a fill without the bevel. Reduced-motion preferences are honoured.

## How it works

1. The tone's readings — face, mid, sheen, and a flop — are converted to **oklab**, the space in which a straight line between two colours is what the eye sees as an even ramp. Missing readings are derived: `mid` halfway between face and sheen, `flop` a step darker and greyer than the face.
2. Three **ladders** describe the shape of the swatch as gradient stops of `[position, p]`, where `p` places each rung on the line through the readings: −1 the flop, 0 the face, +0.5 the mid, +1 the sheen. One set of ladders serves every tone, because the tone supplies the colours.
3. The ladders become three `linear-gradient`s — an opaque body at 120°, a half-transparent specular band at 120° that peaks in the sheen, and a fainter band at 60° crossing it — under a tiled fractal-noise flake. The stylesheet blends the flake soft-light and adds the bevel and the sweep.

The layered structure follows Anthony Orr's [Metallic Backgrounds](https://codepen.io/anthorr/pen/NrJMex): two half-transparent bands crossed over an opaque body, interfering where they meet. His ladders lighten and spin one hue; these place every rung on the tone's own photographed readings, so the band peaks in the real sheen rather than a paler copy of the face.

## Calibrate your own tones

A screen rendering is never the reference; the painted surface is. To read a deck of swatches off a printed card:

1. **Photograph** the card three times on a neutral surface near a window: square-on, turned part-way toward the light, and turned into the light so the swatches catch it. Keep some paper visible around every swatch.
2. **Locate** the centres of the four corner swatches of the grid in each photo (any image viewer that shows pixel coordinates).
3. **Sample** each photo. The page is perspective-rectified through those four points, then every swatch and the paper beside it is read:

   ```bash
   npm install sharp            # pixel access; ImageMagick's `magick` must be on PATH
   node scripts/sample-card.mjs face.jpg face.json 4 4 \
     "748,788 2480,820 2468,2820 752,2808" \
     "M24,M20,M16,M12,M23,M19,M15,M11,M22,M18,M14,M10,M21,M17,M13,M09"
   ```

   Repeat for the other two photos (and for each page, if the card spans more than one).
4. **Merge** the angles into tones. Every reading is normalised to the paper beside it, which cancels the exposure and colour cast of each photograph; a reading brighter than paper — a metallic into the light usually is — is scaled as a whole rather than clipped per channel, so it keeps its hue:

   ```bash
   node scripts/merge-readings.mjs face=face.json mid=mid.json sheen=sheen.json > tones.json
   ```

The result is an array of `{ code, face, mid, sheen }` ready to hand to `metallicSurface`.

## API

```ts
import {
  metallicSurface, metallicStyle, readings,
  DEFAULT_RECIPE, FLAKE,
  hexToOklab, oklabToHex, oklabToRgb, mixOklab,
  type Tone, type Recipe, type Ladder, type Surface, type Oklab,
} from "metallic-colors"
```

| Export | What it does |
| --- | --- |
| `metallicSurface(tone, recipe?)` | `{ background, layers, sweep }` — the `background-image` value (and its layers, top first) and the sheen for the sweep. |
| `metallicStyle(tone, recipe?)` | `{ backgroundImage, "--metallic-sheen" }` — the same as an inline-style object. |
| `readings(tone, recipe?)` | The four readings in oklab, the missing ones derived. |
| `DEFAULT_RECIPE` | The ladders, angles, alphas, flake and derivation constants. Pass a partial `Recipe` to override any of them. |
| `FLAKE` | The fractal-noise flake as a CSS `<image>`. |
| `Metallic` (`metallic-colors/react`) | A component: `tone`, `recipe?`, `as?`, plus any element props. |
| `PAINT_DECK`, `CLASSIC_METALS`, `PRESETS`, `presetByCode` (`metallic-colors/presets`) | The calibrated tones. |
| `metallic-colors/scss`, `metallic-colors/scss/metallic` | The Sass module (mixins and settings) and the Sass entry that emits `.metallic`. |
| `hexToOklab`, `oklabToHex`, `oklabToRgb`, `mixOklab` | The colour maths, if you want it. |

### Tuning a recipe

```js
metallicSurface(tone, {
  bandAngle: 135,        // where the light comes from
  bandAlpha: 0.7,        // a harder, brighter flash
  crossAlpha: 0.2,       // a calmer surface
  flake: null,           // no grain — keep it if you do this: background-size/blend lists in the stylesheet assume four layers
  flopDrop: 0.16,        // a deeper flop for a coarse flake
})
```

Ladders take `[stop %, p]` pairs; the default `band` rises from −0.35 at 0% to +1 (the full sheen) at 35% and falls back.

## Browser support

Anything that supports `background-blend-mode` and CSS custom properties — every current browser. Without the stylesheet the background still renders; it just has no grain, no bevel and no sweep.

## Development

```bash
npm install
npm test          # node --test, runs the TypeScript sources directly (Node 22.18+)
npm run build       # tsc → dist/
npm run build:css   # scss/metallic.scss → metallic.css
npm run build:site  # the demo as a static site, in site/ (what GitHub Pages deploys)
npm run demo        # build, then serve; open http://localhost:4173/demo/
```

## License

[MIT](./LICENSE) © [stevehoang.com](https://stevehoang.com)
