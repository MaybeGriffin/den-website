import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://denbible.com/sitemap.xml",
    host: "https://denbible.com",
  };
}
