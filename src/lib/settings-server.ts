import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fallbackSettings, resolveSettings, type SiteSettings } from "@/lib/settings";

/**
 * Dibungkus `cache()` agar halaman yang memanggilnya lebih dari sekali
 * (mis. `generateMetadata` dan komponen page) hanya sekali query per request.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return fallbackSettings;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallbackSettings;

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    // Tabel belum ada atau baris belum dibuat: anggap semua fitur aktif.
    if (error) console.error("[settings] gagal membaca site_settings:", error.message);
    else console.warn("[settings] baris site_settings id=1 tidak ada, semua fitur dianggap aktif.");
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
});
