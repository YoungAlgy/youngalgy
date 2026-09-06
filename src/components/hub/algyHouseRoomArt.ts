import { ALGY_HOUSE_TILE as TILE, ALGY_HOUSE_STAIRS_UP_OPENING, ALGY_HOUSE_UPSTAIRS_DOOR, type AlgyHouseFloor } from "./algyHouseScene";
import { HOUSE_PLANK_ART, HOUSE_RUG_ART, HOUSE_RUG_POSITION, HOUSE_BEDROOM_RUG_ART, HOUSE_BEDROOM_RUG_POSITION, type HouseLayoutRect } from "./algyHouseLayout";

export function drawHouseDecorArt(context: CanvasRenderingContext2D, atlas: HTMLImageElement | null,
  source: HouseLayoutRect, destination: HouseLayoutRect): void {
  if (!atlas?.complete || !atlas.naturalWidth) return;
  context.drawImage(atlas, source.x, source.y, source.width, source.height,
    destination.x * TILE, destination.y * TILE, destination.width * TILE, destination.height * TILE);
}

/** Original rear view on the room's 32px furniture grid. The near/south back
 * hides the front of the cushions, so the seated direction is north. No source
 * sprite is flipped: that would put its feet and shadows above the cushions. */
export function drawHouseNorthFacingSofa(context: CanvasRenderingContext2D, sofa: HouseLayoutRect): void {
  context.save();
  context.translate(sofa.x * TILE, sofa.y * TILE);
  context.scale(sofa.width * TILE / 32, sofa.height * TILE / 32);
  const rect = (x: number, y: number, w: number, h: number, color: string) => {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
  };
  // Feet and contact shadow stay on the near edge, matching the nearby lamp.
  rect(2, 27, 28, 3, "rgba(38,29,28,0.28)");
  rect(3, 27, 4, 3, "#51464c");
  rect(25, 27, 4, 3, "#51464c");
  // A glimpse of the cushions beyond the back rail establishes the facing.
  rect(3, 5, 26, 10, "#70515a");
  rect(4, 6, 24, 8, "#c07880");
  rect(5, 7, 10, 6, "#b86671");
  rect(17, 7, 10, 6, "#b86671");
  rect(15, 6, 2, 8, "#995460");
  // Short wood-trimmed arms, with the tall backrest drawn over their near ends.
  rect(0, 4, 4, 22, "#65525a");
  rect(28, 4, 4, 22, "#65525a");
  rect(1, 4, 2, 19, "#bd976a");
  rect(29, 4, 2, 19, "#bd976a");
  rect(1, 4, 2, 2, "#e0bd88");
  rect(29, 4, 2, 2, "#e0bd88");
  // Broad upholstered back is nearest to the viewer, below the seat pixels.
  rect(1, 13, 30, 15, "#66505b");
  rect(2, 13, 28, 2, "#d6ad7c");
  rect(2, 15, 28, 11, "#a95b68");
  rect(3, 16, 26, 2, "#bd737c");
  rect(3, 24, 26, 2, "#8e4d5b");
  rect(2, 26, 28, 1, "#a78161");
  context.restore();
}

/** Small original pixel lamp follows the nightstand's placement and depth. */
export function drawHouseBedsideLamp(context: CanvasRenderingContext2D, table: HouseLayoutRect): void {
  const x = (table.x + table.width / 2) * TILE;
  // The source tabletop is at native row 11 of the 32px sprite.
  const y = (table.y + table.height * 11 / 32) * TILE;
  const rect = (dx: number, dy: number, w: number, h: number, color: string) => {
    context.fillStyle = color;
    context.fillRect(x + dx, y + dy, w, h);
  };
  rect(-6, 0, 18, 3, "#5e4936");
  rect(0, -21, 6, 21, "#b69060");
  rect(-9, -27, 24, 12, "#856448");
  rect(-6, -30, 18, 12, "#efd396");
  rect(-9, -18, 24, 3, "#d6ad70");
}

