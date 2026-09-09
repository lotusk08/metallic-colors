#!/usr/bin/env node
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
