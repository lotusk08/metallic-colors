import type { Tone } from "./surface.ts"

/** A named tone: readings plus the name and code it goes by. */
export type PresetTone = Tone & { code: string; name: string }

/**
 * Twenty-four metallic wall-paint tones, read from a printed colour card
 * photographed three times on 2026-09-09 — square-on (`face`), turned
 * part-way toward a window (`mid`), and turned into the light (`sheen`).
 * Every page was perspective-rectified before a swatch was sampled, and
 * every reading is normalised to the paper beside it (paper = #f5f5f5) so
 * the three exposures cancel; a reading brighter than the paper is scaled
 * as a whole, never clipped per channel, so it keeps its hue. See the
 * scripts in `scripts/` to calibrate a deck of your own.
 */
export const PAINT_DECK: PresetTone[] = [
  { code: "M01", name: "Ivory Pearl",      face: "#fff9e2", mid: "#fffdf0", sheen: "#fafff3" },
  { code: "M02", name: "Champagne Pearl",  face: "#eedfc1", mid: "#fffcef", sheen: "#fcfffa" },
  { code: "M03", name: "Warm Silver",      face: "#a89c8d", mid: "#fffdf2", sheen: "#f9fffc" },
  { code: "M04", name: "Coral Pearl",      face: "#f48a80", mid: "#ffbbb1", sheen: "#ffd7d2" },
  { code: "M05", name: "Rose Pearl",       face: "#ff9b9d", mid: "#ffeaf4", sheen: "#ffeffb" },
  { code: "M06", name: "Blush Pearl",      face: "#ffa3b2", mid: "#ffeef7", sheen: "#f8f6ff" },
  { code: "M07", name: "Fuchsia Pearl",    face: "#e36089", mid: "#ffc1de", sheen: "#fceaff" },
  { code: "M08", name: "Slate Violet",     face: "#766c93", mid: "#d6d0ea", sheen: "#dfe9ff" },
  { code: "M09", name: "Lilac Pearl",      face: "#c0a7c7", mid: "#f6f1ff", sheen: "#ecebff" },
  { code: "M10", name: "Mint Pearl",       face: "#8dd7ba", mid: "#dffff8", sheen: "#eafeff" },
  { code: "M11", name: "Teal Pearl",       face: "#24a391", mid: "#91fff0", sheen: "#bffdff" },
  { code: "M12", name: "Steel Blue",       face: "#527fb2", mid: "#acdeff", sheen: "#c5eeff" },
  { code: "M13", name: "Sky Pearl",        face: "#79bbf4", mid: "#bbfbff", sheen: "#baf4ff" },
  { code: "M14", name: "Golden Olive",     face: "#8e8a01", mid: "#faff5a", sheen: "#ffff8c" },
  { code: "M15", name: "Moss Gold",        face: "#566d02", mid: "#c1e737", sheen: "#f0ff86" },
  { code: "M16", name: "Deep Olive",       face: "#4e4e12", mid: "#8e902a", sheen: "#eeff84" },
  { code: "M17", name: "Gold",             face: "#ec9d00", mid: "#ffeb5e", sheen: "#fffd89" },
  { code: "M18", name: "Golden Copper",    face: "#d56000", mid: "#ffa93e", sheen: "#ffe989" },
  { code: "M19", name: "Antique Gold",     face: "#875a03", mid: "#d7ab20", sheen: "#fff07c" },
  { code: "M20", name: "Bronze",           face: "#78400c", mid: "#aa661e", sheen: "#ffc563" },
  { code: "M21", name: "Olive Bronze",     face: "#6f5103", mid: "#e7c84b", sheen: "#ffef82" },
  { code: "M22", name: "Copper Bronze",    face: "#803c00", mid: "#a36110", sheen: "#fbbb62" },
  { code: "M23", name: "Copper",           face: "#a63200", mid: "#aa3b00", sheen: "#eb7c2d" },
  { code: "M24", name: "Deep Copper",      face: "#742900", mid: "#792e00", sheen: "#9a4b09" },
]

/**
 * The familiar metals, authored rather than photographed: readings chosen
 * so that each renders the way the metal is remembered — chrome hard and
 * near-white at the flash, gunmetal with a deep flop, rose gold warm all
 * the way through. Use them as they are, or as starting points.
 */
export const CLASSIC_METALS: PresetTone[] = [
  { code: "silver",     name: "Silver",     face: "#b9bcc2", mid: "#dfe2e6", sheen: "#ffffff" },
  { code: "chrome",     name: "Chrome",     face: "#9da3aa", mid: "#e8ecf0", sheen: "#ffffff", flop: "#4c5259" },
  { code: "platinum",   name: "Platinum",   face: "#cfd2d6", mid: "#e9ebee", sheen: "#ffffff" },
  { code: "aluminium",  name: "Aluminium",  face: "#a8adb3", mid: "#d3d7db", sheen: "#f4f6f8" },
  { code: "titanium",   name: "Titanium",   face: "#8a8d93", mid: "#b8bbc0", sheen: "#e2e4e7" },
  { code: "pewter",     name: "Pewter",     face: "#8e8a84", mid: "#b8b4ad", sheen: "#e1ded8" },
  { code: "gunmetal",   name: "Gunmetal",   face: "#4a4f57", mid: "#7a8088", sheen: "#b8bec6", flop: "#23262b" },
  { code: "graphite",   name: "Graphite",   face: "#3a3c40", mid: "#63666b", sheen: "#9a9da3", flop: "#1c1d20" },
  { code: "white-gold", name: "White Gold", face: "#d6d2c4", mid: "#ebe8dd", sheen: "#fffdf6" },
  { code: "champagne",  name: "Champagne",  face: "#d9c39a", mid: "#efdfbd", sheen: "#fff8e6" },
  { code: "gold",       name: "Yellow Gold", face: "#d4a017", mid: "#f2d060", sheen: "#fff5a0" },
  { code: "brass",      name: "Brass",      face: "#b8912c", mid: "#dcbd5c", sheen: "#f7e79a" },
  { code: "rose-gold",  name: "Rose Gold",  face: "#c98a7e", mid: "#e8b8ad", sheen: "#ffe9e3" },
  { code: "copper",     name: "Copper",     face: "#b3562b", mid: "#d98858", sheen: "#ffc9a0" },
  { code: "bronze",     name: "Bronze",     face: "#8a5a2b", mid: "#b98a55", sheen: "#e6c791" },
  { code: "steel-blue", name: "Steel Blue", face: "#5c7a99", mid: "#93b1cc", sheen: "#d5e6f5" },
]

/** Every preset, the paint deck first. */
export const PRESETS: PresetTone[] = [...PAINT_DECK, ...CLASSIC_METALS]

/** A preset by code — "M17", "rose-gold" — case-insensitively. */
export const presetByCode = (code: string): PresetTone | undefined => {
  const key = code.trim().toLowerCase()
  return PRESETS.find((t) => t.code.toLowerCase() === key)
}
