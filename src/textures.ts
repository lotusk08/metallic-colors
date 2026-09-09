export type Template = { size: number; body: string }

const num = (x: number): string => String(Number(x.toFixed(3)))

export const TEMPLATES = {
  flake: {
    size: 90,
    body: "<filter id='k'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' seed='7' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1 0 0 0 -0.74'/><feComponentTransfer><feFuncA type='linear' slope='3'/></feComponentTransfer></filter><rect width='90' height='90' filter='url(#k)'/>",
  },
  brushed: {
    size: 200,
    body: "<filter id='b' x='-50%' y='-50%' width='200%' height='200%' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='0.012 1.1' numOctaves='3' seed='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncR type='linear' slope='__SLOPE__' intercept='__INTERCEPT__'/><feFuncG type='linear' slope='__SLOPE__' intercept='__INTERCEPT__'/><feFuncB type='linear' slope='__SLOPE__' intercept='__INTERCEPT__'/></feComponentTransfer></filter><g transform='rotate(__ANGLE__ 100 100)'><rect x='-100' y='-100' width='400' height='400' filter='url(#b)'/></g>",
  },
  glints: {
    size: 64,
    body: "<filter id='s' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='1' seed='3' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.33 0.33 0.33 0 -__THRESHOLD__'/><feComponentTransfer><feFuncA type='linear' slope='__SLOPE__'/></feComponentTransfer></filter><rect width='64' height='64' filter='url(#s)'/>",
  },
  scratches: {
    size: 240,
    body: "<g opacity='__OPACITY__' stroke-linecap='round'><line x1='0' y1='143' x2='68' y2='196' stroke='#000' stroke-opacity='.45' stroke-width='1.0' transform='translate(0.6 0.9)'/><line x1='0' y1='143' x2='68' y2='196' stroke='#fff' stroke-opacity='.75' stroke-width='1.0'/><line x1='79' y1='145' x2='-59' y2='255' stroke='#000' stroke-opacity='.45' stroke-width='0.6' transform='translate(0.6 0.9)'/><line x1='79' y1='145' x2='-59' y2='255' stroke='#fff' stroke-opacity='.75' stroke-width='0.6'/><line x1='150' y1='221' x2='296' y2='256' stroke='#000' stroke-opacity='.45' stroke-width='0.6' transform='translate(0.6 0.9)'/><line x1='150' y1='221' x2='296' y2='256' stroke='#fff' stroke-opacity='.75' stroke-width='0.6'/><line x1='140' y1='33' x2='78' y2='40' stroke='#000' stroke-opacity='.45' stroke-width='1.0' transform='translate(0.6 0.9)'/><line x1='140' y1='33' x2='78' y2='40' stroke='#fff' stroke-opacity='.75' stroke-width='1.0'/><line x1='19' y1='236' x2='100' y2='345' stroke='#000' stroke-opacity='.45' stroke-width='0.7' transform='translate(0.6 0.9)'/><line x1='19' y1='236' x2='100' y2='345' stroke='#fff' stroke-opacity='.75' stroke-width='0.7'/><line x1='175' y1='37' x2='277' y2='39' stroke='#000' stroke-opacity='.45' stroke-width='0.5' transform='translate(0.6 0.9)'/><line x1='175' y1='37' x2='277' y2='39' stroke='#fff' stroke-opacity='.75' stroke-width='0.5'/><line x1='133' y1='217' x2='256' y2='284' stroke='#000' stroke-opacity='.45' stroke-width='1.0' transform='translate(0.6 0.9)'/><line x1='133' y1='217' x2='256' y2='284' stroke='#fff' stroke-opacity='.75' stroke-width='1.0'/><line x1='127' y1='198' x2='67' y2='239' stroke='#000' stroke-opacity='.45' stroke-width='0.9' transform='translate(0.6 0.9)'/><line x1='127' y1='198' x2='67' y2='239' stroke='#fff' stroke-opacity='.75' stroke-width='0.9'/><line x1='64' y1='6' x2='217' y2='115' stroke='#000' stroke-opacity='.45' stroke-width='0.8' transform='translate(0.6 0.9)'/><line x1='64' y1='6' x2='217' y2='115' stroke='#fff' stroke-opacity='.75' stroke-width='0.8'/><line x1='98' y1='120' x2='162' y2='239' stroke='#000' stroke-opacity='.45' stroke-width='0.8' transform='translate(0.6 0.9)'/><line x1='98' y1='120' x2='162' y2='239' stroke='#fff' stroke-opacity='.75' stroke-width='0.8'/><line x1='141' y1='65' x2='173' y2='114' stroke='#000' stroke-opacity='.45' stroke-width='0.6' transform='translate(0.6 0.9)'/><line x1='141' y1='65' x2='173' y2='114' stroke='#fff' stroke-opacity='.75' stroke-width='0.6'/><line x1='48' y1='17' x2='-49' y2='54' stroke='#000' stroke-opacity='.45' stroke-width='1.1' transform='translate(0.6 0.9)'/><line x1='48' y1='17' x2='-49' y2='54' stroke='#fff' stroke-opacity='.75' stroke-width='1.1'/><line x1='9' y1='35' x2='-87' y2='70' stroke='#000' stroke-opacity='.45' stroke-width='0.6' transform='translate(0.6 0.9)'/><line x1='9' y1='35' x2='-87' y2='70' stroke='#fff' stroke-opacity='.75' stroke-width='0.6'/><line x1='128' y1='216' x2='177' y2='257' stroke='#000' stroke-opacity='.45' stroke-width='0.7' transform='translate(0.6 0.9)'/><line x1='128' y1='216' x2='177' y2='257' stroke='#fff' stroke-opacity='.75' stroke-width='0.7'/><line x1='127' y1='65' x2='283' y2='91' stroke='#000' stroke-opacity='.45' stroke-width='0.9' transform='translate(0.6 0.9)'/><line x1='127' y1='65' x2='283' y2='91' stroke='#fff' stroke-opacity='.75' stroke-width='0.9'/><line x1='112' y1='199' x2='46' y2='275' stroke='#000' stroke-opacity='.45' stroke-width='0.6' transform='translate(0.6 0.9)'/><line x1='112' y1='199' x2='46' y2='275' stroke='#fff' stroke-opacity='.75' stroke-width='0.6'/><line x1='170' y1='225' x2='119' y2='264' stroke='#000' stroke-opacity='.45' stroke-width='0.7' transform='translate(0.6 0.9)'/><line x1='170' y1='225' x2='119' y2='264' stroke='#fff' stroke-opacity='.75' stroke-width='0.7'/><line x1='170' y1='72' x2='225' y2='92' stroke='#000' stroke-opacity='.45' stroke-width='1.0' transform='translate(0.6 0.9)'/><line x1='170' y1='72' x2='225' y2='92' stroke='#fff' stroke-opacity='.75' stroke-width='1.0'/></g>",
  },
} satisfies Record<string, Template>

export const svg = (size: number, body: string): string =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${body}</svg>`)}")`

export const render = (template: Template, values: Record<string, string>): string =>
  svg(template.size, Object.entries(values).reduce((body, [key, value]) => body.split(`__${key}__`).join(value), template.body))

export const flake = (): string => render(TEMPLATES.flake, {})

export const brushed = (angle: number, strength: number): string =>
  render(TEMPLATES.brushed, { SLOPE: num(1.8 * strength), INTERCEPT: num(0.5 - 0.9 * strength), ANGLE: num(angle) })

export const glints = (strength: number, threshold = 0.84): string =>
  render(TEMPLATES.glints, { THRESHOLD: num(threshold), SLOPE: num(strength / (1 - threshold)) })

export const scratches = (strength: number): string => render(TEMPLATES.scratches, { OPACITY: num(strength) })
