import { unstable_cache } from "next/cache";
import { createAnonymousSupabaseClient, isMissingRelationError } from "@/lib/supabase/anonymous";

export const PROFILE_CACHE_TAG = "public-profile";

const PUBLIC_PROFILE_COLUMNS = [
  "id",
  "display_name",
  "short_name",
  "role",
  "bio_primary",
  "bio_secondary",
  "location",
  "focus",
  "education",
  "status",
  "email",
  "github",
  "linkedin",
  "website",
  "hero_roles",
  "hero_description",
  "cv_headline",
  "cv_summary",
  "soft_skills",
  "languages",
].join(", ");

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
  linkedin: "https://www.linkedin.com/in/m-firdaus-suryaningrat-73a471338/",
  website: "https://shuriza.tech",
  hero_roles: [
    "I build modern web apps",
    "I craft clean & scalable code",
    "I turn ideas into reality",
    "I love React & Laravel",
  ],
  hero_description:
    "Saya membangun aplikasi web yang rapi, cepat, dan siap dipakai menggunakan React, Next.js, dan Laravel.",
  cv_headline: "Junior Fullstack Web Developer",
  cv_summary:
    "Lulusan D3 Manajemen Informatika dengan dasar Rekayasa Perangkat Lunak sejak SMK. Memiliki pengalaman mengerjakan proyek web menggunakan Laravel, PHP, MySQL, React, Next.js, dan TypeScript. Memiliki ketertarikan pada perkembangan Artificial Intelligence (AI).",
  soft_skills: ["Self-learning", "Problem Solving", "Team Collaboration", "Time Management"],
  languages: [
    { name: "Bahasa Indonesia", level: "Native" },
    { name: "English", level: "Basic" },
  ],
};

/** Kolom `languages` disimpan sebagai jsonb, jadi bentuknya harus divalidasi saat dibaca. */
export function normalizeLanguages(value: unknown): CvLanguage[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      name: String(item.name ?? "").trim(),
      level: String(item.level ?? "").trim(),
    }))
    .filter((item) => item.name.length > 0 && item.level.length > 0);
}

type ProfileTextField = Exclude<keyof Profile, "id" | "hero_roles" | "soft_skills" | "languages">;

function profileText(data: Record<string, unknown>, field: ProfileTextField) {
  const value = data[field];
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized && normalized !== "-" ? normalized : fallbackProfile[field];
}

function profileTextList(value: unknown, fallback: string[], allowEmpty: boolean) {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) return fallback;

  const values = value.map((item) => item.trim()).filter(Boolean);
  return values.length > 0 || allowEmpty ? values : fallback;
}

export function normalizeProfile(data: Record<string, unknown>): Profile {
  const cvHeadline = profileText(data, "cv_headline");
  const cvSummary = profileText(data, "cv_summary");
  const usesLegacySummary =
    cvSummary.startsWith("Mahasiswa D3") ||
    cvSummary.startsWith("Fullstack web developer dengan fokus pada pengembangan web modern:");
  const linkedin = profileText(data, "linkedin");
  const website = profileText(data, "website");
  const languages = normalizeLanguages(data.languages);

  return {
    // Construct the public shape explicitly so a legacy `select(*)` fallback
    // can never expose a later private database column to the application.
    id: 1,
    display_name: profileText(data, "display_name"),
    short_name: profileText(data, "short_name"),
    role: profileText(data, "role"),
    bio_primary: profileText(data, "bio_primary"),
    bio_secondary: profileText(data, "bio_secondary"),
    location: profileText(data, "location"),
    focus: profileText(data, "focus"),
    education: profileText(data, "education"),
    status: profileText(data, "status"),
    email: profileText(data, "email"),
    github: profileText(data, "github"),
    linkedin: linkedin === "https://linkedin.com/in/shuriza" ? fallbackProfile.linkedin : linkedin,
    website: website === "https://shuriza.me" ? fallbackProfile.website : website,
    hero_roles: profileTextList(data.hero_roles, fallbackProfile.hero_roles, false),
    hero_description: profileText(data, "hero_description"),
    cv_headline:
      cvHeadline === "Fullstack Web Developer"
        ? fallbackProfile.cv_headline
        : cvHeadline,
    cv_summary: usesLegacySummary ? fallbackProfile.cv_summary : cvSummary,
    soft_skills: profileTextList(data.soft_skills, fallbackProfile.soft_skills, true),
    languages: languages.length > 0 || Array.isArray(data.languages) ? languages : fallbackProfile.languages,
  };
}

