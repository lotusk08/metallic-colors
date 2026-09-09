# metallic-colors

Metallic surfaces in CSS or Sass — layered gradients and procedural textures, calibrated from photographed readings of the real thing.

**[Live demo](https://lotusk08.github.io/metallic-colors/)**

A metallic has no one colour. Turn a painted sample in the light and it runs from a dark flop, through the colour it shows face-on, to the bright specular of the flake itself: a gold that flashes lemon, a blue that flashes cyan, a pearl that goes almost white. A flat hex cannot say that, and a lighter copy of the face is not what the flake does. This package treats a tone as a set of **readings** of one surface at different angles and lays them out as light would — a dark body, a specular band that peaks in the tone's real sheen with a hot line on its crest, a fainter band crossing it so the two interfere the way brushed metal does, and a coating on top: brushed grain or flake, glints, scratches, from mirror-bright to matte.

- Zero dependencies. TypeScript, ESM, small.
- Works anywhere CSS does: three background properties plus one small stylesheet.
- A Sass-only version of the same recipe — mixins, finishes and `!default` settings, no JavaScript — that produces byte-identical output.
- Optional React wrapper.
- Six finishes, forty calibrated tones (a photographed paint deck and the classic metals), and the scripts to calibrate your own.

## Install

```bash
npm install metallic-colors
```

Or straight from GitHub (it builds on install):

```bash
npm install github:lotusk08/metallic-colors
```

## Use

Import the stylesheet once. It supplies the bevel and the sweep of light that crosses the surface on hover, in the tone's own sheen.

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
el.style.backgroundSize = s.backgroundSize
el.style.backgroundBlendMode = s.backgroundBlendMode
el.style.setProperty("--metallic-sheen", s.sweep)
```

`face` and `sheen` are required; `mid` (part-turned) and `flop` (turned away from the light) are derived when you don't have them. `metallicStyle(tone)` returns the same four properties as an object ready to spread onto a style.

### React

```jsx
import "metallic-colors/metallic.css"
import { Metallic } from "metallic-colors/react"

<Metallic tone={{ face: "#527fb2", sheen: "#c5eeff" }} className="h-24 w-24 rounded-lg" />
```

`Metallic` renders a `span` (or `as="div"`, etc.) carrying the `metallic` class and the surface as inline style. Size and shape it with your own classes; the class does not set dimensions.

### Finishes

```js
import { metallicSurface, FINISHES } from "metallic-colors"

metallicSurface(gold)                                   // brushed, the default
metallicSurface(gold, FINISHES.polished)
metallicSurface(gold, { ...FINISHES.worn, bandAngle: 135 })
```

| Finish | Coating |
| --- | --- |
| `brushed` | Brushed grain along the sheen, glints, a hot line on the highlight. The default. |
| `polished` | No grain — a smooth, near-mirror surface with a brighter hot line. |
| `flake` | Isotropic metallic flake and stronger glints — effect paint. |
| `satin` | The soft, low-contrast look: a wide band, no hot line, a shallow flop. |
| `matte` | Gloss turned down: a broad dim highlight, flake grain, few glints. |
| `worn` | Brushed, scratched, a little duller. |

A finish is just a full `Recipe`; spread one and override what you like.

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

The same recipe in Sass alone, for a project with no JavaScript in its styling. Mixing happens in oklab through `color.mix($method: oklab)`, so it needs Dart Sass 1.79 or newer. The output is byte-identical to the JavaScript version; the test suite checks every finish.

```scss
@use "metallic-colors/scss/metallic";            // emits the .metallic class
@use "metallic-colors/scss" as metallic;         // the mixins, finishes and settings

.gold {
  @include metallic.surface(#ec9d00, #fffd89, $mid: #ffeb5e);
}
.old-gold {
  @include metallic.surface(#ec9d00, #fffd89, $mid: #ffeb5e, $finish: worn);
}
```

With a bundler, point Sass at `node_modules` (`loadPaths`) or use the `pkg:` importer: `@use "pkg:metallic-colors/scss"`.

`surface($face, $sheen, $mid: null, $flop: null, $finish: null)` writes `background-image`, `background-size`, `background-blend-mode` and `--metallic-sheen`; the element still needs the `metallic` class, or `@include metallic.base` on its own selector. `surface-background(...)` and `surface-sweep(...)` return the values if you would rather place them yourself.

Every setting is a `!default`, overridable at `@use` time. Sass configures a module only on its first load, so put the `with` block on whichever of the two you load first — the class entry forwards the settings:

```scss
@use "metallic-colors/scss/metallic" with (
  $gloss: 0.6,           // from matte (0) to mirror (1)
  $scratches: 0.5,       // worn
  $band-angle: 135deg,   // where the light comes from
  $grain: flake,         // brushed, flake or none
);
@use "metallic-colors/scss" as metallic;         // already configured
```

| Setting | Default | What it is |
| --- | --- | --- |
| `$gloss` | `1` | The coating's shine: scales the hot line, the band, the sweep, and widens the highlight as it falls. |
| `$grain`, `$grain-strength`, `$grain-blend` | `brushed`, `0.2`, `overlay` | The grain: `brushed` streaks along the sheen, isotropic `flake`, or `none`. |
| `$glints` | `0.35` | Sparse bright points from the flake; `0` for none. |
| `$scratches` | `0` | Hairline scratches along the grain; `0` for none. |
| `$hot`, `$hot-width` | `0.05`, `2%` | The hot line on the crest of the highlight, and its half-width. |
| `$body-angle`, `$body` | `120deg`, 4 stops | The opaque body: sunk toward the flop. |
| `$band-angle`, `$band`, `$band-alpha` | `120deg`, 11 stops, `0.8` | The specular band, peaking in the sheen at 36%. |
| `$cross-angle`, `$cross`, `$cross-alpha` | `60deg`, 8 stops, `0.7` | The darker crossing band. |
| `$flop-drop`, `$flop-chroma` | `0.25`, `0.9` | How a derived flop sits below the face (oklab L) and how much chroma it keeps. |
| `$sweep-alpha`, `$sweep-angle`, `$sweep-duration`, `$sweep-easing` | `0.65`, `112deg`, `0.55s`, cubic-bezier | The hover sweep. |
| `$bevel` | five shadows | The chip's edge; `none` for a flat fill. |
| `$finishes` | six maps | The finishes as overrides of the settings above; add your own. |

Ladders are lists of `<stop> <p>` pairs, where `p` places each rung between the readings (−1 flop, 0 face, 0.5 mid, 1 sheen).

### The sweep

The surface sweeps its sheen across itself when hovered, when a hovered ancestor carries `metallic-trigger` (a button wrapping the swatch), or when it carries `is-lit`. Add `metallic-flat` for a fill without the bevel. Reduced-motion preferences are honoured.

## How it works

1. The tone's readings — face, mid, sheen, and a flop — are converted to **oklab**, the space in which a straight line between two colours is what the eye sees as an even ramp. Missing readings are derived: `mid` halfway between face and sheen, `flop` a step darker and greyer than the face.
2. Three **ladders** describe the shape of the surface as gradient stops of `[position, p]`, where `p` places each rung on the line through the readings: −1 the flop, 0 the face, +0.5 the mid, +1 the sheen. One set of ladders serves every tone, because the tone supplies the colours.
3. The ladders become `linear-gradient`s — a body sunk toward the flop at 120°, a half-transparent specular band at 120° that peaks in the sheen, a hot line on that crest, and a darker band at 60° crossing it — under the **coating**: procedural SVG textures tiled over everything. Brushed grain is stretched noise rotated along the sheen and blended `overlay`; flake is isotropic noise blended `soft-light`; glints are thresholded noise blended `screen`; scratches are drawn lines. **Gloss** scales the hot line, the band and the sweep, and widens the highlight as it drops toward matte.

The layered structure follows Anthony Orr's [Metallic Backgrounds](https://codepen.io/anthorr/pen/NrJMex): two half-transparent bands crossed over a dark body, interfering where they meet. His ladders lighten and spin one hue; these place every rung on the tone's own photographed readings, so the band peaks in the real sheen rather than a paler copy of the face.

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
  FINISHES, DEFAULT_RECIPE,
  brushed, flake, glints, scratches,
  hexToOklab, oklabToHex, oklabToRgb, mixOklab,
  type Tone, type Recipe, type Ladder, type Grain, type Surface, type Oklab,
} from "metallic-colors"
```

| Export | What it does |
| --- | --- |
| `metallicSurface(tone, recipe?)` | `{ background, layers, backgroundSize, backgroundBlendMode, sweep }` — the `background-image` value (and its layers, top first), the size and blend lists that go with it, and the sheen for the sweep. |
| `metallicStyle(tone, recipe?)` | `{ backgroundImage, backgroundSize, backgroundBlendMode, "--metallic-sheen" }` — the same as an inline-style object. |
| `readings(tone, recipe?)` | The four readings in oklab, the missing ones derived. |
| `FINISHES`, `DEFAULT_RECIPE` | The six finishes as full recipes; the default is `FINISHES.brushed`. Pass a partial `Recipe` to override anything. |
| `brushed(angle, strength)`, `flake()`, `glints(strength)`, `scratches(strength, angle)` | The textures as CSS `<image>` values, if you want them on their own. |
| `Metallic` (`metallic-colors/react`) | A component: `tone`, `recipe?`, `as?`, plus any element props. |
| `PAINT_DECK`, `CLASSIC_METALS`, `PRESETS`, `presetByCode` (`metallic-colors/presets`) | The calibrated tones. |
| `metallic-colors/scss`, `metallic-colors/scss/metallic` | The Sass module (mixins, finishes and settings) and the Sass entry that emits `.metallic`. |
| `hexToOklab`, `oklabToHex`, `oklabToRgb`, `mixOklab` | The colour maths, if you want it. |

### Recipe

| Key | Default | What it is |
| --- | --- | --- |
| `gloss` | `1` | From matte (0) to mirror (1). |
| `grain`, `grainStrength`, `grainBlend` | `"brushed"`, `0.2`, `"overlay"` | The grain, its depth, its blend mode. |
| `glints` | `0.35` | Bright points; `0` for none. |
| `scratches` | `0` | Hairline scratches along the grain; `0` for none. |
| `hot`, `hotWidth` | `0.05`, `2` | The hot line's opacity and half-width in %. |
| `bodyAngle`, `body` | `120`, 4 stops | The body. |
| `bandAngle`, `band`, `bandAlpha` | `120`, 11 stops, `0.8` | The specular band. |
| `crossAngle`, `cross`, `crossAlpha` | `60`, 8 stops, `0.7` | The crossing band. |
| `flopDrop`, `flopChroma` | `0.25`, `0.9` | The derived flop. |
| `sweepAlpha` | `0.65` | The hover sweep's opacity. |

## Browser support

Anything that supports `background-blend-mode` and CSS custom properties — every current browser. Without the stylesheet the surface still renders; it just has no bevel and no sweep.

## Development

```bash
npm install
npm test              # node --test, runs the TypeScript sources directly (Node 22.18+)
npm run build         # tsc → dist/
npm run build:textures  # src/textures.ts → scss/_textures.scss (the same SVG templates for Sass)
npm run build:css     # scss/metallic.scss → metallic.css
npm run build:site    # the demo as a static site, in site/ (what GitHub Pages deploys)
npm run demo          # build, then serve; open http://localhost:4173/demo/
```

## License

[MIT](./LICENSE) © [stevehoang.com](https://stevehoang.com)
