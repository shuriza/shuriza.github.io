import { SKILL_CATEGORIES, SKILL_ICON_OPTIONS } from "@/lib/skills";
import { isProjectCategory, isProjectStatus, type ProjectCategory, type ProjectStatus } from "@/lib/project-model";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_SORT_ORDER = -2_147_483_648;
const MAX_SORT_ORDER = 2_147_483_647;

export class AdminValidationError extends Error {}

function readBoundedText(
  formData: FormData,
  field: string,
  label: string,
  maxLength: number,
) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) throw new AdminValidationError(`${label} wajib diisi.`);
  if (value === "-") throw new AdminValidationError(`${label} tidak boleh hanya berisi tanda hubung.`);
  if (value.length > maxLength) {
    throw new AdminValidationError(`${label} maksimal ${maxLength} karakter.`);
  }
  return value;
}

function readOptionalHttpsUrl(formData: FormData, field: string, label: string) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) return null;
  if (value.length > 2048) throw new AdminValidationError(`${label} terlalu panjang.`);

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !url.hostname) throw new Error();
  } catch {
    throw new AdminValidationError(`${label} harus berupa URL HTTPS yang valid.`);
  }

  return value;
}

function readOptionalText(formData: FormData, field: string, label: string, maxLength: number) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) return null;
  if (value.length > maxLength) throw new AdminValidationError(`${label} terlalu panjang.`);
  return value;
}

function readOptionalSlug(formData: FormData) {
  const value = String(formData.get("slug") ?? "").trim().toLowerCase();
  if (!value) return null;
  if (value.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new AdminValidationError("Slug harus berupa huruf kecil, angka, dan tanda hubung.");
  }
  return value;
}

function readScreenshotPaths(formData: FormData) {
  const raw = String(formData.get("screenshots") ?? "").trim();
  if (!raw) return [];
  if (raw.length > 6000) throw new AdminValidationError("Screenshot terlalu panjang.");

  const values = raw.split("\n").map((value) => value.trim()).filter(Boolean);
  if (values.length > 12 || values.some((value) => value.length > 500 || !/^\/[A-Za-z0-9][A-Za-z0-9_./-]*$/.test(value))) {
    throw new AdminValidationError("Screenshot harus berupa path lokal /public, maksimal 12 item.");
  }
  return values;
}

function readSortOrder(formData: FormData) {
  const raw = String(formData.get("sort_order") ?? "0").trim();
  if (!/^-?\d+$/.test(raw)) {
    throw new AdminValidationError("Urutan tampil harus berupa bilangan bulat.");
  }

  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < MIN_SORT_ORDER || value > MAX_SORT_ORDER) {
    throw new AdminValidationError("Urutan tampil berada di luar batas yang valid.");
  }
  return value;
}

function readLines(
  formData: FormData,
  field: string,
  label: string,
  maxItems: number,
  maxItemLength: number,
) {
  const raw = String(formData.get(field) ?? "");
  if (raw.length > maxItems * (maxItemLength + 2)) {
    throw new AdminValidationError(`${label} terlalu panjang.`);
  }

  const values = raw.split("\n").map((value) => value.trim()).filter(Boolean);
  if (values.length > maxItems || values.some((value) => value.length > maxItemLength)) {
    throw new AdminValidationError(
      `${label} maksimal ${maxItems} item dan ${maxItemLength} karakter per item.`,
    );
  }
  return values;
}

export function isUuid(value: string) {
  return UUID_PATTERN.test(value);
}

export function readProjectInput(formData: FormData) {
  const rawTech = String(formData.get("tech") ?? "");
  if (rawTech.length > 1000) throw new AdminValidationError("Daftar teknologi terlalu panjang.");

  const tech = rawTech.split(",").map((item) => item.trim()).filter(Boolean);
  if (!tech.length) throw new AdminValidationError("Minimal satu teknologi wajib diisi.");
  if (tech.length > 20 || tech.some((item) => item.length > 60)) {
    throw new AdminValidationError("Teknologi maksimal 20 item dan 60 karakter per item.");
  }

  const status = String(formData.get("status") ?? "case-study");
  const category = String(formData.get("category") ?? "case-study");
  if (!isProjectStatus(status)) throw new AdminValidationError("Status project tidak valid.");
  if (!isProjectCategory(category)) throw new AdminValidationError("Kategori project tidak valid.");
  const video = readOptionalHttpsUrl(formData, "video", "Video URL");
  if (status === "video" && !video) throw new AdminValidationError("Status Video Demo membutuhkan Video URL.");

  return {
    title: readBoundedText(formData, "title", "Nama project", 120),
    description: readBoundedText(formData, "description", "Description", 1000),
    tech,
    github: readOptionalHttpsUrl(formData, "github", "GitHub URL"),
    demo: readOptionalHttpsUrl(formData, "demo", "Demo URL"),
    slug: readOptionalSlug(formData),
    status: status as ProjectStatus,
    category: category as ProjectCategory,
    role: readOptionalText(formData, "role", "Peran", 200),
    problem: readOptionalText(formData, "problem", "Masalah", 1500),
    features: readLines(formData, "features", "Fitur", 12, 220),
    limitations: readOptionalText(formData, "limitations", "Batasan", 1200),
    video,
    screenshots: readScreenshotPaths(formData),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    sort_order: readSortOrder(formData),
  };
}

