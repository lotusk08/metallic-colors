#!/usr/bin/env node
import fs from "node:fs"

const out = "site"
fs.rmSync(out, { recursive: true, force: true })
fs.mkdirSync(out, { recursive: true })
fs.cpSync("dist", `${out}/dist`, { recursive: true })
fs.copyFileSync("metallic.css", `${out}/metallic.css`)
const html = fs.readFileSync("demo/index.html", "utf8").replaceAll("../", "./")
fs.writeFileSync(`${out}/index.html`, html)
fs.writeFileSync(`${out}/.nojekyll`, "")
console.log(`site/ ready: ${fs.readdirSync(out).join(", ")}`)
