import { unstable_cache } from "next/cache";
import { getPublicProjects } from "@/lib/db/queries";
import { isProjectCategory, isProjectStatus, type Project } from "@/lib/project-model";
import { CURATED_PROJECTS } from "@/lib/project-catalog";

export { PROJECT_CATEGORY_LABELS, PROJECT_STATUS_LABELS } from "@/lib/project-model";
export { ARCHIVED_REPOSITORIES, CURATED_PROJECTS } from "@/lib/project-catalog";
export type { Project, ProjectCategory, ProjectStatus } from "@/lib/project-model";

export const PROJECTS_CACHE_TAG = "public-projects";

const curatedByKey = new Map(CURATED_PROJECTS.map((project) => [project.id, project]));
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
  const curated = (project.catalog_key ? curatedByKey.get(project.catalog_key) : undefined) ?? curatedByTitle.get(project.title);
  if (!curated) {
    return {
      ...project,
      catalog_key: project.catalog_key,
      slug: project.slug ?? (slugifyProjectTitle(project.title) || project.id),
      status: isProjectStatus(project.status) ? project.status : project.demo ? "live" : "private",
      category: isProjectCategory(project.category) ? project.category : "case-study",
      features: project.features ?? [],
      screenshots: project.screenshots ?? [],
      video: project.video ?? null,
    };
  }

  return {
    ...curated,
    ...project,
    catalog_key: project.catalog_key ?? curated.id,
    description: project.description?.trim() || curated.description,
    tech: project.tech?.length ? project.tech : curated.tech,
    github: project.github ?? curated.github,
    demo: project.demo ?? curated.demo,
    published: project.published,
    featured: project.featured,
    sort_order: project.sort_order,
    slug: project.slug ?? curated.slug ?? (slugifyProjectTitle(curated.title) || curated.id),
    status: isProjectStatus(project.status) ? project.status : curated.status,
    category: isProjectCategory(project.category) ? project.category : curated.category,
    problem: project.problem?.trim() || curated.problem,
    role: project.role?.trim() || curated.role,
    features: project.features?.length ? project.features : curated.features ?? [],
    limitations: project.limitations?.trim() || curated.limitations,
    video: project.video ?? curated.video ?? null,
    screenshots: project.screenshots?.length ? project.screenshots : curated.screenshots ?? [],
  };
}

export function mergeCuratedProjects(projects: Project[]): Project[] {
  const normalized = projects.map(enrichProject);
  const knownCatalogKeys = new Set(normalized.map((project) => project.catalog_key).filter(Boolean));
  const knownTitles = new Set(normalized.map((project) => project.title));
  const additions = CURATED_PROJECTS
    .filter((project) => !knownCatalogKeys.has(project.id) && !knownTitles.has(project.title))
    .map(enrichProject);

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
