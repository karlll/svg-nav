# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Type-check without emitting output
npm run check

# Compile TypeScript to dist/index.js
npm run build
# or directly:
tsc -p tsconfig.json
```

To run the demo, open `index.html` directly in a browser (no dev server needed). The compiled output at `dist/index.js` is loaded as an ES module.

There are no tests and no linter configured.

## Architecture

This is a zero-dependency TypeScript library that adds pan/zoom controls to SVG elements.

**Entry point:** `src/svg-nav.ts` — compiled to `dist/svg-nav.js` (ES2020 module). `index.html` loads it via `<script type="module">`.

**How it works:**

- On load, `src/index.ts` queries all `svg.svg-nav-enabled` elements and wraps each in a `SvgNavigator` instance.
- `SvgNavigator` wraps the SVG in a `div.svg-nav-host`, injects a `div.svg-nav-overlay` with control buttons, and attaches mouse/pointer/wheel event listeners.
- Pan/zoom is implemented by mutating the SVG `viewBox` attribute — the SVG's rendered size stays fixed.
- `SvgNavigator.active` (static) tracks which navigator currently has keyboard focus (set on `mouseenter`/`mouseleave`).
- Global `keydown`/`keyup` listeners on `window` dispatch to the active navigator; `Alt` key enables drag-to-pan across all navigators.

**CSS:** `src/styles.css` is loaded directly by `index.html`. It styles the overlay, control buttons, and cursor states (`.svg-nav-grab-ready`, `.svg-nav-dragging`).

**Key constants in `src/index.ts`:**
- `ZOOM_FACTOR = 1.15` — zoom step multiplier
- `STEP_PAN_RATIO = 0.12` — pan step as a fraction of the current viewBox dimension
