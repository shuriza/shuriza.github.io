import { unstable_cache } from "next/cache";
import { createAnonymousSupabaseClient, isMissingRelationError } from "@/lib/supabase/anonymous";
import { fallbackSettings, resolveSettings, type SiteSettings } from "@/lib/settings";

export const SETTINGS_CACHE_TAG = "public-settings";

const getCachedSiteSettings = unstable_cache(async (): Promise<SiteSettings> => {
  const supabase = createAnonymousSupabaseClient();
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

  const response = await supabase
    .from("portfolio_site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  const { data, error } = isMissingRelationError(response.error, "portfolio_site_settings")
    ? await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle()
    : response;

  if (error || !data) {
    console.error("[settings] gagal memuat data publik:", error ?? "baris pengaturan situs utama tidak ditemukan");
    return fallbackSettings;
  }

  // The public view is intentionally not part of the generated Supabase schema.
  const settings = resolveSettings(data as Record<string, unknown>);
  const disabled = Object.entries(settings)
    .filter(([key, value]) => key !== "id" && value === false)
    .map(([key]) => key);

  if (disabled.length > 0) {
    console.info(`[settings] fitur dimatikan: ${disabled.join(", ")}`);
  }

  return settings;
}, [SETTINGS_CACHE_TAG], { tags: [SETTINGS_CACHE_TAG], revalidate: 300 });

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return fallbackSettings;
  }

  return getCachedSiteSettings();
}
