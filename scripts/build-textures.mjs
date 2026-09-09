#!/usr/bin/env node
import fs from "node:fs"
import { TEMPLATES, svg } from "../src/textures.ts"

const sass = (name, values) => {
  const t = TEMPLATES[name]
  const url = svg(t.size, t.body)
  return Object.entries(values).reduce((s, [key, value]) => s.split(encodeURIComponent(`__${key}__`)).join(value), url)
}

fs.writeFileSync("scss/_textures.scss", `@use "sass:math";

$flake-size: ${TEMPLATES.flake.size}px;
$brush-size: ${TEMPLATES.brushed.size}px;
$glint-size: ${TEMPLATES.glints.size}px;
$scratch-size: ${TEMPLATES.scratches.size}px;

@function round3($x) {
  @return math.div(math.round($x * 1000), 1000);
}

@function flake() {
  @return ${sass("flake", {})};
}

@function brushed($angle, $strength) {
  $deg: round3(math.div($angle, 1deg));
  $slope: round3(1.8 * $strength);
  $intercept: round3(0.5 - 0.9 * $strength);
  @return ${sass("brushed", { SLOPE: "#{$slope}", INTERCEPT: "#{$intercept}", ANGLE: "#{$deg}" })};
}

@function glints($strength, $threshold: 0.84) {
  $slope: round3(math.div($strength, 1 - $threshold));
  @return ${sass("glints", { THRESHOLD: "#{round3($threshold)}", SLOPE: "#{$slope}" })};
}

@function scratches($strength) {
  @return ${sass("scratches", { OPACITY: "#{round3($strength)}" })};
}
`)
console.log("scss/_textures.scss written")
