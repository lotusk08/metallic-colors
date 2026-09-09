#!/usr/bin/env node
/**
 * Read a grid of printed swatches off a photograph.
 *
 *   node scripts/sample-card.mjs <photo> <out.json> <cols> <rows> "<corners>" "<codes>"
 *
 *   corners  centres of the four CORNER swatches in photo pixels, in the
 *            order top-left, top-right, bottom-right, bottom-left of the
 *            grid as you want it read:  "748,788 2480,820 2468,2820 752,2808"
 *   codes    one code per swatch, row-major, comma-separated
 *
 * The page is perspective-rectified through those four points (ImageMagick
 * `magick` must be on PATH), then each swatch is sampled from a box around
 * its centre, with the darkest and brightest fifth of the pixels dropped so
 * a label or a glint does not skew it. The paper around each swatch is read
 * too, so the readings can later be normalised to the card's own white.
 *
 * Needs `sharp` (npm i sharp) for pixel access.
 */
import { execFileSync } from "node:child_process"
import fs from "node:fs"

const [photo, out, colsS, rowsS, cornersS, codesS] = process.argv.slice(2)
if (!codesS) {
  console.error("usage: sample-card.mjs <photo> <out.json> <cols> <rows> \"<corners>\" \"<codes>\"")
  process.exit(1)
}
const { default: sharp } = await import("sharp")

const cols = Number(colsS)
const rows = Number(rowsS)
const corners = cornersS.trim().split(/\s+/).map((p) => p.split(",").map(Number))
const codes = codesS.split(",").map((s) => s.trim())
if (corners.length !== 4) throw new Error("four corners, please")
if (codes.length !== cols * rows) throw new Error(`need ${cols * rows} codes, got ${codes.length}`)

// Rectify so that swatch centres land on a P-pitch grid with an M margin.
const P = 300
const M = 220
const W = (cols - 1) * P + 2 * M
const H = (rows - 1) * P + 2 * M
const dst = [[M, M], [W - M, M], [W - M, H - M], [M, H - M]]
const mapping = corners.map((c, i) => `${c[0]},${c[1]} ${dst[i][0]},${dst[i][1]}`).join("  ")
const rect = out.replace(/\.json$/, "") + ".rect.png"
execFileSync("magick", [
  photo, "-define", `distort:viewport=${W}x${H}+0+0`,
  "-distort", "Perspective", mapping, "+repage", rect,
])

const { data, info } = await sharp(rect).raw().toBuffer({ resolveWithObject: true })
const ch = info.channels

/** Mean of the middle 60% of the pixels in a box, by luminance. */
const robust = (cx, cy, r) => {
  const px = []
  for (let y = Math.max(0, cy - r); y < Math.min(info.height, cy + r); y++)
    for (let x = Math.max(0, cx - r); x < Math.min(info.width, cx + r); x++) {
      const i = (y * info.width + x) * ch
      px.push([data[i], data[i + 1], data[i + 2]])
    }
  px.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]))
  const lo = Math.floor(px.length * 0.2)
  const hi = Math.ceil(px.length * 0.8)
  const s = [0, 0, 0]
  for (let k = lo; k < hi; k++) for (let c = 0; c < 3; c++) s[c] += px[k][c]
  return s.map((v) => v / (hi - lo))
}
const hex = (a) => "#" + a.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")

const readings = {}
for (let r = 0; r < rows; r++)
  for (let c = 0; c < cols; c++) {
    const cx = M + c * P
    const cy = M + r * P
    const rgb = robust(cx, cy, Math.round(P * 0.22))
    // Paper: the gaps toward neighbouring swatches, brightest half averaged
    // (a shadowed gap reads grey).
    const gaps = []
    if (c > 0) gaps.push(robust(cx - P / 2, cy, 12))
    if (c < cols - 1) gaps.push(robust(cx + P / 2, cy, 12))
    if (r > 0) gaps.push(robust(cx, cy - P / 2, 12))
    if (r < rows - 1) gaps.push(robust(cx, cy + P / 2, 12))
    gaps.sort((a, b) => b[0] + b[1] + b[2] - (a[0] + a[1] + a[2]))
    const keep = gaps.slice(0, Math.max(1, Math.ceil(gaps.length / 2)))
    const white = [0, 1, 2].map((i) => keep.reduce((s, g) => s + g[i], 0) / keep.length)
    readings[codes[r * cols + c]] = { rgb: hex(rgb), paper: hex(white) }
  }

fs.writeFileSync(out, JSON.stringify({ photo, rect, readings }, null, 1))
console.log(`${Object.keys(readings).length} swatches → ${out} (rectified page: ${rect})`)
