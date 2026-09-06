import { describe, expect, it, vi } from "vitest";
import { drawHouseNorthFacingSofa } from "./algyHouseRoomArt";
import { ALGY_HOUSE_GROUND_FURNITURE } from "./algyHouseLayout";

describe("north-facing living-room couch", () => {
  it("keeps native upright pixel scale at the former TV-table position", () => {
    const context = { save: vi.fn(), restore: vi.fn(), translate: vi.fn(), scale: vi.fn(), fillRect: vi.fn() };
    const sofa = ALGY_HOUSE_GROUND_FURNITURE.find(item => item.id === "sofa")!;
    drawHouseNorthFacingSofa(context as unknown as CanvasRenderingContext2D, sofa.art);
    expect(sofa.solid).toEqual({ x: 9, y: 5, width: 2, height: 1 });
    expect(context.translate).toHaveBeenCalledWith(448, 224);
    expect(context.scale).toHaveBeenCalledExactlyOnceWith(2, 2);
    expect(context.save).toHaveBeenCalledOnce();
    expect(context.restore).toHaveBeenCalledOnce();
  });

  it("draws the broad back below the visible cushions, with feet on the south edge", () => {
    const context = { save: vi.fn(), restore: vi.fn(), translate: vi.fn(), scale: vi.fn(), fillRect: vi.fn() };
    drawHouseNorthFacingSofa(context as unknown as CanvasRenderingContext2D, { x: 0, y: 0, width: 1, height: 1 });
    const rects = context.fillRect.mock.calls;
    const seat = rects.findIndex(([x, y, width, height]) => x === 4 && y === 6 && width === 24 && height === 8);
    const back = rects.findIndex(([x, y, width, height]) => x === 1 && y === 13 && width === 30 && height === 15);
    expect(seat).toBeGreaterThanOrEqual(0);
    expect(back).toBeGreaterThan(seat);
    expect(context.fillRect).toHaveBeenCalledWith(3, 27, 4, 3);
    expect(context.fillRect).toHaveBeenCalledWith(25, 27, 4, 3);
  });
});
