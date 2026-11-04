import { unstable_cache } from "next/cache";
import { getPublicProfile } from "@/lib/db/queries";


export const PROFILE_CACHE_TAG = "public-profile";


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
  role: "Junior Laravel Developer",
  bio_primary:
    "Lulusan D3 Manajemen Informatika dengan fokus pada pengembangan aplikasi web berbasis Laravel, PHP, MySQL, dan integrasi API.",
  bio_secondary:
    "Saya mengembangkan sistem rekap absensi untuk DPMPTSP Kota Kediri serta aplikasi manajemen tugas yang terintegrasi Google Classroom, Gemini AI, dan Telegram Bot. Saya juga tertarik dan sedang mendalami penerapan AI dalam pengembangan aplikasi web.",
  location: "Kediri, Jawa Timur",
  focus: "Laravel & API Integration",
  education: "D3 Manajemen Informatika · IPK 3,63",
  status: "Terbuka untuk Magang",
  email: "firdausmfirdaus657@gmail.com",
  github: "https://github.com/shuriza",
  linkedin: "https://www.linkedin.com/in/m-firdaus-suryaningrat-73a471338/",
  website: "https://shuriza.tech",
  hero_roles: [
    "Laravel 12 · PHP · MySQL",
    "REST API · OAuth · AI Integration",
    "Blade · Alpine.js · Tailwind CSS",
  ],
  hero_description:
    "Junior Laravel Developer dengan pengalaman membangun aplikasi operasional, integrasi API, autentikasi, dan laporan berbasis data.",
  cv_headline: "Junior Web Developer | Laravel, PHP, MySQL",
  cv_summary:
    "Lulusan D3 Manajemen Informatika Politeknik Negeri Malang (IPK 3,63) dengan pengalaman magang dan proyek mandiri dalam membangun aplikasi web menggunakan Laravel, PHP, dan MySQL. Dalam tim beranggotakan empat mahasiswa, mengembangkan sebagian besar alur sistem rekap absensi DPMPTSP Kota Kediri, termasuk impor dan validasi Excel, pengelolaan izin, dashboard analitik, serta laporan Excel/PDF, lalu mendemonstrasikannya kepada pengguna. Membangun pula aplikasi manajemen tugas dengan integrasi Google Classroom, Gemini AI, dan Telegram Bot. Memahami perancangan database, autentikasi, otorisasi, REST API, dan integrasi layanan pihak ketiga.",
  soft_skills: ["Problem Solving", "Kolaborasi Tim", "Komunikasi", "Manajemen Waktu"],
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
    // Construct the public shape explicitly so private database columns never
    // cross the server-to-render boundary.
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
  try {
    const data = await getPublicProfile();
    if (!data) {
      console.error("[profile] baris profile utama tidak ditemukan");
      return fallbackProfile;
    }
    return normalizeProfile(data as unknown as Record<string, unknown>);
  } catch (error) {
    console.error("[profile] gagal memuat data publik:", error);
    return fallbackProfile;
  }
}, [PROFILE_CACHE_TAG], { tags: [PROFILE_CACHE_TAG], revalidate: 300 });

export async function getProfile(): Promise<Profile> {
  if (!process.env.DATABASE_URL) {
    return fallbackProfile;
  }

  return getCachedProfile();
}
