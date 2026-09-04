import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/settings-server";

const siteUrl = "https://shuriza.tech";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  const pages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  if (settings.cv_enabled) {
    pages.push({
      url: `${siteUrl}/cv`,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return pages;
}
