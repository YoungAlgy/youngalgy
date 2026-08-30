/** @vitest-environment jsdom */

import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useRouteHead } from "@/components/landing/useRouteHead";
import NotFound from "@/pages/NotFound";

type HeadConfig = Parameters<typeof useRouteHead>[0];

const homeHead: HeadConfig = {
  title: "Alex Holmes | Healthcare Recruiting & Operations",
  description: "Home description",
  url: "https://youngalgy.com/",
  image: "https://youngalgy.com/og-profile-2026-08-29.png",
  imageAlt: "Alex Holmes portfolio preview",
};

const productHead: HeadConfig = {
  title: "Project | Alex Holmes",
  description: "Project description",
  url: "https://youngalgy.com/project",
  image: "https://youngalgy.com/og-profile-2026-08-29.png",
  imageAlt: "Project preview",
  type: "product",
  robots: "noindex, nofollow",
};

let root: Root;

function HeadHarness({ config }: { config: HeadConfig }) {
  useRouteHead(config);
  return null;
}

function mount(children: ReactNode) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(children));
}

function meta(selector: string) {
  return document.head.querySelector<HTMLMetaElement>(selector)?.content;
}

beforeEach(() => {
  document.head.innerHTML = "";
  document.body.innerHTML = "";
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  if (root) {
    act(() => root.unmount());
  }
});

describe("route metadata", () => {
  it("writes the full metadata set for a route", () => {
    mount(<HeadHarness config={productHead} />);

    expect(document.title).toBe(productHead.title);
    expect(meta('meta[name="description"]')).toBe(productHead.description);
    expect(meta('meta[name="robots"]')).toBe("noindex, nofollow");
    expect(meta('meta[property="og:type"]')).toBe("product");
    expect(meta('meta[property="og:url"]')).toBe(productHead.url);
    expect(meta('meta[property="og:image"]')).toBe(productHead.image);
    expect(meta('meta[property="og:image:alt"]')).toBe(productHead.imageAlt);
    expect(meta('meta[name="twitter:image:alt"]')).toBe(productHead.imageAlt);
    expect(document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe(
      productHead.url,
    );
  });

  it("replaces product metadata after client-side navigation", () => {
    mount(<HeadHarness config={productHead} />);
    act(() => root.render(<HeadHarness config={homeHead} />));

    expect(document.title).toBe(homeHead.title);
    expect(meta('meta[name="robots"]')).toBe("index, follow");
    expect(meta('meta[property="og:type"]')).toBe("website");
    expect(meta('meta[property="og:url"]')).toBe(homeHead.url);
    expect(meta('meta[property="og:image"]')).toBe(homeHead.image);
    expect(meta('meta[name="twitter:image"]')).toBe(homeHead.image);
    expect(document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe(
      homeHead.url,
    );
  });

  it("clears stale social and canonical tags on a missing route", () => {
    mount(<HeadHarness config={productHead} />);
    document.head.insertAdjacentHTML(
      "beforeend",
      '<meta property="og:site_name" content="Alex Holmes"><meta property="og:locale" content="en_US"><meta name="twitter:site" content="@youngalgy"><meta name="twitter:creator" content="@youngalgy">',
    );
    act(() => root.render(<NotFound />));

    expect(document.title).toBe("Page missing | Alex Holmes");
    expect(meta('meta[name="description"]')).toBe("That page does not exist.");
    expect(meta('meta[name="robots"]')).toBe("noindex, nofollow");
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.head.querySelector('meta[property^="og:"]')).toBeNull();
    expect(document.head.querySelector('meta[name^="twitter:"]')).toBeNull();
  });
});
