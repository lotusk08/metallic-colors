# Changelog

## 1.0.1 — 2026-09-09

Documentation: badges, changelog, npm link in the demo. No code changes.

## 1.0.0 — 2026-09-09

First release on npm.

- `metallicSurface` and `metallicStyle`: a tone's face, mid, sheen and flop readings, mixed in oklab, laid out as a sunk body, a specular band peaking in the real sheen with a hot line on its crest, and a crossing band, under a coating.
- Coating: gloss from matte to mirror, brushed or flake grain with depth, glints, hairline scratches along the grain.
- Six finishes as full recipes: brushed (default), polished, flake, satin, matte, worn.
- Sass module with the same finishes and `!default` settings; output byte-identical to the JavaScript version, checked by the test suite. `metallic.css` is the compiled Sass entry.
- React wrapper (`metallic-colors/react`).
- Presets: a photographed deck of 24 paint tones and 16 classic metals, with English names.
- Scripts to calibrate tones from photographs of a printed card.
- Demo on GitHub Pages with an inspector, live coating and light controls, and copyable snippets.
