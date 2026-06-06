import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const routes = [
  "",
  "/about",
  "/services",
  "/services/china-visa",
  "/apply-now",
  "/track-application",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
