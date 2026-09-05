export type HouseCharacterId = "algy" | "mitch";

export const ALGY_HOUSE_CHARACTER_PARAM = "character";
export const ALGY_HOUSE_RETURN_PARAM = "return";
export const ALGY_HOUSE_RETURN_MARKER = "algy-porch";

/** Only the two house visitor identities can cross the public-site boundary. */
export function houseCharacterFromSearch(search: string): HouseCharacterId {
  try {
    return new URLSearchParams(search).get(ALGY_HOUSE_CHARACTER_PARAM) === "mitch"
      ? "mitch"
      : "algy";
  } catch {
    return "algy";
  }
}

/** A plain direct house visit has no visitor handoff. */
export function hasExplicitHouseVisitor(search: string): boolean {
  try {
    const character = new URLSearchParams(search).get(ALGY_HOUSE_CHARACTER_PARAM);
    return character === "algy" || character === "mitch";
  } catch {
    return false;
  }
}

export function isAlgyHouseTownArrival(search: string): boolean {
  try {
    return new URLSearchParams(search).get(ALGY_HOUSE_RETURN_PARAM) === ALGY_HOUSE_RETURN_MARKER;
  } catch {
    return false;
  }
}

/** Adds only the selected visitor and a fixed return marker to a known house URL. */
export function algyHouseVisitorHref(href: string, characterId: HouseCharacterId): string {
  const url = new URL(href, "https://toggle.town");
  url.searchParams.set(ALGY_HOUSE_CHARACTER_PARAM, characterId);
  url.searchParams.set(ALGY_HOUSE_RETURN_PARAM, ALGY_HOUSE_RETURN_MARKER);
  return href.startsWith("/") ? `${url.pathname}${url.search}${url.hash}` : url.toString();
}

/** Return is deliberately limited to Toggle Town's pixel map, never a supplied URL. */
export function algyHouseTownReturnHref(localPreview: boolean, characterId: HouseCharacterId): string {
  return algyHouseVisitorHref(
    localPreview ? "/pixel" : "https://toggle.town/pixel",
    characterId,
  );
}

/** Remove only the one-time arrival marker after it has reset the old room visit. */
export function houseVisitorReloadHref(href: string): string {
  const url = new URL(href, "https://youngalgy.com");
  url.searchParams.delete(ALGY_HOUSE_RETURN_PARAM);
  return href.startsWith("/") ? `${url.pathname}${url.search}${url.hash}` : url.toString();
}

/** Keep town's history entry in sync after an allowed character-picker swap. */
export function townVisitorReloadHref(href: string, characterId: HouseCharacterId): string {
  const url = new URL(href, "https://toggle.town");
  url.searchParams.set(ALGY_HOUSE_CHARACTER_PARAM, characterId);
  url.searchParams.delete(ALGY_HOUSE_RETURN_PARAM);
  return href.startsWith("/") ? `${url.pathname}${url.search}${url.hash}` : url.toString();
}

