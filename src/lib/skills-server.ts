import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fallbackSkills, type Skill } from "@/lib/skills";

export async function getPublishedSkills(): Promise<Skill[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return fallbackSkills;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallbackSkills;

  const { data, error } = await supabase
    .from("skills")
    .select("id, name, category, icon, color, published, sort_order")
    .eq("published", true)
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    if (error) console.error("Failed to load published skills:", error.message);
    return fallbackSkills;
  }

  return data as Skill[];
}
