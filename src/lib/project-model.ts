export type ProjectStatus = "live" | "hosted" | "video" | "case-study" | "private";
export type ProjectCategory = "web" | "laravel" | "mobile-desktop" | "ai-automation" | "case-study";

export interface Project {
  id: string;
  /** Stable link to the curated catalog; remains stable when the title changes. */
  catalog_key?: string;
  title: string;
  description: string;
  tech: string[];
  github: string | null;
  demo: string | null;
  slug?: string;
  status?: ProjectStatus;
  category?: ProjectCategory;
  problem?: string;
  role?: string;
  features?: string[];
  limitations?: string;
  video?: string | null;
  screenshots?: string[];
  featured: boolean;
  published: boolean;
  sort_order: number;
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  live: "Live Demo",
  hosted: "Hosted Demo",
  video: "Video Demo",
  "case-study": "Case Study / Source",
  private: "Private Case Study",
};

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  web: "Web",
  laravel: "Laravel",
  "mobile-desktop": "Mobile / Desktop",
  "ai-automation": "AI & Automation",
  "case-study": "Case Study",
};

export function isProjectStatus(value: unknown): value is ProjectStatus {
  return value === "live" || value === "hosted" || value === "video" || value === "case-study" || value === "private";
}

export function isProjectCategory(value: unknown): value is ProjectCategory {
  return value === "web" || value === "laravel" || value === "mobile-desktop" || value === "ai-automation" || value === "case-study";
}
