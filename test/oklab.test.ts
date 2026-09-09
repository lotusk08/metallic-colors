import assert from "node:assert/strict"
import { test } from "node:test"

import { hexToOklab, mixOklab, oklabToHex } from "../src/oklab.ts"

test("hex survives a round trip through oklab", () => {
  for (const hex of ["#000000", "#ffffff", "#ec9d00", "#527fb2", "#a89c8d", "#742900"]) {
    assert.equal(oklabToHex(hexToOklab(hex)), hex)
  }
})

test("mixing halfway lands between the two in lightness", () => {
  const a = hexToOklab("#742900")
  const b = hexToOklab("#fffd89")
  const m = mixOklab(a, b, 0.5)
  assert.ok(m.L > a.L && m.L < b.L)
  assert.ok(Math.abs(m.L - (a.L + b.L) / 2) < 1e-12)
})

test("a hash is optional", () => {
  assert.deepEqual(hexToOklab("ec9d00"), hexToOklab("#ec9d00"))
})
