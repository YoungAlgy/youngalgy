import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const source = (file: string) => readFileSync(path.resolve(process.cwd(), file), "utf8");

describe("House legal disclosures", () => {
  it("discloses the browser-only House and legacy legal-page settings", () => {
    const privacy = source("src/pages/Privacy.tsx");

    expect(privacy).toContain("youngalgy:house-audio");
    expect(privacy).toContain("current room and position");
    expect(privacy).toContain("sessionStorage");
    expect(privacy).toContain("not sent to me");
    expect(privacy).toContain("landing-mode");
    expect(privacy).toContain('lastUpdated="2026-09-04"');
  });

  it("keeps current Terms copy and static metadata aligned", () => {
    const terms = source("src/pages/Terms.tsx");
    const termsHtml = source("terms.html");

    expect(terms).toContain('description="Terms of use for youngalgy.com."');
    expect(terms).toContain("explorable Algy&apos;s House and music by Young Algy");
    expect(terms).toContain('lastUpdated="2026-09-04"');
    expect(termsHtml).toContain('content="Terms of use for youngalgy.com."');
  });
});