export function readSkillInput(formData: FormData) {
  const category = String(formData.get("category") ?? "");
  const icon = String(formData.get("icon") ?? "");
  const color = String(formData.get("color") ?? "").trim();

  if (!SKILL_CATEGORIES.includes(category as (typeof SKILL_CATEGORIES)[number])) {
    throw new AdminValidationError("Kategori skill tidak valid.");
  }
  if (!(icon in SKILL_ICON_OPTIONS)) throw new AdminValidationError("Icon skill tidak valid.");
  if (!/^#[0-9a-f]{6}$/i.test(color)) throw new AdminValidationError("Warna skill tidak valid.");

  return {
    name: readBoundedText(formData, "name", "Nama skill", 60),
    category,
    icon,
    color,
    published: formData.get("published") === "on",
    sort_order: readSortOrder(formData),
  };
}

export function readProfileInput(formData: FormData) {
  const limits: Record<string, number> = {
    display_name: 120,
    short_name: 60,
    role: 120,
    bio_primary: 2000,
    bio_secondary: 2000,
    location: 160,
    focus: 120,
    education: 200,
    status: 120,
    email: 254,
    phone: 40,
    github: 2048,
    linkedin: 2048,
    website: 2048,
    hero_description: 1000,
    cv_headline: 160,
    cv_summary: 3000,
  };
  const profile = Object.fromEntries(
    Object.entries(limits).map(([field, maxLength]) => [
      field,
      readBoundedText(formData, field, field.replaceAll("_", " "), maxLength),
    ]),
  );

  if (!EMAIL_PATTERN.test(profile.email)) {
    throw new AdminValidationError("Email tidak valid.");
  }
  for (const field of ["github", "linkedin", "website"] as const) {
    const url = readOptionalHttpsUrl(formData, field, `${field} URL`);
    if (!url) throw new AdminValidationError(`${field} URL wajib diisi.`);
    profile[field] = url;
  }

  const heroRoles = readLines(formData, "hero_roles", "Hero roles", 8, 120);
  if (!heroRoles.length) throw new AdminValidationError("Minimal satu role hero wajib diisi.");
  const softSkills = readLines(formData, "soft_skills", "Soft skills", 12, 100);
  const languageLines = readLines(formData, "languages", "Bahasa", 8, 160);
  const languages = languageLines.map((line) => {
    const separator = line.indexOf("|");
    const name = (separator === -1 ? line : line.slice(0, separator)).trim();
    const level = (separator === -1 ? "" : line.slice(separator + 1)).trim();
    if (!name || !level || name.length > 80 || level.length > 80) {
      throw new AdminValidationError("Bahasa harus memakai format Nama | Level.");
    }
    return { name, level };
  });

  const experienceRaw = String(formData.get("cv_experiences") ?? "").trim();
  if (experienceRaw.length > 12_000) throw new AdminValidationError("Pengalaman CV terlalu panjang.");
  const cvExperiences = experienceRaw
    ? experienceRaw.split(/\r?\n\s*\r?\n/).map((block) => {
        const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
        const header = lines.shift()?.split("|").map((part) => part.trim()) ?? [];
        const [title, company, location, period] = header;
        const bullets = lines.map((line) => line.replace(/^[-*]\s*/, "").trim()).filter(Boolean);
        if (!title || !company || !period || !bullets.length || header.length !== 4) {
          throw new AdminValidationError("Pengalaman CV harus memakai format header: Jabatan | Perusahaan | Lokasi | Periode, lalu bullet per baris.");
        }
        if ([title, company, location, period].some((value) => value.length > 180) || bullets.some((bullet) => bullet.length > 500)) {
          throw new AdminValidationError("Data pengalaman CV terlalu panjang.");
        }
        return { title, company, location, period, bullets };
      })
    : [];

  const educationRaw = String(formData.get("cv_education") ?? "").trim();
  if (educationRaw.length > 6000) throw new AdminValidationError("Pendidikan CV terlalu panjang.");
  const cvEducation = educationRaw
    ? educationRaw.split(/\r?\n\s*\r?\n/).map((block) => {
        const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
        const header = lines.shift()?.split("|").map((part) => part.trim()) ?? [];
        const [title, institution, period] = header;
        const description = lines.join(" ");
        if (!title || !institution || !period || header.length !== 3) {
          throw new AdminValidationError("Pendidikan CV harus memakai format: Pendidikan | Institusi | Periode, lalu deskripsi opsional.");
        }
        if ([title, institution, period, description].some((value) => value.length > 240)) {
          throw new AdminValidationError("Data pendidikan CV terlalu panjang.");
        }
        return { title, institution, period, description };
      })
    : [];

  const cvProjectKeys = readLines(formData, "cv_project_keys", "Project CV", 12, 120);
  if (cvProjectKeys.some((key) => !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(key))) {
    throw new AdminValidationError("Project CV harus memakai catalog key atau slug yang valid.");
  }

  return {
    ...profile,
    hero_roles: heroRoles,
    soft_skills: softSkills,
    languages,
    cv_experiences: cvExperiences,
    cv_education: cvEducation,
    cv_project_keys: [...new Set(cvProjectKeys)],
  };
}
