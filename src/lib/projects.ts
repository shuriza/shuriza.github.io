import { unstable_cache } from "next/cache";
import { getPublicProjects } from "@/lib/db/queries";
import { type Project } from "@/lib/project-model";
import { CURATED_PROJECTS } from "@/lib/project-catalog";

export { PROJECT_CATEGORY_LABELS, PROJECT_STATUS_LABELS } from "@/lib/project-model";
export { ARCHIVED_REPOSITORIES, CURATED_PROJECTS } from "@/lib/project-catalog";
export type { Project, ProjectCategory, ProjectStatus } from "@/lib/project-model";

export const PROJECTS_CACHE_TAG = "public-projects";

const curatedByTitle = new Map(CURATED_PROJECTS.map((project) => [project.title, project]));

export function slugifyProjectTitle(title: string) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function enrichProject(project: Project): Project {
  const curated = curatedByTitle.get(project.title);
  if (!curated) {
    return {
      ...project,
      slug: project.slug ?? slugifyProjectTitle(project.title),
      status: project.status ?? (project.demo ? "live" : "private"),
      category: project.category ?? "case-study",
      features: project.features ?? [],
      screenshots: project.screenshots ?? [],
      video: project.video ?? null,
    };
  }

  return {
    ...project,
    description: curated.description,
    tech: curated.tech,
    github: curated.github,
    demo: curated.demo,
    featured: curated.featured,
    published: project.published,
    sort_order: curated.sort_order,
    slug: project.slug ?? curated.slug ?? slugifyProjectTitle(curated.title),
    status: curated.status,
    category: curated.category,
    problem: curated.problem,
    role: curated.role,
    features: curated.features,
    limitations: curated.limitations,
    video: curated.video ?? null,
    screenshots: curated.screenshots ?? [],
  };
}

export function mergeCuratedProjects(projects: Project[]): Project[] {
  const normalized = projects.map(enrichProject);
  const knownTitles = new Set(normalized.map((project) => project.title));
  const additions = CURATED_PROJECTS.filter((project) => !knownTitles.has(project.title)).map(enrichProject);

  return [...normalized, ...additions]
    .filter((project) => project.published)
    .sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title, "id"));
}

const fallbackProjects: Project[] = CURATED_PROJECTS;

const getCachedPublishedProjects = unstable_cache(async (): Promise<Project[]> => {
  try {
    return (await getPublicProjects()) as Project[];
  } catch (error) {
    console.error("[projects] gagal memuat data publik:", error);
    return fallbackProjects;
  }
}, [PROJECTS_CACHE_TAG], { tags: [PROJECTS_CACHE_TAG], revalidate: 300 });

export async function getPublishedProjects(): Promise<Project[]> {
  const sourceProjects = process.env.DATABASE_URL ? await getCachedPublishedProjects() : fallbackProjects;
  return mergeCuratedProjects(sourceProjects);
}

export async function getProjectBySlug(slug: string) {
  const projects = await getPublishedProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}
