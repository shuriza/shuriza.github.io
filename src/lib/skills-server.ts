import { unstable_cache } from "next/cache";
import { createAnonymousSupabaseClient, isMissingRelationError } from "@/lib/supabase/anonymous";
import { fallbackSkills, type Skill } from "@/lib/skills";

export const SKILLS_CACHE_TAG = "public-skills";

const getCachedPublishedSkills = unstable_cache(async (): Promise<Skill[]> => {
  const supabase = createAnonymousSupabaseClient();
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

  const response = await supabase
    .from("portfolio_skills")
    .select("id, name, category, icon, color, published, sort_order")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });
  const { data, error } = isMissingRelationError(response.error, "portfolio_skills")
    ? await supabase
        .from("skills")
        .select("id, name, category, icon, color, published, sort_order")
        .eq("published", true)
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true })
    : response;

  if (error) {
    console.error("[skills] gagal memuat data publik:", error);
    return fallbackSkills;
  }

  return data?.length ? (data as unknown as Skill[]) : fallbackSkills;
}, [SKILLS_CACHE_TAG], { tags: [SKILLS_CACHE_TAG], revalidate: 300 });

export async function getPublishedSkills(): Promise<Skill[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return fallbackSkills;
  }

  return getCachedPublishedSkills();
}
