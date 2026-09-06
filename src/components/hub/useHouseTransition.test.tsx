import { act, render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HOUSE_DOOR_FADE_MS, HOUSE_DOOR_HOLD_MS } from "./algyHouseDoor";
import { useHouseTransition } from "./useHouseTransition";
import * as sound from "./houseTransitionSound";

vi.mock("./houseTransitionSound", async () => {
  const actual = await vi.importActual<typeof import("./houseTransitionSound")>("./houseTransitionSound");
  return {
    ...actual,
    prepareHouseTransitionSound: vi.fn(),
    playHouseTransitionSound: vi.fn(),
  };
});

describe("useHouseTransition", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => vi.useRealTimers());

  it("runs out, commits at hold, reveals, and returns idle", () => {
    const commit = vi.fn();
    function Test() {
      const transition = useHouseTransition(false);
      return <button onClick={() => transition.start(commit, "stairs-up")}>{transition.phase}</button>;
    }
    render(<Test />);
    act(() => screen.getByRole("button").click());
    expect(screen.getByRole("button")).toHaveTextContent("out");
    expect(sound.playHouseTransitionSound).toHaveBeenCalledWith("stairs-up");
    act(() => vi.advanceTimersByTime(HOUSE_DOOR_FADE_MS));
    expect(commit).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button")).toHaveTextContent("hold");
    act(() => vi.advanceTimersByTime(HOUSE_DOOR_HOLD_MS));
    expect(screen.getByRole("button")).toHaveTextContent("in");
    act(() => vi.advanceTimersByTime(HOUSE_DOOR_FADE_MS));
    expect(screen.getByRole("button")).toHaveTextContent("idle");
  });

  it("ignores repeated starts while busy and cancels out and hold timers on unmount", () => {
    const firstCommit = vi.fn();
    const secondCommit = vi.fn();
    const phases: string[] = [];
    function Test() {
      const transition = useHouseTransition(false);
      useEffect(() => {
        phases.push(transition.phase);
      }, [transition.phase]);
      return <><button onClick={() => transition.start(firstCommit, "door")}>first</button><button onClick={() => transition.start(secondCommit, "stairs-down")}>second</button></>;
    }
    const view = render(<Test />);
    act(() => screen.getByRole("button", { name: "first" }).click());
    act(() => screen.getByRole("button", { name: "second" }).click());
    expect(sound.playHouseTransitionSound).toHaveBeenCalledTimes(1);
    expect(firstCommit).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(100));
    view.unmount();
    act(() => vi.runAllTimers());
    expect(firstCommit).not.toHaveBeenCalled();
    expect(secondCommit).not.toHaveBeenCalled();

    const holdPhases: string[] = [];
    const holdCommit = vi.fn();
    function HoldTest() {
      const transition = useHouseTransition(false);
      useEffect(() => {
        holdPhases.push(transition.phase);
      }, [transition.phase]);
      return <button onClick={() => transition.start(holdCommit, "door")}>start</button>;
    }
    const holdView = render(<HoldTest />);
    act(() => screen.getByRole("button", { name: "start" }).click());
    act(() => vi.advanceTimersByTime(HOUSE_DOOR_FADE_MS));
    expect(holdCommit).toHaveBeenCalledTimes(1);
    expect(holdPhases).toContain("hold");
    holdView.unmount();
    act(() => vi.runAllTimers());
    expect(holdPhases).not.toContain("in");
  });

  it("uses the latest mute state for preparation and the close cue", () => {
    const commit = vi.fn();
    function Test({ muted }: { muted: boolean }) {
      const transition = useHouseTransition(muted);
      return <><button onClick={() => transition.prepareSound()}>prepare</button><button onClick={() => transition.start(commit, "door")}>start</button></>;
    }
    const view = render(<Test muted={false} />);
    act(() => screen.getByRole("button", { name: "prepare" }).click());
    expect(sound.prepareHouseTransitionSound).toHaveBeenCalledTimes(1);
    act(() => screen.getByRole("button", { name: "start" }).click());
    view.rerender(<Test muted />);
    act(() => vi.advanceTimersByTime(HOUSE_DOOR_FADE_MS));
    expect(sound.playHouseTransitionSound).toHaveBeenCalledTimes(1);
    expect(sound.playHouseTransitionSound).not.toHaveBeenCalledWith("door", true);
  });

  it("reveals the house again when the delayed scene commit throws", () => {
    const error = new Error("scene commit failed");
    const report = vi.spyOn(console, "error").mockImplementation(() => undefined);
    function Test() {
      const transition = useHouseTransition(true);
      return <button onClick={() => transition.start(() => { throw error; }, "door")}>{transition.phase}</button>;
    }
    render(<Test />);

    act(() => screen.getByRole("button").click());
    act(() => vi.advanceTimersByTime(HOUSE_DOOR_FADE_MS));
    expect(screen.getByRole("button")).toHaveTextContent("hold");
    act(() => vi.advanceTimersByTime(HOUSE_DOOR_HOLD_MS + HOUSE_DOOR_FADE_MS));

    expect(screen.getByRole("button")).toHaveTextContent("idle");
    expect(report).toHaveBeenCalledWith("[youngalgy-house] scene transition commit failed", error);
  });
});