function isMissingLegacyProfileColumn(error: { code?: string; message?: string } | null) {
  const message = error?.message ?? "";
  return (
    (error?.code === "42703" || error?.code === "PGRST204" || /schema cache|does not exist/i.test(message)) &&
    /cv_headline|cv_summary|soft_skills|languages/i.test(message)
  );
}

export function parseEditableProfile(data: unknown): Profile | null {
  if (typeof data !== "object" || data === null) return null;

  const profile = data as Record<string, unknown>;
  const textFields = [
    "display_name",
    "short_name",
    "role",
    "bio_primary",
    "bio_secondary",
    "location",
    "focus",
    "education",
    "status",
    "email",
    "github",
    "linkedin",
    "website",
    "hero_description",
    "cv_headline",
    "cv_summary",
  ] as const;

  if (
    profile.id !== 1 ||
    textFields.some((field) => typeof profile[field] !== "string") ||
    !Array.isArray(profile.hero_roles) ||
    !profile.hero_roles.every((role) => typeof role === "string") ||
    !Array.isArray(profile.soft_skills) ||
    !profile.soft_skills.every((skill) => typeof skill === "string") ||
    !Array.isArray(profile.languages)
  ) {
    return null;
  }

  const languages = normalizeLanguages(profile.languages);
  if (languages.length !== profile.languages.length) return null;

  return {
    id: 1,
    display_name: profile.display_name as string,
    short_name: profile.short_name as string,
    role: profile.role as string,
    bio_primary: profile.bio_primary as string,
    bio_secondary: profile.bio_secondary as string,
    location: profile.location as string,
    focus: profile.focus as string,
    education: profile.education as string,
    status: profile.status as string,
    email: profile.email as string,
    github: profile.github as string,
    linkedin: profile.linkedin as string,
    website: profile.website as string,
    hero_roles: profile.hero_roles as string[],
    hero_description: profile.hero_description as string,
    cv_headline: profile.cv_headline as string,
    cv_summary: profile.cv_summary as string,
    soft_skills: profile.soft_skills as string[],
    languages,
  };
}

const getCachedProfile = unstable_cache(async (): Promise<Profile> => {
  const supabase = createAnonymousSupabaseClient();
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

  const response = await supabase
    .from("portfolio_profile")
    .select(PUBLIC_PROFILE_COLUMNS)
    .eq("id", 1)
    .maybeSingle();
  let data: unknown = response.data;
  let error = response.error as { code?: string; message?: string } | null;

  if (isMissingRelationError(response.error, "portfolio_profile")) {
    const legacyResponse = await supabase
      .from("profile")
      .select(PUBLIC_PROFILE_COLUMNS)
      .eq("id", 1)
      .maybeSingle();
    const legacyProfile = isMissingLegacyProfileColumn(legacyResponse.error)
      ? await supabase.from("profile").select("*").eq("id", 1).maybeSingle()
      : legacyResponse;

    data = legacyProfile.data;
    error = legacyProfile.error as { code?: string; message?: string } | null;
  }

  if (error || !data) {
    console.error("[profile] gagal memuat data publik:", error ?? "baris profile utama tidak ditemukan");
    return fallbackProfile;
  }

  // Public views are added by SQL migration and are not present in Supabase's generated schema.
  // Normalize the untyped query boundary before exposing it to the rest of the application.
  return normalizeProfile(data as unknown as Record<string, unknown>);
}, [PROFILE_CACHE_TAG], { tags: [PROFILE_CACHE_TAG], revalidate: 300 });

export async function getProfile(): Promise<Profile> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return fallbackProfile;
  }

  return getCachedProfile();
}
