export type ProjectStatus = "live" | "hosted" | "video" | "case-study" | "private";
export type ProjectCategory = "web" | "laravel" | "mobile-desktop" | "ai-automation" | "case-study";

export interface Project {
  id: string;
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
