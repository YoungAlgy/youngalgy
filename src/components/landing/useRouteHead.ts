import { useEffect } from "react";

type RouteHeadConfig = {
  title: string;
  description: string;
  url: string;
  image: string;
  imageAlt: string;
  socialTitle?: string;
  socialDescription?: string;
  type?: "website" | "product";
  robots?: string;
  imageWidth?: number;
  imageHeight?: number;
  siteName?: string;
};

export function useRouteHead({
  title,
  description,
  url,
  image,
  imageAlt,
  socialTitle = title,
  socialDescription = description,
  type = "website",
  robots = "index, follow",
  imageWidth = 1731,
  imageHeight = 909,
  siteName = "Alex Holmes",
}: RouteHeadConfig) {
  useEffect(() => {
    document.title = title;

    const setMeta = (attr: "name" | "property", key: string, value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute("content", value);
    };

    setMeta("name", "description", description);
    setMeta("name", "robots", robots);
    setMeta("property", "og:type", type);
    setMeta("property", "og:title", socialTitle);
    setMeta("property", "og:description", socialDescription);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", image);
    setMeta("property", "og:image:width", String(imageWidth));
    setMeta("property", "og:image:height", String(imageHeight));
    setMeta("property", "og:image:type", "image/png");
    setMeta("property", "og:image:alt", imageAlt);
    setMeta("property", "og:site_name", siteName);
    setMeta("property", "og:locale", "en_US");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:site", "@youngalgy");
    setMeta("name", "twitter:creator", "@youngalgy");
    setMeta("name", "twitter:title", socialTitle);
    setMeta("name", "twitter:description", socialDescription);
    setMeta("name", "twitter:image", image);
    setMeta("name", "twitter:image:alt", imageAlt);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);
  }, [
    title,
    description,
    url,
    image,
    imageAlt,
    socialTitle,
    socialDescription,
    type,
    robots,
    imageWidth,
    imageHeight,
    siteName,
  ]);
}
