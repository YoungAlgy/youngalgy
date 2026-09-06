import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { HUB_DPAD_BUTTON_STYLE, HUB_DPAD_GO_STYLE, HUB_DPAD_LAYOUT_STYLE } from "./hubDpadStyles";

const houseSource = readFileSync(resolve(process.cwd(), "src/components/hub/AlgysHouseInterior.tsx"), "utf8");

describe("shared Toggle Town D-pad styles", () => {
  it("keeps the shared 56px geometry and idle button appearance", () => {
    expect(HUB_DPAD_LAYOUT_STYLE).toMatchObject({
      position: "fixed",
      right: 16,
      bottom: 16,
      gridTemplateColumns: "56px 56px 56px",
      gridTemplateRows: "56px 56px 56px",
      gap: 4,
    });
    expect(HUB_DPAD_BUTTON_STYLE).toMatchObject({
      boxSizing: "border-box",
      width: 56,
      height: 56,
      padding: 0,
      background: "rgba(28, 18, 12, 0.72)",
      border: "2px solid #c89838",
      borderRadius: 8,
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
    expect(houseSource).toContain("...HUB_DPAD_LAYOUT_STYLE");
    expect(houseSource).toContain("...HUB_DPAD_BUTTON_STYLE");
    expect(houseSource).toContain("...HUB_DPAD_GO_STYLE");
    expect(houseSource).toContain('aria-label="Go"');
    expect(houseSource).toMatch(/>\s*GO\s*<\/button>/);
  });
});
