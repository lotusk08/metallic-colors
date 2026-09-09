import { hexToOklab, mixOklab, oklabToRgb, type Oklab } from "./oklab.ts"

export type Tone = {
  face: string
  sheen: string
  mid?: string
  flop?: string
}

export type Ladder = [stop: number, p: number][]

export type Recipe = {
  bodyAngle: number
  body: Ladder
  bandAngle: number
  band: Ladder
  bandAlpha: number
  crossAngle: number
  cross: Ladder
  crossAlpha: number
  flake: string | null
  flopDrop: number
  flopChroma: number
  sweepAlpha: number
}

export const FLAKE =
  "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='90'%20height='90'%3E%3Cfilter%20id='k'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.9'%20numOctaves='1'%20seed='7'%20stitchTiles='stitch'/%3E%3CfeColorMatrix%20type='matrix'%20values='0%200%200%200%201%200%200%200%200%201%200%200%200%200%201%201%200%200%200%20-0.74'/%3E%3CfeComponentTransfer%3E%3CfeFuncA%20type='linear'%20slope='3'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect%20width='90'%20height='90'%20filter='url%28%23k%29'/%3E%3C/svg%3E\")"

export const DEFAULT_RECIPE: Recipe = {
  bodyAngle: 120,
  body: [[0, 0.15], [35, 0], [65, -0.35], [100, -0.6]],
  bandAngle: 120,
  band: [
    [0, -0.35], [15, -0.05], [25, 0.25], [35, 1], [40, 0.7],
    [50, 0.3], [65, 0], [70, 0], [85, -0.2], [100, -0.35],
  ],
  bandAlpha: 0.55,
  crossAngle: 60,
  cross: [
    [0, -0.6], [10, -0.4], [25, 0.05], [40, -0.6],
    [60, 0.05], [70, -0.5], [90, -0.4], [100, -0.6],
  ],
  crossAlpha: 0.35,
  flake: FLAKE,
  flopDrop: 0.1,
  flopChroma: 0.85,
  sweepAlpha: 0.55,
}

export type Surface = {
  background: string
  layers: string[]
  sweep: string
}

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

  const at = (p: number): Oklab =>
    p < 0
      ? mixOklab(face, flop, Math.min(1, -p))
      : p <= 0.5
        ? mixOklab(face, mid, p * 2)
        : mixOklab(mid, sheen, Math.min(1, (p - 0.5) * 2))

  const ladder = (rows: Ladder, alpha?: number) =>
    rows.map(([stop, p]) => `${css(at(p), alpha)} ${stop}%`).join(", ")

  const layers = [
    ...(r.flake ? [r.flake] : []),
    `linear-gradient(${r.bandAngle}deg, ${ladder(r.band, r.bandAlpha)})`,
    `linear-gradient(${r.crossAngle}deg, ${ladder(r.cross, r.crossAlpha)})`,
    `linear-gradient(${r.bodyAngle}deg, ${ladder(r.body)})`,
  ]

  return {
    background: layers.join(", "),
    layers,
    sweep: css(sheen, r.sweepAlpha),
  }
}

export function metallicStyle(
  tone: Tone,
  recipe: Partial<Recipe> = {}
): { backgroundImage: string; "--metallic-sheen": string } {
  const s = metallicSurface(tone, recipe)
  return { backgroundImage: s.background, "--metallic-sheen": s.sweep }
}
