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

  it("keeps visual evidence attached to flagship case studies", () => {
    const flagshipIds = ["luncur", "rekap-absensi-dpmptsp"];
    expect(
      flagshipIds.every((id) => {
        const project = CURATED_PROJECTS.find((candidate) => candidate.id === id);
        return Boolean(project?.screenshots?.length);
      }),
    ).toBe(true);
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
    expect(merged[0].description).toBe("Deskripsi lama dari CMS");
    expect(merged[0].github).toBe("https://github.com/example/private");
    expect(merged[0].catalog_key).toBe(first.id);
  });

  it("keeps a curated project linked after its CMS title changes", () => {
    const first = CURATED_PROJECTS[0];
    const merged = mergeCuratedProjects([
      {
        ...first,
        id: "00000000-0000-4000-8000-000000000001",
        catalog_key: first.id,
        title: "Nama baru yang tetap stabil",
        published: true,
      },
    ]);

    expect(merged.filter((project) => project.catalog_key === first.id)).toHaveLength(1);
    expect(merged.find((project) => project.catalog_key === first.id)?.title).toBe("Nama baru yang tetap stabil");
  });

  it("keeps archived repositories as external evidence links", () => {
    expect(ARCHIVED_REPOSITORIES.length).toBeGreaterThan(3);
    expect(ARCHIVED_REPOSITORIES.every((repository) => repository.url.startsWith("https://github.com/"))).toBe(true);
  });
});