/** Curtain-free wood casement, specific to the bedroom. Original pixel shapes. */
export function drawHouseBedroomWindow(context: CanvasRenderingContext2D): void {
  const x = 5.25 * TILE;
  const y = -24;
  const rect = (dx: number, dy: number, w: number, h: number, color: string) => {
    context.fillStyle = color;
    context.fillRect(x + dx, y + dy, w, h);
  };
  rect(-3, -3, 78, 63, "#625448");
  rect(0, 0, 72, 54, "#b49672");
  rect(6, 6, 60, 42, "#202c42");
  rect(6, 30, 60, 18, "#344857");
  rect(48, 12, 6, 6, "#e2dab5");
  rect(15, 15, 3, 3, "#8fabc1");
  rect(51, 39, 9, 3, "#688281");
  rect(6, 27, 60, 3, "#b49672");
  rect(33, 6, 6, 42, "#b49672");
  rect(33, 6, 3, 42, "#d2b48b");
  rect(-6, 51, 84, 6, "#cfb18a");
  rect(-3, 57, 78, 3, "#826649");
}

/** Same cutaway doorway and woven mat as downstairs. This doorway stays locked. */
export function drawAlgyHouseUpstairsDoor(context: CanvasRenderingContext2D): void {
  const x = ALGY_HOUSE_UPSTAIRS_DOOR.x * TILE;
  const y = ALGY_HOUSE_UPSTAIRS_DOOR.y * TILE;
  const rect = (dx: number, dy: number, w: number, h: number, color: string) => {
    context.fillStyle = color;
    context.fillRect(x + dx, y + dy, w, h);
  };
  rect(0, -3, 48, 9, "#b28b58");
  rect(0, 6, 48, 12, "#181b24");
  rect(3, 9, 42, 3, "#7e654b");
  rect(3, -29, 42, 23, "#51483a");
  rect(6, -26, 36, 17, "#bc985e");
  for (let dy = -23; dy < -11; dy += 4) rect(9, dy, 30, 1, "#987549");
}

/** Quiet original night scene behind the existing licensed curtain/frame pieces. */
export function drawHouseNightWindow(context: CanvasRenderingContext2D, atlas: HTMLImageElement | null,
  x: number, y: number): void {
  const rect = (dx: number, dy: number, w: number, h: number, color: string) => {
    context.fillStyle = color;
    context.fillRect(x + dx * 2, y + dy * 2, w * 2, h * 2);
  };
  // Keep the curtains and frame. Only the glass gets a calm moonlit bay view.
  drawHouseDecorArt(context, atlas, { x: 192, y: 0, width: 48, height: 48 },
    { x: x / TILE, y: y / TILE, width: 2, height: 2 });
  rect(11, 10, 26, 17, "#20283e");
  rect(11, 21, 26, 6, "#364755");
  rect(28, 12, 3, 3, "#ddd9b0");
  rect(17, 14, 1, 1, "#9eacbc");
  rect(24, 17, 1, 1, "#9eacbc");
  rect(13, 19, 5, 3, "#182933");
  rect(18, 20, 19, 2, "#182933");
  rect(28, 23, 4, 1, "#75837c");
  rect(25, 25, 8, 1, "#52686f");
  rect(11, 27, 26, 1, "#aaa7ae");
}

