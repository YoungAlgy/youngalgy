import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (name: string) => readFileSync(path.resolve(process.cwd(), name), "utf8");

describe("static route shells", () => {
  it("boots the React app from every HTML entry", () => {
    const entries = [
      "index.html",
      "retired.html",
      "privacy.html",
      "terms.html",
      "404.html",
    ];

    for (const entry of entries) {
      const html = projectFile(entry);
      expect(html, entry).toContain('<div id="root"></div>');
      expect(html, entry).toContain('src="/src/main.tsx"');
    }
  });

  it.each(["404.html", "retired.html"])("keeps %s out of search and social previews", (entry) => {
    const html = projectFile(entry);

    expect(html).toContain('content="noindex, nofollow"');
    expect(html).not.toContain('rel="canonical"');
    expect(html).not.toContain('property="og:');
    expect(html).not.toContain('name="twitter:');
  });

  it("keeps clean internal routes on explicit static rewrites", () => {
    const redirects = projectFile("public/_redirects");
    const expected = [
      "/freelance /retired 200",
      "/creditkit /retired 200",
      "/baselens /retired 200",
      "/applykit /retired 200",
    ];

    for (const rule of expected) {
      expect(redirects).toContain(rule);
    }
    expect(redirects).not.toContain("/privacy /privacy.html 200");
    expect(redirects).not.toContain("/terms /terms.html 200");
    expect(redirects).not.toMatch(/^\/\*\s/m);
  });
});
