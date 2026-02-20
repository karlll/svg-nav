# SVG Pan & Zoom

A minimal TypeScript project that enables pan/zoom controls for any SVG marked with the class `svg-nav-enabled`.

![](screenshot.png)

## Features

- Hover-only overlay controls: reset view icon and a help icon, displayed in the bottom-right corner of the SVG.
- Help tooltip (shown on hover of the `?` icon) with a summary of controls.
- Keyboard controls while hovering an enabled SVG:
  - `+` / `-` zoom in / out
  - `=` reset view
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
make
```

The compiled file is emitted to `dist/svg-nav.js`.
