import { unstable_cache } from "next/cache";
import { getPublicSkills } from "@/lib/db/queries";
import { fallbackSkills, type Skill } from "@/lib/skills";


export const SKILLS_CACHE_TAG = "public-skills";

const getCachedPublishedSkills = unstable_cache(async (): Promise<Skill[]> => {
  try {
    const data = await getPublicSkills();
    return data.length ? (data as Skill[]) : fallbackSkills;
  } catch (error) {
    console.error("[skills] gagal memuat data publik:", error);
    return fallbackSkills;
  }
}, [SKILLS_CACHE_TAG], { tags: [SKILLS_CACHE_TAG], revalidate: 300 });


export async function getPublishedSkills(): Promise<Skill[]> {
  if (!process.env.DATABASE_URL) {
    return fallbackSkills;
  }

  return getCachedPublishedSkills();
}
