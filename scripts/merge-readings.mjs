#!/usr/bin/env node
/**
 * Turn per-photo readings into tones.
 *
 *   node scripts/merge-readings.mjs face=<a.json,b.json> mid=<c.json> sheen=<d.json> [paper=245] > tones.json
 *
 * Each named angle takes one or more files from sample-card.mjs (several
 * when a card spans pages). Every reading is divided by the paper beside
 * it and rescaled so paper = `paper` (default 245), which cancels the
 * exposure and colour cast of each photograph. A metallic turned into the
 * light outshines paper; such a reading is scaled down as a whole rather
 * than clipped per channel, so it keeps its hue instead of going white.
 */
import fs from "node:fs"

const args = Object.fromEntries(process.argv.slice(2).map((a) => a.split("=")))
const PAPER = Number(args.paper ?? 245)
const angles = ["face", "mid", "sheen"].filter((k) => args[k])
if (!angles.includes("face") || !angles.includes("sheen")) {
  console.error("need at least face=… and sheen=…")
  process.exit(1)
}

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const hex = (a) => "#" + a.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("")

const normalise = ({ rgb: c, paper: w }) => {
  const col = rgb(c)
  const wh = rgb(w)
  let n = col.map((v, i) => (v / wh[i]) * PAPER)
  const max = Math.max(...n)
  if (max > 255) n = n.map((v) => (v * 255) / max)
  return hex(n)
}

const perAngle = {}
for (const k of angles) {
  perAngle[k] = {}
  for (const file of args[k].split(",")) {
    const { readings } = JSON.parse(fs.readFileSync(file, "utf8"))
    for (const [code, r] of Object.entries(readings)) perAngle[k][code] = normalise(r)
  }
}

const tones = Object.keys(perAngle.face)
  .sort()
  .map((code) => {
    const t = { code, face: perAngle.face[code], sheen: perAngle.sheen[code] }
    if (perAngle.mid?.[code]) t.mid = perAngle.mid[code]
    return t
  })
process.stdout.write(JSON.stringify(tones, null, 1) + "\n")
