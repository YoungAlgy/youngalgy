import type { CSSProperties } from "react";

/** Shared town/house controls. Keep their geometry and idle appearance identical. */
export const HUB_DPAD_LAYOUT_STYLE: CSSProperties = {
  position: "fixed",
  right: 16,
  bottom: 16,
  display: "grid",
  gridTemplateColumns: "56px 56px 56px",
  gridTemplateRows: "56px 56px 56px",
  gap: 4,
  touchAction: "none",
  userSelect: "none",
};

export const HUB_DPAD_BUTTON_STYLE: CSSProperties = {
  boxSizing: "border-box",
  width: 56,
  height: 56,
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(28, 18, 12, 0.72)",
  border: "2px solid #c89838",
  borderRadius: 8,
  color: "#f4e8c1",
  cursor: "pointer",
  boxShadow: "2px 2px 0 rgba(0,0,0,0.45)",
  touchAction: "none",
  userSelect: "none",
};

export const HUB_DPAD_GO_STYLE: CSSProperties = {
  ...HUB_DPAD_BUTTON_STYLE,
  fontFamily: "'Press Start 2P', monospace",
  fontSize: 8,
  fontWeight: 400,
  lineHeight: 1,
  letterSpacing: "0.05em",
  transition: "background 120ms ease, border-color 120ms ease, box-shadow 120ms ease",
};
