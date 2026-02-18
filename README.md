# SVG Pan & Zoom (TypeScript, no external dependencies)

A minimal TypeScript project that enables pan/zoom controls for any SVG marked with the class `svg-nav-enabled`.

## Features

- Hover-only overlay controls (`+`, `-`, arrow pan buttons, reset `⟲`).
- Keyboard controls while hovering an enabled SVG:
  - `+` zoom in
  - `-` zoom out
  - `=` reset
  - Arrow keys pan
- Mouse wheel zoom at pointer location.
- `Alt` + drag to pan (cursor changes to `grab`/`grabbing`).
- Supports multiple SVGs on a page.
- SVGs without `svg-nav-enabled` are untouched.
- Pan/zoom is implemented via SVG `viewBox`, so the on-screen SVG size stays fixed.

## Run

Open `index.html` in a browser.

## Build

```bash
tsc -p tsconfig.json
```

The compiled file is emitted to `dist/index.js`.
