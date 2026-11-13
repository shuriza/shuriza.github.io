import { unstable_cache } from "next/cache";
import { getPublicProfile } from "@/lib/db/queries";


export const PROFILE_CACHE_TAG = "public-profile";


export interface CvLanguage {
  name: string;
  level: string;
}

export interface CvExperience {
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface CvEducation {
  title: string;
  institution: string;
  period: string;
  description: string;
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
  phone: string;
  github: string;
  linkedin: string;
  website: string;
  hero_roles: string[];
  hero_description: string;
  /** Headline khusus halaman CV. Kosong berarti pakai `role`. */
  cv_headline: string;
  /** Paragraf ringkasan di bagian atas CV. */
  cv_summary: string;
  cv_experiences: CvExperience[];
  cv_education: CvEducation[];
  cv_project_keys: string[];
  soft_skills: string[];
  languages: CvLanguage[];
}

export const fallbackProfile: Profile = {
  id: 1,
  display_name: "M. Firdaus Suryaningrat",
  short_name: "Shuriza",
  role: "Junior Web Developer | AI Automation",
  bio_primary:
    "Lulusan D3 Manajemen Informatika dengan fokus pada pengembangan aplikasi web berbasis Laravel, PHP, MySQL, integrasi AI/API, dan automasi alur kerja.",
  bio_secondary:
    "Saya mengembangkan sistem rekap absensi DPMPTSP, Todo AI dengan Gemini, Google Classroom, dan Telegram Bot, serta Shuriza Store dengan otomasi bot WhatsApp dan Telegram. Saya sedang memperdalam AI-assisted development, workflow automation, dan penerjemahan kebutuhan bisnis menjadi instruksi yang dapat diuji.",
  location: "Kediri, Jawa Timur",
  focus: "AI Automation & Laravel",
  education: "D3 Manajemen Informatika · IPK 3,63",
  status: "Terbuka untuk Magang",
  email: "firdausmfirdaus657@gmail.com",
  phone: "0817-7509-3906",
  github: "https://github.com/shuriza",
  linkedin: "https://www.linkedin.com/in/m-firdaus-suryaningrat-73a471338/",
  website: "https://shuriza.tech",
  hero_roles: [
    "Laravel 12 · PHP · MySQL",
    "Token/API Awareness · Workflow Automation",
  ],
  hero_description:
    "Junior web developer dengan pengalaman membangun aplikasi operasional, integrasi AI/API, workflow automation, dan laporan berbasis data.",
  cv_headline: "Junior Web Developer | AI Automation, Laravel",
  cv_summary:
    "Lulusan D3 Manajemen Informatika Politeknik Negeri Malang (IPK 3,63) dengan pengalaman membangun aplikasi web dan automasi berbasis Laravel, PHP, MySQL, serta integrasi AI/API. Dalam tim empat mahasiswa, mengembangkan sebagian besar alur sistem rekap absensi DPMPTSP, termasuk impor dan validasi Excel, dashboard analitik, laporan Excel/PDF, dan demo kepada pengguna. Membangun Todo AI dengan Gemini, Google Classroom, dan Telegram Bot; membangun Shuriza Store sebagai e-commerce produk digital dengan checkout guest, multi-gateway payment, sinkronisasi stok, serta otomasi bot WhatsApp dan Telegram. Sedang memperdalam AI agent, prompt design, pengujian respons, dan dokumentasi SOP.",
  cv_experiences: [
    {
      title: "Mahasiswa Magang - Pengembangan Aplikasi Web",
      company: "DPMPTSP Kota Kediri",
      location: "Kota Kediri, Jawa Timur",
      period: "Juni 2025 - Agustus 2025",
      bullets: [
        "Mengembangkan sebagian besar alur sistem rekap absensi internal dalam tim beranggotakan empat mahasiswa, menggunakan Laravel 12 dan MySQL untuk mengelola data kehadiran pegawai.",
        "Membangun alur impor dan validasi Excel, pengelolaan izin presensi, dashboard analitik per departemen, serta laporan bulanan dan tahunan dalam format Excel dan PDF.",
        "Mendemonstrasikan sistem kepada karyawan dan pengguna pada tahap akhir pengembangan.",
      ],
    },
  ],
  cv_education: [
    {
      title: "D3 Manajemen Informatika",
      institution: "Politeknik Negeri Malang",
      period: "2023 - 2026 · IPK 3,63",
      description: "Fokus pada pengembangan perangkat lunak, basis data, analisis sistem, dan manajemen proyek.",
    },
    {
      title: "Rekayasa Perangkat Lunak (RPL)",
      institution: "SMKN 1 Kertosono",
      period: "2020 - 2023",
      description: "Mempelajari dasar pemrograman dan pengembangan perangkat lunak dengan Java.",
    },
  ],
  cv_project_keys: ["rekap-absensi-dpmptsp", "todo-ai", "shuriza-store"],
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

export function normalizeCvExperiences(value: unknown): CvExperience[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      title: typeof item.title === "string" ? item.title.trim() : "",
      company: typeof item.company === "string" ? item.company.trim() : "",
      location: typeof item.location === "string" ? item.location.trim() : "",
      period: typeof item.period === "string" ? item.period.trim() : "",
      bullets: Array.isArray(item.bullets)
        ? item.bullets.filter((bullet): bullet is string => typeof bullet === "string").map((bullet) => bullet.trim()).filter(Boolean)
        : [],
    }))
    .filter((item) => item.title.length > 0 && item.company.length > 0 && item.period.length > 0 && item.bullets.length > 0);
}

