/**
 * Definisi feature toggle. Modul ini sengaja bebas dependensi server
 * (tidak menyentuh next/headers) supaya bisa diimpor client component juga.
 * Query-nya ada di `settings-server.ts`.
 */
export const FEATURE_TOGGLES = [
  {
    key: "about_enabled",
    label: "Section About",
    description: "Terminal animasi dan bio di halaman utama.",
  },
  {
    key: "skills_enabled",
    label: "Section Skills",
    description: "Grid skill per kategori di halaman utama.",
  },
  {
    key: "projects_enabled",
    label: "Section Projects",
    description: "Daftar project di halaman utama.",
  },
  {
    key: "contact_enabled",
    label: "Section Contact",
    description: "Blok call-to-action email, CV, dan GitHub.",
  },
  {
    key: "cv_enabled",
    label: "Halaman CV",
    description: "Rute /cv beserta link-nya. Saat nonaktif, /cv membalas 404.",
  },
  {
    key: "particles_enabled",
    label: "Background 3D",
    description: "Partikel Three.js di Hero. Matikan agar halaman lebih ringan.",
  },
  {
    key: "admin_link_enabled",
    label: "Tombol Login di navbar",
    description:
      "Hanya menyembunyikan tombolnya. Rute /admin/login tetap bisa diakses langsung.",
  },
] as const satisfies readonly {
  key: string;
  label: string;
  description: string;
}[];

export type FeatureFlagKey = (typeof FEATURE_TOGGLES)[number]["key"];

export type SiteSettings = { id: number } & Record<FeatureFlagKey, boolean>;

/** Semua fitur aktif. Dipakai saat Supabase belum dikonfigurasi atau migration belum dijalankan. */
export const fallbackSettings: SiteSettings = {
  id: 1,
  about_enabled: true,
  skills_enabled: true,
  projects_enabled: true,
  contact_enabled: true,
  cv_enabled: true,
  particles_enabled: true,
  admin_link_enabled: true,
};

/**
 * Ubah satu baris `site_settings` menjadi SiteSettings.
 *
 * Sengaja tidak memakai spread mentah: kolom yang belum ada, bernilai null, atau
 * bertipe tak terduga harus jatuh ke default "aktif", bukan jadi falsy yang
 * menyembunyikan section tanpa sebab.
 */
export function resolveSettings(row: unknown): SiteSettings {
  const settings: SiteSettings = { ...fallbackSettings };
  if (typeof row !== "object" || row === null) return settings;

  const record = row as Record<string, unknown>;

  for (const toggle of FEATURE_TOGGLES) {
    const value = record[toggle.key];
    if (typeof value === "boolean") {
      settings[toggle.key] = value;
    } else if (value === "true" || value === "false") {
      settings[toggle.key] = value === "true";
    }
    // null / undefined / kolom tidak ada: biarkan default aktif.
  }

  return settings;
}
