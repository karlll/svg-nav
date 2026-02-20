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
- Pan/zoom is implemented via SVG `viewBox`, so the on-screen SVG size stays fixed.

## Usage

Add the `svg-nav-enabled` class to any SVG element, load the script, and include the required CSS:

```html
<link rel="stylesheet" href="svg-nav.css" />

<svg class="svg-nav-enabled" width="600" height="400" viewBox="0 0 600 400">
  <!-- your svg content -->
</svg>

<script type="module" src="dist/svg-nav.js"></script>
```

## Required CSS

The following classes must be styled for the controls to render correctly:

```css
.svg-nav-host {
  position: relative;
  display: inline-block;
  width: fit-content;
  line-height: 0;
}

.svg-nav-overlay {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 130ms ease;
  pointer-events: none;
  display: grid;
}

.svg-nav-host:hover > .svg-nav-overlay,
.svg-nav-host.svg-nav-hover > .svg-nav-overlay {
  opacity: 1;
  pointer-events: auto;
}

.svg-nav-controls {
  justify-self: end;
  align-self: end;
  margin: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  padding: 4px;
}

.svg-nav-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #ffffff;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.svg-nav-btn svg {
  width: 18px;
  height: 18px;
  display: block;
}

.svg-nav-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.svg-nav-help-wrap {
  position: relative;
}

.svg-nav-tooltip {
  position: absolute;
  right: calc(100% + 8px);
  bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  border-radius: 8px;
  padding: 8px 12px;
  color: #fff;
  font-size: 11px;
  white-space: nowrap;
  line-height: 1.6;
  opacity: 0;
  pointer-events: none;
  transition: opacity 130ms ease;
}

.svg-nav-tooltip p {
  margin: 0;
}

.svg-nav-help-wrap:hover .svg-nav-tooltip {
  opacity: 1;
}

.svg-nav-host.svg-nav-grab-ready {
  cursor: grab;
}

.svg-nav-host.svg-nav-dragging {
  cursor: grabbing;
}
```

## Run

Open `demo.html` in a browser.

## Build

```bash
make
```

The compiled file is emitted to `dist/svg-nav.js`.
