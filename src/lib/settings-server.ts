import { unstable_cache } from "next/cache";
import { getPublicSettings } from "@/lib/db/queries";
import { fallbackSettings, resolveSettings, type SiteSettings } from "@/lib/settings";


export const SETTINGS_CACHE_TAG = "public-settings";

const getCachedSiteSettings = unstable_cache(async (): Promise<SiteSettings> => {
  try {
    const data = await getPublicSettings();
    if (!data) {
      console.error("[settings] baris pengaturan situs utama tidak ditemukan");
      return fallbackSettings;
    }

    const settings = resolveSettings(data);
    const disabled = Object.entries(settings)
      .filter(([key, value]) => key !== "id" && value === false)
      .map(([key]) => key);

    if (disabled.length > 0) {
      console.info(`[settings] fitur dimatikan: ${disabled.join(", ")}`);
    }

    return settings;
  } catch (error) {
    console.error("[settings] gagal memuat data publik:", error);
    return fallbackSettings;
  }
}, [SETTINGS_CACHE_TAG], { tags: [SETTINGS_CACHE_TAG], revalidate: 300 });


export async function getSiteSettings(): Promise<SiteSettings> {
  if (!process.env.DATABASE_URL) {
    return fallbackSettings;
  }

  return getCachedSiteSettings();
}
