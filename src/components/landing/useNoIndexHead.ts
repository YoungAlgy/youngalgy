import { useEffect } from "react";

type NoIndexHeadConfig = {
  title: string;
  description: string;
};

const SOCIAL_SELECTORS = [
  'meta[property="og:type"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[property="og:url"]',
  'meta[property="og:image"]',
  'meta[property="og:image:width"]',
  'meta[property="og:image:height"]',
  'meta[property="og:image:type"]',
  'meta[property="og:image:alt"]',
  'meta[property="og:site_name"]',
  'meta[property="og:locale"]',
  'meta[name="twitter:card"]',
  'meta[name="twitter:site"]',
  'meta[name="twitter:creator"]',
  'meta[name="twitter:title"]',
  'meta[name="twitter:description"]',
  'meta[name="twitter:image"]',
  'meta[name="twitter:image:alt"]',
] as const;

export function useNoIndexHead({ title, description }: NoIndexHeadConfig) {
  useEffect(() => {
    document.title = title;

    const setNamedMeta = (name: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setNamedMeta("description", description);
    setNamedMeta("robots", "noindex, nofollow");
    document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.remove();
    SOCIAL_SELECTORS.forEach((selector) => {
      document.head.querySelectorAll(selector).forEach((element) => element.remove());
    });
  }, [description, title]);
}
