import { describe, expect, it } from "vitest";
import { ARCHIVED_REPOSITORIES, CURATED_PROJECTS } from "@/lib/project-catalog";
import { mergeCuratedProjects } from "@/lib/projects";

describe("project catalog", () => {
  it("keeps every curated project addressable and uniquely identified", () => {
    expect(CURATED_PROJECTS.length).toBeGreaterThan(10);
    expect(new Set(CURATED_PROJECTS.map((project) => project.id)).size).toBe(CURATED_PROJECTS.length);
    expect(CURATED_PROJECTS.every((project) => project.title.trim() && project.description.trim())).toBe(true);
  });

  it("does not claim a live demo without a demo URL", () => {
    expect(CURATED_PROJECTS.filter((project) => project.status === "live").every((project) => project.demo)).toBe(true);
  });

  it("merges the catalog into existing CMS rows without duplicating titles", () => {
    const first = CURATED_PROJECTS[0];
    const merged = mergeCuratedProjects([
      {
        ...first,
        description: "Deskripsi lama dari CMS",
        github: "https://github.com/example/private",
        demo: null,
        published: true,
      },
    ]);

    expect(merged).toHaveLength(CURATED_PROJECTS.length);
    expect(merged.filter((project) => project.title === first.title)).toHaveLength(1);
    expect(merged[0].description).toBe(first.description);
    expect(merged[0].github).toBe(first.github);
  });

  it("keeps archived repositories as external evidence links", () => {
    expect(ARCHIVED_REPOSITORIES.length).toBeGreaterThan(3);
    expect(ARCHIVED_REPOSITORIES.every((repository) => repository.url.startsWith("https://github.com/"))).toBe(true);
  });
});
