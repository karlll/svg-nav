"use strict";
const ENABLE_CLASS = "svg-nav-enabled";
const STEP_PAN_RATIO = 0.12;
const ZOOM_FACTOR = 1.15;
class SvgNavigator {
    constructor(svg) {
        this.dragging = false;
        this.altDown = false;
        this.dragStart = null;
        this.svg = svg;
        this.initialViewBox = this.readViewBox();
        this.viewBox = { ...this.initialViewBox };
        this.host = document.createElement("div");
        this.host.className = "svg-nav-host";
        svg.parentElement?.insertBefore(this.host, svg);
        this.host.appendChild(svg);
        this.host.appendChild(this.createOverlay());
        this.attachEvents();
        this.applyViewBox();
    }
    readViewBox() {
        const raw = this.svg.getAttribute("viewBox");
        if (raw) {
            const [x, y, width, height] = raw.trim().split(/\s+/).map(Number);
            if ([x, y, width, height].every(Number.isFinite) && width > 0 && height > 0) {
                return { x, y, width, height };
            }
        }
        const widthAttr = Number(this.svg.getAttribute("width"));
        const heightAttr = Number(this.svg.getAttribute("height"));
        const width = Number.isFinite(widthAttr) && widthAttr > 0 ? widthAttr : this.svg.clientWidth || 100;
        const height = Number.isFinite(heightAttr) && heightAttr > 0 ? heightAttr : this.svg.clientHeight || 100;
        return { x: 0, y: 0, width, height };
    }
    createOverlay() {
        const overlay = document.createElement("div");
        overlay.className = "svg-nav-overlay";
        const controls = document.createElement("div");
        controls.className = "svg-nav-controls";
        controls.append(this.button("＋", "Zoom in", () => this.zoomAtCenter(1 / ZOOM_FACTOR)), this.button("⟲", "Reset (=)", () => this.reset()), this.button("－", "Zoom out", () => this.zoomAtCenter(ZOOM_FACTOR)), this.button("←", "Pan left", () => this.pan(-STEP_PAN_RATIO, 0)), this.button("↑", "Pan up", () => this.pan(0, -STEP_PAN_RATIO)), this.button("→", "Pan right", () => this.pan(STEP_PAN_RATIO, 0)), this.button("", "", () => undefined, true), this.button("↓", "Pan down", () => this.pan(0, STEP_PAN_RATIO)), this.button("", "", () => undefined, true));
        const help = document.createElement("div");
        help.className = "svg-nav-help";
        help.textContent = "Keys: +/- zoom • arrows pan • = reset • Alt+drag pan";
        controls.append(help);
        overlay.append(controls);
        return overlay;
    }
    button(label, title, onClick, hidden = false) {
        const btn = document.createElement("button");
        btn.className = "svg-nav-btn";
        btn.type = "button";
        btn.textContent = label;
        btn.title = title;
        if (hidden) {
            btn.style.visibility = "hidden";
            btn.tabIndex = -1;
            btn.setAttribute("aria-hidden", "true");
        }
        else {
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                onClick();
            });
        }
        return btn;
    }
    attachEvents() {
        this.host.addEventListener("mouseenter", () => {
            SvgNavigator.active = this;
            this.host.classList.add("svg-nav-hover");
            this.updateCursor();
        });
        this.host.addEventListener("mouseleave", () => {
            if (SvgNavigator.active === this) {
                SvgNavigator.active = null;
            }
            this.host.classList.remove("svg-nav-hover");
            this.dragging = false;
            this.dragStart = null;
            this.updateCursor();
        });
        this.host.addEventListener("wheel", (event) => {
            event.preventDefault();
            const rect = this.svg.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width;
            const py = (event.clientY - rect.top) / rect.height;
            const factor = event.deltaY < 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
            this.zoomAtPoint(px, py, factor);
        }, { passive: false });
        this.host.addEventListener("pointerdown", (event) => {
            if (!this.altDown || event.button !== 0) {
                return;
            }
            event.preventDefault();
            this.dragging = true;
            this.dragStart = {
                x: event.clientX,
                y: event.clientY,
                viewBox: { ...this.viewBox }
            };
            this.host.setPointerCapture(event.pointerId);
            this.updateCursor();
        });
        this.host.addEventListener("pointermove", (event) => {
            if (!this.dragging || !this.dragStart) {
                return;
            }
            const rect = this.svg.getBoundingClientRect();
            const dxRatio = (event.clientX - this.dragStart.x) / rect.width;
            const dyRatio = (event.clientY - this.dragStart.y) / rect.height;
            this.viewBox.x = this.dragStart.viewBox.x - (dxRatio * this.dragStart.viewBox.width);
            this.viewBox.y = this.dragStart.viewBox.y - (dyRatio * this.dragStart.viewBox.height);
            this.applyViewBox();
        });
        this.host.addEventListener("pointerup", (event) => {
            if (this.dragging) {
                this.host.releasePointerCapture(event.pointerId);
            }
            this.dragging = false;
            this.dragStart = null;
            this.updateCursor();
        });
        this.host.addEventListener("pointercancel", () => {
            this.dragging = false;
            this.dragStart = null;
            this.updateCursor();
        });
    }
    setAltDown(value) {
        this.altDown = value;
        if (!value) {
            this.dragging = false;
            this.dragStart = null;
        }
        this.updateCursor();
    }
    zoomAtCenter(factor) {
        this.zoomAtPoint(0.5, 0.5, factor);
    }
    zoomAtPoint(px, py, factor) {
        const nextWidth = this.viewBox.width * factor;
        const nextHeight = this.viewBox.height * factor;
        const anchorX = this.viewBox.x + this.viewBox.width * px;
        const anchorY = this.viewBox.y + this.viewBox.height * py;
        this.viewBox.x = anchorX - nextWidth * px;
        this.viewBox.y = anchorY - nextHeight * py;
        this.viewBox.width = nextWidth;
        this.viewBox.height = nextHeight;
        this.applyViewBox();
    }
    pan(dxRatio, dyRatio) {
        this.viewBox.x += this.viewBox.width * dxRatio;
        this.viewBox.y += this.viewBox.height * dyRatio;
        this.applyViewBox();
    }
    reset() {
        this.viewBox = { ...this.initialViewBox };
        this.applyViewBox();
    }
    applyViewBox() {
        const { x, y, width, height } = this.viewBox;
        this.svg.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
    }
    updateCursor() {
        this.host.classList.toggle("svg-nav-grab-ready", this.altDown && !this.dragging && SvgNavigator.active === this);
        this.host.classList.toggle("svg-nav-dragging", this.dragging);
    }
}
SvgNavigator.active = null;
const navigators = Array.from(document.querySelectorAll(`svg.${ENABLE_CLASS}`)).map((svg) => new SvgNavigator(svg));
window.addEventListener("keydown", (event) => {
    const active = SvgNavigator.active;
    if (!active) {
        return;
    }
    switch (event.key) {
        case "+":
            event.preventDefault();
            active.zoomAtCenter(1 / ZOOM_FACTOR);
            break;
        case "-":
            event.preventDefault();
            active.zoomAtCenter(ZOOM_FACTOR);
            break;
        case "=":
            event.preventDefault();
            active.reset();
            break;
        case "ArrowUp":
            event.preventDefault();
            active.pan(0, -STEP_PAN_RATIO);
            break;
        case "ArrowDown":
            event.preventDefault();
            active.pan(0, STEP_PAN_RATIO);
            break;
        case "ArrowLeft":
            event.preventDefault();
            active.pan(-STEP_PAN_RATIO, 0);
            break;
        case "ArrowRight":
            event.preventDefault();
            active.pan(STEP_PAN_RATIO, 0);
            break;
        case "Alt":
            navigators.forEach((navigator) => navigator.setAltDown(true));
            break;
        default:
            break;
    }
});
window.addEventListener("keyup", (event) => {
    if (event.key === "Alt") {
        navigators.forEach((navigator) => navigator.setAltDown(false));
    }
});
