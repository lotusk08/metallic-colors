import { createElement, type CSSProperties, type ElementType, type HTMLAttributes } from "react"

import { metallicStyle, type Recipe, type Tone } from "./surface.ts"

export type MetallicProps = HTMLAttributes<HTMLElement> & {
  tone: Tone
  recipe?: Partial<Recipe>
  as?: ElementType
}

export function Metallic({ tone, recipe, as, className, style, ...rest }: MetallicProps) {
  return createElement(as ?? "span", {
    ...rest,
    className: className ? `metallic ${className}` : "metallic",
    style: { ...metallicStyle(tone, recipe), ...style } as CSSProperties,
  })
}
