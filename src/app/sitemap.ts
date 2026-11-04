import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/projects";
import { getSiteSettings } from "@/lib/settings-server";

const siteUrl = "https://shuriza.tech";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, projects] = await Promise.all([getSiteSettings(), getPublishedProjects()]);
  const pages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/projects`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...projects.map((project) => ({
      url: `${siteUrl}/projects/${project.slug ?? project.id}`,
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.8 : 0.6,
    })),
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
