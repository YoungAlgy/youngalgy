export const ALGY_HOUSE_EXTERIOR_DOOR = { x: 31, y: 28 } as const;

export type HouseDoorTransitionPhase = "idle" | "out" | "hold" | "in";

export const HOUSE_DOOR_FADE_MS = 240;
export const HOUSE_DOOR_HOLD_MS = 110;

export function houseDoorCharacterAlpha(
  phase: HouseDoorTransitionPhase,
  elapsedMs: number,
): number {
  if (phase === "hold") return 0;
  if (phase === "out") return Math.max(0, 1 - elapsedMs / HOUSE_DOOR_FADE_MS);
  if (phase === "in") return Math.min(1, elapsedMs / HOUSE_DOOR_FADE_MS);
  return 1;
}

/** North from Algy's porch is a local room transition, not a blocked tile. */
export function shouldEnterAlgyHouse(
  position: { x: number; y: number },
  movement: { dx: number; dy: number },
): boolean {
  return (
    position.x === ALGY_HOUSE_EXTERIOR_DOOR.x &&
    position.y === ALGY_HOUSE_EXTERIOR_DOOR.y &&
    movement.dx === 0 &&
    movement.dy < 0
  );
}

export const ALGY_HOUSE_RETURN_POSE = {
  x: ALGY_HOUSE_EXTERIOR_DOOR.x,
  y: ALGY_HOUSE_EXTERIOR_DOOR.y,
  dir: "s" as const,
};
