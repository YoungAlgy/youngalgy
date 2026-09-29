// FireRed's ordinary foot movement takes 16 updates per tile walking and
// 8 running. Express the native GBA frame rate as time, independent of the
// browser display rate. Our 16x32 characters render at 2x, so FireRed's
// 16-pixel ground step corresponds to 32 world pixels here, not a whole
// 64-pixel Town cell or 48-pixel House cell. References are in the checkpoint.
export const GBA_FRAME_MS = (280896 / 16777216) * 1000;
export const HUB_WALK_STEP_MS = 16 * GBA_FRAME_MS;
export const HUB_RUN_STEP_MS = 8 * GBA_FRAME_MS;

export const HUB_GAIT_STEP_PX = 32;

export function hubStepDuration(sprinting: boolean, tileSize = HUB_GAIT_STEP_PX): number {
  return (sprinting ? HUB_RUN_STEP_MS : HUB_WALK_STEP_MS) * tileSize / HUB_GAIT_STEP_PX;
}

/** Six LimeZu poses span a two-step gait. Advance feet with distance, not time. */
export function hubMovementFrame(completedSteps: number, progress: number, moving: boolean, tileSize = HUB_GAIT_STEP_PX): number {
  if (!moving) return 0;
  const gaitSteps = (completedSteps + Math.max(0, Math.min(1, progress))) * tileSize / HUB_GAIT_STEP_PX;
  return Math.floor(gaitSteps * 3) % 6;
}

/** Ignore suspended-tab time instead of teleporting through multiple tiles. */
export function hubMovementDelta(elapsedMs: number): number {
  return Math.max(0, Math.min(100, elapsedMs));
}
