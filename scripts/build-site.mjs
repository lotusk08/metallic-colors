#!/usr/bin/env node
import fs from "node:fs"

const { version } = JSON.parse(fs.readFileSync("package.json", "utf8"))
const out = "site"
fs.rmSync(out, { recursive: true, force: true })
fs.mkdirSync(`${out}/dist`, { recursive: true })
fs.cpSync("dist", `${out}/dist/${version}`, { recursive: true })
fs.copyFileSync("metallic.css", `${out}/metallic.css`)
const html = fs
  .readFileSync("demo/index.html", "utf8")
  .replaceAll("../dist/", `./dist/${version}/`)
  .replaceAll("../metallic.css", `./metallic.css?v=${version}`)
fs.writeFileSync(`${out}/index.html`, html)
fs.writeFileSync(`${out}/.nojekyll`, "")
console.log(`site/ ready (${version}): ${fs.readdirSync(out).join(", ")}`)
