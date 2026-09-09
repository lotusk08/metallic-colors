import { hexToOklab, mixOklab, oklabToRgb, type Oklab } from "./oklab.ts"
import { TEMPLATES, brushed, flake, glints, scratches } from "./textures.ts"

export type Tone = {
  face: string
  sheen: string
  mid?: string
  flop?: string
}

export type Ladder = [stop: number, p: number][]

export type Grain = "brushed" | "flake" | "none"

export type Recipe = {
  bodyAngle: number
  body: Ladder
  bandAngle: number
  band: Ladder
  bandAlpha: number
  crossAngle: number
  cross: Ladder
  crossAlpha: number
  hot: number
  hotWidth: number
  gloss: number
  grain: Grain
  grainStrength: number
  grainBlend: string
  glints: number
  scratches: number
  flopDrop: number
  flopChroma: number
  sweepAlpha: number
}

const BRUSHED: Recipe = {
  bodyAngle: 120,
  body: [[0, -0.5], [35, -0.7], [65, -0.95], [100, -1]],
  bandAngle: 120,
  band: [
    [0, -0.5], [15, -0.2], [25, 0.2], [32, 0.7], [36, 1], [40, 0.75],
    [50, 0.35], [65, 0.05], [70, 0.05], [85, -0.2], [100, -0.5],
  ],
  bandAlpha: 0.55,
  crossAngle: 60,
  cross: [
    [0, -1], [10, -0.7], [25, -0.2], [40, -1],
    [60, -0.2], [70, -0.9], [90, -0.6], [100, -1],
  ],
  crossAlpha: 0.5,
  hot: 0.35,
  hotWidth: 2,
  gloss: 1,
  grain: "brushed",
  grainStrength: 0.85,
  grainBlend: "overlay",
  glints: 0.35,
  scratches: 0,
  flopDrop: 0.4,
  flopChroma: 0.9,
  sweepAlpha: 0.55,
}

export const FINISHES: Record<"brushed" | "polished" | "flake" | "satin" | "matte" | "worn", Recipe> = {
  brushed: BRUSHED,
  polished: { ...BRUSHED, grain: "none", glints: 0.2, hot: 0.45, flopDrop: 0.36 },
  flake: { ...BRUSHED, grain: "flake", grainStrength: 1, grainBlend: "soft-light", glints: 0.6, hot: 0.3 },
  satin: {
    ...BRUSHED,
    body: [[0, 0.15], [35, 0], [65, -0.35], [100, -0.6]],
    band: [
      [0, -0.35], [15, -0.05], [25, 0.25], [35, 1], [40, 0.7],
      [50, 0.3], [65, 0], [70, 0], [85, -0.2], [100, -0.35],
    ],
    bandAlpha: 0.55,
    cross: [
      [0, -0.6], [10, -0.4], [25, 0.05], [40, -0.6],
      [60, 0.05], [70, -0.5], [90, -0.4], [100, -0.6],
    ],
    crossAlpha: 0.35,
    hot: 0,
    gloss: 0.8,
    grain: "flake",
    grainStrength: 1,
    grainBlend: "soft-light",
    glints: 0,
    flopDrop: 0.1,
    flopChroma: 0.85,
  },
  matte: { ...BRUSHED, gloss: 0.2, grain: "flake", grainStrength: 1, grainBlend: "soft-light", glints: 0.15, crossAlpha: 0.35, flopDrop: 0.25 },
  worn: { ...BRUSHED, gloss: 0.7, scratches: 0.7, glints: 0.25, grainStrength: 0.7 },
}

export const DEFAULT_RECIPE: Recipe = FINISHES.brushed

export type Surface = {
  background: string
  layers: string[]
  backgroundSize: string
  backgroundBlendMode: string
  sweep: string
}

const num = (x: number): number => Number(x.toFixed(3))

