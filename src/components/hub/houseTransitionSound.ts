export type HouseTransitionCue = "door" | "stairs-up" | "stairs-down";

export const HOUSE_TRANSITION_NOTES = {
  doorOpen: [[0, 330], [0.055, 494], [0.11, 659]],
  doorClose: [[0, 440], [0.055, 294], [0.11, 196]],
  stairsUp: [[0, 294], [0.055, 392], [0.11, 523], [0.165, 698]],
  stairsDown: [[0, 698], [0.055, 523], [0.11, 392], [0.165, 294]],
} as const;

let sfxContext: AudioContext | null = null;

function contextOrNull(): AudioContext | null {
  try {
    if (typeof window === "undefined" || typeof AudioContext === "undefined") return null;
    if (!sfxContext) sfxContext = new AudioContext();
    return sfxContext;
  } catch {
    return null;
  }
}

export function prepareHouseTransitionSound(): void {
  try {
    const context = contextOrNull();
    if (context?.state === "suspended") void context.resume().catch(() => undefined);
  } catch {
    // Sound is optional and must never block a transition.
  }
}

export function playHouseTransitionSound(cue: HouseTransitionCue, closing = false): void {
  try {
    const context = contextOrNull();
    if (!context) return;
    if (context.state === "suspended") void context.resume().catch(() => undefined);
    const notes = closing
      ? HOUSE_TRANSITION_NOTES.doorClose
      : cue === "door"
        ? HOUSE_TRANSITION_NOTES.doorOpen
        : cue === "stairs-up"
          ? HOUSE_TRANSITION_NOTES.stairsUp
          : HOUSE_TRANSITION_NOTES.stairsDown;
    const start = context.currentTime;
    for (const [offset, frequency] of notes) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "square";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start + offset);
      gain.gain.exponentialRampToValueAtTime(0.09, start + offset + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.06);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start + offset);
      oscillator.stop(start + offset + 0.07);
    }
  } catch {
    // Sound is optional and must never block a transition.
  }
}
