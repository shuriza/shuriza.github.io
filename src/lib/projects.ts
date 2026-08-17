import { createSupabaseServerClient } from "@/lib/supabase/server";

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
    github: "https://github.com/shuriza/shuriza-store",
    demo: "https://shurizastore.my.id/",
    featured: true,
    published: true,
    sort_order: 0,
  },
];

export async function getPublishedProjects(): Promise<Project[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return fallbackProjects;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallbackProjects;

  const { data, error } = await supabase
    .from("projects")
    .select("id, title, description, tech, github, demo, featured, published, sort_order")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load published projects:", error.message);
    return fallbackProjects;
  }

  return data ?? [];
}
