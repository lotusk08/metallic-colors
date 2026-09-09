import type { Tone } from "./surface.ts"

/** A calibrated tone: readings plus the name and code it goes by. */
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
 *
 * Names are Vietnamese, as printed on the card.
 */
export const NHU_DECK: PresetTone[] = [
  { code: "M01", name: "Bạc hơi ngà",               face: "#fff9e2", mid: "#fffdf0", sheen: "#fafff3" },
  { code: "M02", name: "Xám bạc nhạt",              face: "#eedfc1", mid: "#fffcef", sheen: "#fcfffa" },
  { code: "M03", name: "Xám bạc",                   face: "#a89c8d", mid: "#fffdf2", sheen: "#f9fffc" },
  { code: "M04", name: "Hồng phấn",                 face: "#f48a80", mid: "#ffbbb1", sheen: "#ffd7d2" },
  { code: "M05", name: "Hồng đậm",                  face: "#ff9b9d", mid: "#ffeaf4", sheen: "#ffeffb" },
  { code: "M06", name: "Tím sen nhạt",              face: "#ffa3b2", mid: "#ffeef7", sheen: "#f8f6ff" },
  { code: "M07", name: "Tím sen đậm",               face: "#e36089", mid: "#ffc1de", sheen: "#fceaff" },
  { code: "M08", name: "Tím dương",                 face: "#766c93", mid: "#d6d0ea", sheen: "#dfe9ff" },
  { code: "M09", name: "Tím violet",                face: "#c0a7c7", mid: "#f6f1ff", sheen: "#ecebff" },
  { code: "M10", name: "Xanh lá",                   face: "#8dd7ba", mid: "#dffff8", sheen: "#eafeff" },
  { code: "M11", name: "Xanh lá đậm",               face: "#24a391", mid: "#91fff0", sheen: "#bffdff" },
  { code: "M12", name: "Xanh dương",                face: "#527fb2", mid: "#acdeff", sheen: "#c5eeff" },
  { code: "M13", name: "Xanh dương đậm",            face: "#79bbf4", mid: "#bbfbff", sheen: "#baf4ff" },
  { code: "M14", name: "Xanh lá ánh vàng",          face: "#8e8a01", mid: "#faff5a", sheen: "#ffff8c" },
  { code: "M15", name: "Xanh lá ánh vàng nhạt",     face: "#566d02", mid: "#c1e737", sheen: "#f0ff86" },
  { code: "M16", name: "Xanh lá đậm",               face: "#4e4e12", mid: "#8e902a", sheen: "#eeff84" },
  { code: "M17", name: "Nhũ vàng",                  face: "#ec9d00", mid: "#ffeb5e", sheen: "#fffd89" },
  { code: "M18", name: "Đồng đỏ ánh vàng",          face: "#d56000", mid: "#ffa93e", sheen: "#ffe989" },
  { code: "M19", name: "Rêu ánh vàng",              face: "#875a03", mid: "#d7ab20", sheen: "#fff07c" },
  { code: "M20", name: "Rêu ánh đỏ",                face: "#78400c", mid: "#aa661e", sheen: "#ffc563" },
  { code: "M21", name: "Xanh rêu",                  face: "#6f5103", mid: "#e7c84b", sheen: "#ffef82" },
  { code: "M22", name: "Rêu ánh đỏ",                face: "#803c00", mid: "#a36110", sheen: "#fbbb62" },
  { code: "M23", name: "Đồng đỏ",                   face: "#a63200", mid: "#aa3b00", sheen: "#eb7c2d" },
  { code: "M24", name: "Đồng đỏ đậm",               face: "#742900", mid: "#792e00", sheen: "#9a4b09" },
]

export const presetByCode = (code: string): PresetTone | undefined =>
  NHU_DECK.find((t) => t.code === code.trim().toUpperCase())
