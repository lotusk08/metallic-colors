import assert from "node:assert/strict"
import { test } from "node:test"
import * as sass from "sass"

import { metallicSurface } from "../src/surface.ts"

const gold = { face: "#ec9d00", mid: "#ffeb5e", sheen: "#fffd89" }
const blue = { face: "#527fb2", sheen: "#c5eeff" }

const compile = (source: string) =>
  sass.compileString(source, { loadPaths: ["scss"], style: "expanded" }).css

const colours = (css: string) =>
  [...css.matchAll(/rgba?\(([^)]+)\)/g)].map((m) =>
    m[1].split(/[\s,/]+/).filter(Boolean).map(Number)
  )

const close = (a: number[][], b: number[][], what: string) => {
  assert.equal(a.length, b.length, `${what}: colour count`)
  a.forEach((c, i) =>
    c.forEach((v, k) =>
      assert.ok(Math.abs(v - b[i][k]) <= 1, `${what}: colour ${i} channel ${k}: ${v} vs ${b[i][k]}`)
    )
  )
}

test("the Sass surface matches the JavaScript surface to a channel step", () => {
  const css = compile(`
    @use "index" as m;
    .gold { @include m.surface(${gold.face}, ${gold.sheen}, $mid: ${gold.mid}); }
    .blue { @include m.surface(${blue.face}, ${blue.sheen}); }
  `)
  const rule = (name: string) => css.slice(css.indexOf(`.${name}`), css.indexOf("}", css.indexOf(`.${name}`)))
  for (const [name, tone] of [["gold", gold], ["blue", blue]] as const) {
    const js = metallicSurface(tone)
    const block = rule(name)
    const bg = block.slice(block.indexOf("background-image:"), block.indexOf("--metallic-sheen"))
    assert.ok(bg.includes("url("), `${name}: flake present`)
    assert.equal((bg.match(/linear-gradient\(/g) ?? []).length, 3, `${name}: three gradients`)
    close(colours(bg), colours(js.background), `${name} background`)
    close(colours(block.slice(block.indexOf("--metallic-sheen"))), colours(js.sweep), `${name} sweep`)
  }
})

test("the Sass entry emits the .metallic class with the sweep", () => {
  const css = compile(`@use "metallic";`)
  assert.ok(css.includes(".metallic {"))
  assert.ok(css.includes("background-blend-mode: soft-light, normal, normal, normal"))
  assert.ok(css.includes("var(--metallic-sheen, rgba(255, 255, 255, 0.42))"))
  assert.ok(css.includes(".metallic:hover::after"))
})

test("settings are overridable at @use time", () => {
  const css = compile(`
    @use "index" as m with ($band-angle: 135deg, $flake: none);
    .x { @include m.surface(#ec9d00, #fffd89); }
  `)
  assert.ok(css.includes("linear-gradient(135deg"))
  assert.ok(!css.includes("url("))
})

test("metallic.css is the compiled Sass entry (npm run build:css)", async () => {
  const fs = await import("node:fs")
  const committed = fs.readFileSync("metallic.css", "utf8").trim()
  const compiled = sass.compile("scss/metallic.scss", { style: "expanded" }).css.trim()
  assert.equal(committed, compiled)
})

test("the class entry takes the configuration and the module follows already configured", () => {
  const css = compile(`
    @use "metallic" with ($band-angle: 135deg);
    @use "index" as m;
    .x { @include m.surface(#5c7a99, #d5e6f5); }
  `)
  assert.ok(css.includes(".metallic {"))
  assert.ok(css.includes("linear-gradient(135deg"))
})