export function normalizeCvEducation(value: unknown): CvEducation[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      title: typeof item.title === "string" ? item.title.trim() : "",
      institution: typeof item.institution === "string" ? item.institution.trim() : "",
      period: typeof item.period === "string" ? item.period.trim() : "",
      description: typeof item.description === "string" ? item.description.trim() : "",
    }))
    .filter((item) => item.title.length > 0 && item.institution.length > 0 && item.period.length > 0);
}

export function formatCvExperiences(experiences: CvExperience[]) {
  return experiences
    .map((experience) => [
      `${experience.title} | ${experience.company} | ${experience.location} | ${experience.period}`,
      ...experience.bullets.map((bullet) => `- ${bullet}`),
    ].join("\n"))
    .join("\n\n");
}

export function formatCvEducation(education: CvEducation[]) {
  return education
    .map((item) => `${item.title} | ${item.institution} | ${item.period}${item.description ? `\n${item.description}` : ""}`)
    .join("\n\n");
}

type ProfileTextField = Exclude<
  keyof Profile,
  "id" | "hero_roles" | "cv_experiences" | "cv_education" | "cv_project_keys" | "soft_skills" | "languages"
>;

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
  const cvExperiences = normalizeCvExperiences(data.cv_experiences);
  const cvEducation = normalizeCvEducation(data.cv_education);

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
    phone: profileText(data, "phone"),
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
    cv_experiences: cvExperiences.length > 0 ? cvExperiences : fallbackProfile.cv_experiences,
    cv_education: cvEducation.length > 0 ? cvEducation : fallbackProfile.cv_education,
    cv_project_keys: profileTextList(data.cv_project_keys, fallbackProfile.cv_project_keys, false),
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
    "phone",
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
    !Array.isArray(profile.cv_experiences) ||
    !Array.isArray(profile.cv_education) ||
    !Array.isArray(profile.cv_project_keys) ||
    !profile.cv_project_keys.every((key) => typeof key === "string") ||
    !Array.isArray(profile.soft_skills) ||
    !profile.soft_skills.every((skill) => typeof skill === "string") ||
    !Array.isArray(profile.languages)
  ) {
    return null;
  }

  const languages = normalizeLanguages(profile.languages);
  const cvExperiences = normalizeCvExperiences(profile.cv_experiences);
  const cvEducation = normalizeCvEducation(profile.cv_education);
  if (
    languages.length !== profile.languages.length ||
    cvExperiences.length !== profile.cv_experiences.length ||
    cvEducation.length !== profile.cv_education.length
  ) return null;

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
    phone: profile.phone as string,
    github: profile.github as string,
    linkedin: profile.linkedin as string,
    website: profile.website as string,
    hero_roles: profile.hero_roles as string[],
    hero_description: profile.hero_description as string,
    cv_headline: profile.cv_headline as string,
    cv_summary: profile.cv_summary as string,
    cv_experiences: cvExperiences,
    cv_education: cvEducation,
    cv_project_keys: profile.cv_project_keys as string[],
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
