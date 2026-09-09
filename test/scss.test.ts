import assert from "node:assert/strict"
import fs from "node:fs"
import { test } from "node:test"
import * as sass from "sass"

import { FINISHES, metallicSurface } from "../src/surface.ts"

const gold = { face: "#ec9d00", mid: "#ffeb5e", sheen: "#fffd89" }
const blue = { face: "#527fb2", sheen: "#c5eeff" }

const compile = (source: string) =>
  sass.compileString(source, { loadPaths: ["scss"], style: "expanded" }).css

const rule = (css: string, name: string) => {
  const start = css.indexOf(`.${name} {`)
  return css.slice(start, css.indexOf("}", start))
}
const prop = (block: string, name: string) => block.match(new RegExp(`${name}: ([^;]+);`))![1]

test("the Sass surface is byte-identical to the JavaScript surface, for every finish", () => {
  const css = compile(`
    @use "index" as m;
    .gold { @include m.surface(${gold.face}, ${gold.sheen}, $mid: ${gold.mid}); }
    .blue { @include m.surface(${blue.face}, ${blue.sheen}); }
    ${Object.keys(FINISHES).map((f) => `.${f} { @include m.surface(${blue.face}, ${blue.sheen}, $finish: ${f}); }`).join("\n")}
  `)
  const cases: [string, typeof gold | typeof blue, object][] = [
    ["gold", gold, {}],
    ["blue", blue, {}],
    ...Object.entries(FINISHES).map(([f, r]) => [f, blue, r] as [string, typeof blue, object]),
  ]
  for (const [name, tone, recipe] of cases) {
    const js = metallicSurface(tone, recipe)
    const block = rule(css, name)
    assert.equal(prop(block, "background-image"), js.background, `${name} image`)
    assert.equal(prop(block, "background-size"), js.backgroundSize, `${name} size`)
    assert.equal(prop(block, "background-blend-mode"), js.backgroundBlendMode, `${name} blend`)
    assert.equal(prop(block, "--metallic-sheen"), js.sweep, `${name} sweep`)
  }
})

test("the Sass entry emits the .metallic class with the sweep", () => {
  const css = compile(`@use "metallic";`)
  assert.ok(css.includes(".metallic {"))
  assert.ok(css.includes("var(--metallic-sheen, rgba(255, 255, 255, 0.42))"))
  assert.ok(css.includes(".metallic:hover::after"))
})

test("settings are overridable at @use time", () => {
  const css = compile(`
    @use "index" as m with ($band-angle: 135deg, $grain: none, $glints: 0, $hot: 0);
    .x { @include m.surface(#ec9d00, #fffd89); }
  `)
  assert.ok(css.includes("linear-gradient(135deg"))
  assert.ok(!css.includes("url("))
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

test("an unknown finish is an error", () => {
  assert.throws(() => compile(`@use "index" as m; .x { @include m.surface(#5c7a99, #d5e6f5, $finish: velvet); }`), /unknown finish/)
})

test("metallic.css is the compiled Sass entry (npm run build:css)", () => {
  const committed = fs.readFileSync("metallic.css", "utf8").trim()
  const compiled = sass.compile("scss/metallic.scss", { style: "expanded" }).css.trim()
  assert.equal(committed, compiled)
})
