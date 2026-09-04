import { unstable_cache } from "next/cache";
import { createAnonymousSupabaseClient, isMissingRelationError } from "@/lib/supabase/anonymous";

export const PROJECTS_CACHE_TAG = "public-projects";

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github: string | null;
  demo: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
}

const fallbackProjects: Project[] = [
  {
    id: "shuriza-store",
    title: "Shuriza Store",
    description:
      "E-commerce platform with product catalog, shopping cart, and order management system.",
    tech: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    github: null,
    demo: "https://shurizastore.biz.id/",
    featured: true,
    published: true,
    sort_order: 0,
  },
];

const getCachedPublishedProjects = unstable_cache(async (): Promise<Project[]> => {
  const supabase = createAnonymousSupabaseClient();
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

  const response = await supabase
    .from("portfolio_projects")
    .select("id, title, description, tech, github, demo, featured, published, sort_order")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });
  const { data, error } = isMissingRelationError(response.error, "portfolio_projects")
    ? await supabase
        .from("projects")
        .select("id, title, description, tech, github, demo, featured, published, sort_order")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
    : response;

  if (error) {
    console.error("[projects] gagal memuat data publik:", error);
    return fallbackProjects;
  }

  return (data ?? []) as unknown as Project[];
}, [PROJECTS_CACHE_TAG], { tags: [PROJECTS_CACHE_TAG], revalidate: 300 });

export async function getPublishedProjects(): Promise<Project[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return fallbackProjects;
  }

  return getCachedPublishedProjects();
}
