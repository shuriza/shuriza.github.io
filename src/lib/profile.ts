import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface CvLanguage {
  name: string;
  level: string;
}

export interface Profile {
  id: number;
  display_name: string;
  short_name: string;
  role: string;
  bio_primary: string;
  bio_secondary: string;
  location: string;
  focus: string;
  education: string;
  status: string;
  email: string;
  github: string;
  linkedin: string;
  website: string;
  hero_roles: string[];
  hero_description: string;
  /** Headline khusus halaman CV. Kosong berarti pakai `role`. */
  cv_headline: string;
  /** Paragraf ringkasan di bagian atas CV. */
  cv_summary: string;
  soft_skills: string[];
  languages: CvLanguage[];
}

export const fallbackProfile: Profile = {
  id: 1,
  display_name: "M. Firdaus Suryaningrat",
  short_name: "Shuriza",
  role: "Fullstack Web Developer",
  bio_primary:
    "Halo! Saya Shuriza, seorang fullstack web developer dari Kediri, Jawa Timur. Saya passionate dalam membangun aplikasi web modern yang clean, performant, dan user-friendly.",
  bio_secondary:
    "Dengan pengalaman di React, Next.js, Laravel, dan berbagai teknologi web modern, saya selalu berusaha menciptakan solusi digital yang memberikan dampak nyata.",
  location: "Kediri, Jawa Timur",
  focus: "Fullstack Web",
  education: "Informatics Eng.",
  status: "Open to work",
  email: "firdausmfirdaus657@gmail.com",
  github: "https://github.com/shuriza",
  linkedin: "https://linkedin.com/in/shuriza",
  website: "https://shuriza.me",
  hero_roles: [
    "I build modern web apps",
    "I craft clean & scalable code",
    "I turn ideas into reality",
    "I love React & Laravel",
  ],
  hero_description:
    "Saya membangun aplikasi web yang rapi, cepat, dan siap dipakai menggunakan React, Next.js, dan Laravel.",
  cv_headline: "Fullstack Web Developer",
  cv_summary:
    "Fullstack web developer dengan fokus pada pengembangan web modern: React/Next.js untuk frontend dan Laravel untuk backend. Terbiasa membangun aplikasi produksi end-to-end — dari desain database, REST API, integrasi layanan pihak ketiga, hingga deployment. Terbuka untuk peluang freelance, kontrak, dan full-time.",
  soft_skills: ["Self-learning", "Problem Solving", "Team Collaboration", "Time Management"],
  languages: [
    { name: "Bahasa Indonesia", level: "Native" },
    { name: "English", level: "Basic" },
  ],
};

/** Kolom `languages` disimpan sebagai jsonb, jadi bentuknya harus divalidasi saat dibaca. */
function normalizeLanguages(value: unknown): CvLanguage[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      name: String(item.name ?? "").trim(),
      level: String(item.level ?? "").trim(),
    }))
    .filter((item) => item.name.length > 0);
}

/** Dibungkus `cache()` agar `generateMetadata` dan page tidak query dua kali per request. */
export const getProfile = cache(async (): Promise<Profile> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return fallbackProfile;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallbackProfile;

  const { data, error } = await supabase.from("profile").select("*").eq("id", 1).maybeSingle();

  if (error || !data) {
    if (error) console.error("Failed to load profile:", error.message);
    return fallbackProfile;
  }

  const merged = { ...fallbackProfile, ...data } as Profile;

  // Kolom CV baru mungkin belum ada jika migration terakhir belum dijalankan,
  // jadi setiap field di-resolve satu per satu dengan fallback yang aman.
  return {
    ...merged,
    cv_headline: merged.cv_headline || merged.role || fallbackProfile.cv_headline,
    cv_summary: merged.cv_summary || fallbackProfile.cv_summary,
    soft_skills: Array.isArray(data.soft_skills)
      ? data.soft_skills.map((item: unknown) => String(item))
      : fallbackProfile.soft_skills,
    languages:
      data.languages === undefined
        ? fallbackProfile.languages
        : normalizeLanguages(data.languages),
  };
});
