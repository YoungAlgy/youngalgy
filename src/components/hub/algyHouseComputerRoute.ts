import {
  ALGY_HOUSE_COLS,
  ALGY_HOUSE_ROWS,
  algyHouseStep,
  isAlgyHouseWalkable,
  type AlgyHouseFloor,
  type HouseDirection,
  type HousePoint,
} from "./algyHouseScene";
import type { HouseCharacterId } from "./algyHouseVisitor";

export const ALGY_HOUSE_COMPUTER_APPROACH = { x: 10, y: 2, dir: "n" } as const;

const ROUTE_DIRECTIONS: readonly HouseDirection[] = ["n", "e", "s", "w"];

interface RouteNode extends HousePoint {
  route: HouseDirection[];
}

/** Find the shortest safe upstairs walk to the tile facing the computer. */
export function algyHouseComputerRoute(
  floor: AlgyHouseFloor,
  start: HousePoint,
  characterId: HouseCharacterId,
): HouseDirection[] | null {
  if (floor !== "upstairs") return null;
  if (!Number.isInteger(start.x) || !Number.isInteger(start.y)) return null;
  if (start.x < 0 || start.y < 0 || start.x >= ALGY_HOUSE_COLS || start.y >= ALGY_HOUSE_ROWS) return null;
  if (!isAlgyHouseWalkable(floor, start.x, start.y, characterId)) return null;
  if (start.x === ALGY_HOUSE_COMPUTER_APPROACH.x && start.y === ALGY_HOUSE_COMPUTER_APPROACH.y) return [];

  const key = ({ x, y }: HousePoint) => `${x},${y}`;
  const visited = new Set([key(start)]);
  const queue: RouteNode[] = [{ ...start, route: [] }];

  for (let cursor = 0; cursor < queue.length && cursor < ALGY_HOUSE_COLS * ALGY_HOUSE_ROWS; cursor += 1) {
    const current = queue[cursor];
    for (const direction of ROUTE_DIRECTIONS) {
      const step = algyHouseStep(floor, current, direction, characterId);
      if (!step || step.transition !== null) continue;

      const pointKey = key(step.point);
      if (visited.has(pointKey)) continue;
      const route = [...current.route, direction];
      if (step.point.x === ALGY_HOUSE_COMPUTER_APPROACH.x && step.point.y === ALGY_HOUSE_COMPUTER_APPROACH.y) {
        return route;
      }
      visited.add(pointKey);
      queue.push({ ...step.point, route });
    }
  }

  return null;
}
