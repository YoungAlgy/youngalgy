import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { HUB_DPAD_BUTTON_STYLE, HUB_DPAD_GO_STYLE, HUB_DPAD_LAYOUT_STYLE } from "./hubDpadStyles";

const houseSource = readFileSync(resolve(process.cwd(), "src/components/hub/AlgysHouseInterior.tsx"), "utf8");

describe("shared Toggle Town D-pad styles", () => {
  it("keeps the shared 56px geometry and idle button appearance", () => {
    expect(HUB_DPAD_LAYOUT_STYLE).toMatchObject({
      position: "fixed",
      right: "max(16px, env(safe-area-inset-right))",
      bottom: "max(16px, env(safe-area-inset-bottom))",
      gridTemplateColumns: "56px 56px 56px",
      gridTemplateRows: "56px 56px 56px",
      gap: 4,
      touchAction: "none",
      userSelect: "none",
      WebkitUserSelect: "none",
      WebkitTouchCallout: "none",
    });
    expect(HUB_DPAD_BUTTON_STYLE).toMatchObject({
      boxSizing: "border-box",
      width: 56,
      height: 56,
      padding: 0,
      background: "rgba(28, 18, 12, 0.72)",
      border: "2px solid #c89838",
      borderRadius: 8,
      touchAction: "none",
      userSelect: "none",
      WebkitUserSelect: "none",
      WebkitTouchCallout: "none",
      WebkitTapHighlightColor: "transparent",
    });
    expect(HUB_DPAD_GO_STYLE).toMatchObject({
      fontFamily: "'Press Start 2P', monospace",
      fontSize: 8,
      fontWeight: 400,
      lineHeight: 1,
      letterSpacing: "0.05em",
    });
  });

  it("wires the shared layout, arrows, and GO button into the personal house", () => {
    for (const source of [houseSource]) {
      expect(source).toContain("...HUB_DPAD_LAYOUT_STYLE");
      expect(source).toContain("...HUB_DPAD_BUTTON_STYLE");
      expect(source).toContain("...HUB_DPAD_GO_STYLE");
      expect(source).toContain('aria-label="Go"');
      expect(source).toMatch(/>\s*GO\s*<\/button>/);
    }
  });

  it("keeps sprint GO pointer-first, cyan when active, and separate from house interaction", () => {
    for (const source of [houseSource]) {
      const goStart = source.indexOf('aria-label="Go"');
      const goEnd = source.indexOf("</button>", goStart);
      const go = source.slice(goStart, goEnd);
      expect(goStart).toBeGreaterThan(-1);
      expect(go).toContain("onPointerDown");
      expect(go).toMatch(/\.preventDefault\(\)/);
      expect(go).toContain("aria-pressed={sprintActive}");
      expect(go).toContain("background: sprintActive");
      expect(go).toContain("border: sprintActive");
      expect(go).toContain("boxShadow: sprintActive");
      expect(go).toContain('color: sprintActive ? "#00FFFF" : "#f4e8c1"');
      expect(go.indexOf("...HUB_DPAD_GO_STYLE")).toBeLessThan(go.indexOf("background: sprintActive"));
    }
    const houseGoStart = houseSource.indexOf('aria-label="Go"');
    const houseGoEnd = houseSource.indexOf("</button>", houseGoStart);
    const houseGo = houseSource.slice(houseGoStart, houseGoEnd);
    expect(houseGo).not.toContain("interact");
    expect(houseSource).toContain('aria-label="Use"');
    expect(houseSource).toContain("onContextMenu={(event) => event.preventDefault()}");
  });
});
