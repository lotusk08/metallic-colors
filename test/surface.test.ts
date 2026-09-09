import assert from "node:assert/strict"
import { test } from "node:test"

import { DEFAULT_RECIPE, metallicStyle, metallicSurface, readings } from "../src/surface.ts"
import { CLASSIC_METALS, PAINT_DECK, PRESETS, presetByCode } from "../src/presets.ts"

const gold = { face: "#ec9d00", mid: "#ffeb5e", sheen: "#fffd89" }

test("a surface is the flake over three gradients", () => {
  const s = metallicSurface(gold)
  assert.equal(s.layers.length, 4)
  assert.ok(s.layers[0].startsWith("url("))
  assert.equal((s.background.match(/linear-gradient\(/g) ?? []).length, 3)
  assert.equal(s.background, s.layers.join(", "))
})

test("the specular band peaks in the tone's real sheen, and the sweep is that sheen", () => {
  const s = metallicSurface(gold)
  assert.equal(s.sweep, "rgba(255, 253, 137, 0.55)")
  assert.ok(s.layers[1].includes("rgba(255, 253, 137, 0.55) 35%"))
})

test("the body starts near the face and ends toward the flop", () => {
  const s = metallicSurface({ face: "#527fb2", sheen: "#c5eeff" })
  const stops = s.layers[3].match(/rgb\([^)]+\)/g)!
  assert.equal(stops.length, 4)
  const lum = (rgb: string) => rgb.match(/\d+/g)!.map(Number).reduce((a, b) => a + b)
  assert.ok(lum(stops[0]) > lum(stops[3]), "darker at the far end")
})

test("mid and flop are derived when not given", () => {
  const r = readings({ face: "#527fb2", sheen: "#c5eeff" })
  assert.ok(r.mid.L > r.face.L && r.mid.L < r.sheen.L)
  assert.ok(Math.abs(r.flop.L - (r.face.L - DEFAULT_RECIPE.flopDrop)) < 1e-9)
  assert.ok(Math.hypot(r.flop.a, r.flop.b) < Math.hypot(r.face.a, r.face.b))
})

test("a recipe can drop the flake and turn the bands", () => {
  const s = metallicSurface(gold, { flake: null, bandAngle: 45, crossAngle: 135 })
  assert.equal(s.layers.length, 3)
  assert.ok(s.layers[0].startsWith("linear-gradient(45deg"))
  assert.ok(s.layers[1].startsWith("linear-gradient(135deg"))
})

test("a style object carries the background and the sweep variable", () => {
  const style = metallicStyle(gold)
  assert.equal(style.backgroundImage, metallicSurface(gold).background)
  assert.equal(style["--metallic-sheen"], "rgba(255, 253, 137, 0.55)")
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
