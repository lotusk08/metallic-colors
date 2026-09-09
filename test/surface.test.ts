import assert from "node:assert/strict"
import { test } from "node:test"

import { DEFAULT_RECIPE, FINISHES, metallicStyle, metallicSurface, readings } from "../src/surface.ts"
import { CLASSIC_METALS, PAINT_DECK, PRESETS, presetByCode } from "../src/presets.ts"

const gold = { face: "#ec9d00", mid: "#ffeb5e", sheen: "#fffd89" }

test("the brushed default: glints, brushed grain, hot line, band, cross, body", () => {
  const s = metallicSurface(gold)
  assert.equal(s.layers.length, 6)
  assert.ok(s.layers[0].startsWith("url(") && s.layers[1].startsWith("url("))
  assert.equal((s.background.match(/linear-gradient\(/g) ?? []).length, 4)
  assert.equal(s.backgroundBlendMode, "screen, overlay, normal, normal, normal, normal")
  assert.equal(s.backgroundSize, "64px 64px, 200px 200px, auto, auto, auto, auto")
  assert.equal(s.background, s.layers.join(", "))
})

test("the hot line sits on the band's peak, in the sheen, and the sweep is the sheen", () => {
  const s = metallicSurface(gold)
  assert.ok(s.layers[2].includes("rgba(255, 253, 137, 0.05) 36%"))
  assert.ok(s.layers[3].includes("rgba(255, 253, 137, 0.8) 36%"))
  assert.equal(s.sweep, "rgba(255, 253, 137, 0.65)")
})

test("the finishes", () => {
  assert.equal(DEFAULT_RECIPE, FINISHES.brushed)
  assert.equal(Object.keys(FINISHES).length, 6)
  assert.equal(metallicSurface(gold, FINISHES.worn).layers.length, 7)
  assert.equal(metallicSurface(gold, FINISHES.worn).backgroundBlendMode.split(", ")[1], "overlay")
  assert.equal(metallicSurface(gold, FINISHES.satin).layers.length, 4)
  assert.equal(metallicSurface(gold, FINISHES.polished).layers.length, 5)
  assert.equal(metallicSurface(gold, FINISHES.flake).backgroundBlendMode.split(", ")[1], "soft-light")
  assert.equal(metallicSurface(gold, FINISHES.satin).backgroundBlendMode, "soft-light, normal, normal, normal")
})

test("the body sinks from the face toward the flop", () => {
  const s = metallicSurface({ face: "#527fb2", sheen: "#c5eeff" })
  const stops = s.layers[5].match(/rgb\([^)]+\)/g)!
  assert.equal(stops.length, 4)
  const lum = (rgb: string) => rgb.match(/\d+/g)!.map(Number).reduce((a, b) => a + b)
  assert.ok(lum(stops[0]) > lum(stops[3]))
})

test("mid and flop are derived when not given", () => {
  const r = readings({ face: "#527fb2", sheen: "#c5eeff" })
  assert.ok(r.mid.L > r.face.L && r.mid.L < r.sheen.L)
  assert.ok(Math.abs(r.flop.L - (r.face.L - DEFAULT_RECIPE.flopDrop)) < 1e-9)
  assert.ok(Math.hypot(r.flop.a, r.flop.b) < Math.hypot(r.face.a, r.face.b))
})

test("a recipe can drop the textures and turn the bands", () => {
  const s = metallicSurface(gold, { grain: "none", glints: 0, hot: 0, bandAngle: 45, crossAngle: 135 })
  assert.equal(s.layers.length, 3)
  assert.ok(s.layers[0].startsWith("linear-gradient(45deg"))
  assert.ok(s.layers[1].startsWith("linear-gradient(135deg"))
  assert.equal(s.backgroundBlendMode, "normal, normal, normal")
})

test("a style object carries the four properties", () => {
  const style = metallicStyle(gold)
  const s = metallicSurface(gold)
  assert.equal(style.backgroundImage, s.background)
  assert.equal(style.backgroundSize, s.backgroundSize)
  assert.equal(style.backgroundBlendMode, s.backgroundBlendMode)
  assert.equal(style["--metallic-sheen"], s.sweep)
})

test("a bad hex is refused, not rendered black", () => {
  assert.throws(() => metallicSurface({ face: "gold", sheen: "#fffd89" }), /hex/)
})

test("the presets: a photographed deck of 24, sixteen classic metals, unique codes", () => {
  assert.equal(PAINT_DECK.length, 24)
  assert.equal(CLASSIC_METALS.length, 16)
  assert.equal(PRESETS.length, 40)
  assert.equal(new Set(PRESETS.map((t) => t.code.toLowerCase())).size, PRESETS.length)
  for (const t of PRESETS) {
    for (const k of ["face", "mid", "sheen"] as const) {
      assert.match(t[k]!, /^#[0-9a-f]{6}$/, `${t.code} ${k}`)
    }
    assert.ok(t.name.length > 0, `${t.code} name`)
  }
  assert.equal(presetByCode("m17")?.name, "Gold")
  assert.equal(presetByCode("Rose-Gold")?.name, "Rose Gold")
  assert.equal(presetByCode("M99"), undefined)
})

test("gloss scales the specular: matte drops the hot line and dims the sweep", () => {
  const glossy = metallicSurface(gold, { gloss: 1 })
  const dull = metallicSurface(gold, { gloss: 0 })
  assert.equal(glossy.layers.length, 6)
  assert.equal(dull.layers.length, 5)
  assert.equal(dull.sweep, "rgba(255, 253, 137, 0.26)")
  assert.ok(dull.layers[2].includes("rgba(255, 253, 137, 0.4)"))
  const half = metallicSurface(gold, { gloss: 0.8 })
  assert.ok(half.layers[2].includes("rgba(255, 253, 137, 0.04) 36%"))
  assert.ok(half.layers[2].includes(" 33.6%"))
})

test("scratches follow the grain and take the band angle", () => {
  const s = metallicSurface(gold, { scratches: 0.5, bandAngle: 150 })
  assert.equal(s.layers.length, 7)
  assert.ok(decodeURIComponent(s.layers[1]).includes("rotate(60 160 160)"))
  assert.ok(decodeURIComponent(s.layers[1]).includes("opacity='0.5'"))
})
