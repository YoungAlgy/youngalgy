import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// jsdom doesn't implement HTMLMediaElement playback methods, which made any
// component that calls video.play().then(...) (HubLanding's intro video)
// throw "Cannot read properties of undefined (reading 'then')" during tests.
// Stub the three methods to safe no-ops so component mount doesn't error.
// Upstream issue: https://github.com/jsdom/jsdom/issues/2155 (won't-fix).
Object.defineProperty(window.HTMLMediaElement.prototype, "play", {
  configurable: true,
  writable: true,
  value: () => Promise.resolve(),
});
Object.defineProperty(window.HTMLMediaElement.prototype, "pause", {
  configurable: true,
  writable: true,
  value: () => {},
});
Object.defineProperty(window.HTMLMediaElement.prototype, "load", {
  configurable: true,
  writable: true,
  value: () => {},
});

// jsdom doesn't implement HTMLCanvasElement.getContext() unless the optional
// `canvas` npm package is installed (it has native dependencies that aren't
// worth pulling in just for tests). Components that render a <canvas> for
// effects (HubLanding's postcard-stamp HubLogo, etc.) call getContext("2d")
// during mount; without a stub, jsdom throws and the test fails.
//
// Return a no-op 2D context shim that satisfies the methods our components
// actually call. Expand as needed if new tests start failing.
Object.defineProperty(window.HTMLCanvasElement.prototype, "getContext", {
  configurable: true,
  writable: true,
  value: () => ({
    fillRect: () => {},
    clearRect: () => {},
    getImageData: (_x: number, _y: number, w: number, h: number) => ({
      data: new Uint8ClampedArray(w * h * 4),
      width: w,
      height: h,
      colorSpace: "srgb" as const,
    }),
    putImageData: () => {},
    createImageData: (w: number, h: number) => ({
      data: new Uint8ClampedArray(w * h * 4),
      width: w,
      height: h,
      colorSpace: "srgb" as const,
    }),
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    restore: () => {},
    scale: () => {},
    rotate: () => {},
    translate: () => {},
    transform: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    arc: () => {},
    rect: () => {},
    fill: () => {},
    stroke: () => {},
    clip: () => {},
    measureText: () => ({ width: 0 } as TextMetrics),
    fillText: () => {},
    strokeText: () => {},
    createLinearGradient: () => ({
      addColorStop: () => {},
    }),
    createRadialGradient: () => ({
      addColorStop: () => {},
    }),
    createPattern: () => null,
    canvas: window.HTMLCanvasElement.prototype,
  }),
});
Object.defineProperty(window.HTMLCanvasElement.prototype, "toDataURL", {
  configurable: true,
  writable: true,
  value: () => "data:image/png;base64,",
});