/** Original cutaway architecture shared by the living room and bedroom. */
export function drawAlgyHouseRoomShell(context: CanvasRenderingContext2D, atlas: HTMLImageElement | null,
  floor: AlgyHouseFloor): void {
  const upstairs = floor === "upstairs";
  const rect = (x: number, y: number, w: number, h: number, color: string) => {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
  };

  // Cutaway shell: a raised north wall, narrow side caps, and a low south wall.
  rect(27, -57, 618, 516, "#0c1017");
  rect(33, -51, 606, 504, "#463c35");
  rect(48, 48, 576, 384, "#987b59");
  context.save();
  context.globalAlpha = 0.18;
  for (let y = 1; y < 9; y++) {
    for (let x = 1; x < 13; x++) {
      drawHouseDecorArt(context, atlas, {
        x: HOUSE_PLANK_ART.x + ((x - 1) % 3) * 16,
        y: HOUSE_PLANK_ART.y + (y % 2) * 16, width: 16, height: 16,
      }, { x, y, width: 1, height: 1 });
    }
  }
  context.restore();
  // Long, staggered boards. Low-contrast texture stays beneath the furniture.
  for (let row = 0; row < 16; row++) {
    const y = 48 + row * 24;
    rect(48, y + 21, 576, 3, "rgba(62, 44, 32, 0.22)");
    rect(48, y, 576, 3, "rgba(235, 203, 144, 0.12)");
    for (let x = 48 + (row % 3) * 63; x < 624; x += 189) {
      if (x > 48) rect(x, y, 3, 21, "rgba(62, 44, 32, 0.18)");
      rect(x + 12, y + 9, Math.max(0, Math.min(54, 612 - x)), 3, "rgba(235, 203, 144, 0.07)");
    }
  }
  // Warm plaster above muted green paneling. The long bands remove the tiled-box effect.
  rect(48, -42, 576, 57, upstairs ? "#d6cbb5" : "#dbd0ac");
  rect(48, -42, 576, 6, "#efe2bf");
  rect(48, 9, 576, 6, "#b9ad8e");
  rect(48, 15, 576, 24, upstairs ? "#747b88" : "#778274");
  for (let x = 48; x < 624; x += 24) rect(x, 18, 3, 21, upstairs ? "#626b79" : "#697566");
  rect(48, 12, 576, 3, "#a6ab8c");
  rect(48, 39, 576, 6, "#4e4a3b");
  rect(48, 45, 576, 3, "#bd9465");
  rect(36, -45, 12, 489, "#6d5744");
  rect(39, -42, 6, 483, "#ab8960");
  rect(624, -45, 12, 489, "#6d5744");
  rect(624, -42, 3, 483, "#c09b6e");
  rect(36, -51, 600, 9, "#85664c");
  rect(39, -48, 594, 3, "#c09b6e");

  // Narrow contact shadows ground the wall and staircase without tinting the entire room.
  rect(48, 48, 576, 6, "rgba(38, 29, 28, 0.25)");
  rect(48, 54, 576, 6, "rgba(38, 29, 28, 0.10)");
  rect(48, 48, 6, 384, "rgba(38, 29, 28, 0.15)");
  rect(618, 48, 6, 384, "rgba(38, 29, 28, 0.15)");

  drawHouseDecorArt(context, atlas, upstairs ? HOUSE_BEDROOM_RUG_ART : HOUSE_RUG_ART,
    upstairs ? HOUSE_BEDROOM_RUG_POSITION : HOUSE_RUG_POSITION);
  // Wall art has no floor collision. The bedroom keeps its work area at the east.
  if (upstairs) drawHouseBedroomWindow(context);
  else drawHouseNightWindow(context, atlas, 9 * TILE, -0.75 * TILE);
  // The skull poster is kept upstairs only. Downstairs wall stays clear.
  if (upstairs) drawHouseDecorArt(context, atlas, { x: 64, y: 48, width: 16, height: 32 },
    { x: 10.5, y: -0.625, width: 0.75, height: 1.5 });

  if (upstairs) {
    // Small bedside pool of light, kept underneath furniture and feet.
    rect(258, 240, 60, 48, "rgba(237, 192, 117, 0.08)");
    rect(36, 432, 600, 18, "#463e37");
    rect(36, 432, 600, 6, "#b5956d");
    return;
  }

  // The west stair head belongs to a recessed opening in the same wall finish.
  // Art-only nudge follows the shifted stair head. The entry tile stays fixed.
  const stairX = ALGY_HOUSE_STAIRS_UP_OPENING.x * TILE - 3;
  const stairHeadY = ALGY_HOUSE_STAIRS_UP_OPENING.y * TILE - 33;
  rect(stairX, stairHeadY, 30, 48, "#302b30");
  rect(stairX, stairHeadY, 6, 48, "#6d5744");
  rect(stairX, stairHeadY - 3, 33, 6, "#c09b6e");

  // Low cutaway front wall and clear, left-aligned threshold. No exit icon on the floor.
  rect(36, 432, 108, 18, "#463e37");
  rect(192, 432, 444, 18, "#463e37");
  rect(36, 432, 108, 6, "#b5956d");
  rect(192, 432, 444, 6, "#b5956d");
  rect(144, 429, 48, 9, "#b28b58");
  rect(144, 438, 48, 12, "#181b24");
  rect(147, 441, 42, 3, "#7e654b");
  // Small woven doormat on the safe arrival tile, fully walkable.
  rect(147, 403, 42, 23, "#51483a");
  rect(150, 406, 36, 17, "#bc985e");
  for (let y = 409; y < 421; y += 4) rect(153, y, 30, 1, "#987549");
}
