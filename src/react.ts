import { createElement, type CSSProperties, type ElementType, type HTMLAttributes } from "react"

import { metallicStyle, type Recipe, type Tone } from "./surface.ts"

export type MetallicProps = HTMLAttributes<HTMLElement> & {
  tone: Tone
  recipe?: Partial<Recipe>
  /** The element to render. Defaults to a `span`. */
  as?: ElementType
}

/**
 * One tone as an element carrying the `metallic` class and its surface.
 * Import `metallic-colors/metallic.css` once for the flake blend, the bevel
 * and the hover sweep.
 *
 *     <Metallic tone={{ face: "#ec9d00", sheen: "#fffd89" }} className="w-24 h-24 rounded" />
 */
export function Metallic({ tone, recipe, as, className, style, ...rest }: MetallicProps) {
  return createElement(as ?? "span", {
    ...rest,
    className: className ? `metallic ${className}` : "metallic",
    style: { ...metallicStyle(tone, recipe), ...style } as CSSProperties,
  })
}