const css = (c: Oklab, alpha?: number): string => {
  const [r, g, b] = oklabToRgb(c)
  return alpha === undefined
    ? `rgb(${r}, ${g}, ${b})`
    : `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function readings(tone: Tone, recipe: Partial<Recipe> = {}) {
  const r = { ...DEFAULT_RECIPE, ...recipe }
  const face = hexToOklab(tone.face)
  const sheen = hexToOklab(tone.sheen)
  const mid = tone.mid ? hexToOklab(tone.mid) : mixOklab(face, sheen, 0.5)
  const flop: Oklab = tone.flop
    ? hexToOklab(tone.flop)
    : { L: face.L - r.flopDrop, a: face.a * r.flopChroma, b: face.b * r.flopChroma }
  return { face, mid, sheen, flop }
}

export function metallicSurface(
  tone: Tone,
  recipe: Partial<Recipe> = {}
): Surface {
  const r = { ...DEFAULT_RECIPE, ...recipe }
  const { face, mid, sheen, flop } = readings(tone, r)
  const hot = num(r.hot * r.gloss)
  const bandAlpha = num(r.bandAlpha * (0.5 + 0.5 * r.gloss))
  const hotWidth = num(r.hotWidth * (2 - r.gloss))
  const sweepAlpha = num(r.sweepAlpha * (0.4 + 0.6 * r.gloss))

  const at = (p: number): Oklab =>
    p < 0
      ? mixOklab(face, flop, Math.min(1, -p))
      : p <= 0.5
        ? mixOklab(face, mid, p * 2)
        : mixOklab(mid, sheen, Math.min(1, (p - 0.5) * 2))

  const ladder = (rows: Ladder, alpha?: number) =>
    rows.map(([stop, p]) => `${css(at(p), alpha)} ${stop}%`).join(", ")

  const layers: string[] = []
  const sizes: string[] = []
  const blends: string[] = []
  const add = (layer: string, size = "auto", blend = "normal") => {
    layers.push(layer)
    sizes.push(size)
    blends.push(blend)
  }
  const tile = (size: number) => `${size}px ${size}px`

  if (r.glints > 0) add(glints(r.glints), tile(TEMPLATES.glints.size), "screen")
  if (r.scratches > 0) add(scratches(r.scratches), tile(TEMPLATES.scratches.size), "overlay")
  if (r.grain === "brushed") add(brushed(r.bandAngle - 90, r.grainStrength), tile(TEMPLATES.brushed.size), r.grainBlend)
  if (r.grain === "flake") add(flake(), tile(TEMPLATES.flake.size), r.grainBlend)
  if (hot > 0) {
    const peak = r.band.reduce((best, row) => (row[1] > best[1] ? row : best), r.band[0])[0]
    add(`linear-gradient(${r.bandAngle}deg, ${css(sheen, 0)} ${num(peak - hotWidth)}%, ${css(sheen, hot)} ${peak}%, ${css(sheen, 0)} ${num(peak + hotWidth)}%)`)
  }
  add(`linear-gradient(${r.bandAngle}deg, ${ladder(r.band, bandAlpha)})`)
  add(`linear-gradient(${r.crossAngle}deg, ${ladder(r.cross, r.crossAlpha)})`)
  add(`linear-gradient(${r.bodyAngle}deg, ${ladder(r.body)})`)

  return {
    background: layers.join(", "),
    layers,
    backgroundSize: sizes.join(", "),
    backgroundBlendMode: blends.join(", "),
    sweep: css(sheen, sweepAlpha),
  }
}

export function metallicStyle(
  tone: Tone,
  recipe: Partial<Recipe> = {}
): {
  backgroundImage: string
  backgroundSize: string
  backgroundBlendMode: string
  "--metallic-sheen": string
} {
  const s = metallicSurface(tone, recipe)
  return {
    backgroundImage: s.background,
    backgroundSize: s.backgroundSize,
    backgroundBlendMode: s.backgroundBlendMode,
    "--metallic-sheen": s.sweep,
  }
}
