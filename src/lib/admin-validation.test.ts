import { describe, expect, it } from "vitest";
import {
  AdminValidationError,
  isUuid,
  readProfileInput,
  readProjectInput,
  readSkillInput,
} from "@/lib/admin-validation";

function formData(fields: Record<string, string>) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  return form;
}

const validProject = {
  title: "Portfolio",
  description: "Situs portfolio pribadi.",
  tech: "Next.js, TypeScript",
  github: "https://github.com/shuriza/portofolio",
  demo: "https://shuriza.tech",
  sort_order: "1",
};

const validProfile = {
  display_name: "M. Firdaus Suryaningrat",
  short_name: "Shuriza",
  role: "Junior Fullstack Web Developer",
  bio_primary: "Membangun aplikasi web.",
  bio_secondary: "Terbuka untuk belajar.",
  location: "Kediri, Jawa Timur",
  focus: "Fullstack Web",
  education: "D3 Manajemen Informatika",
  status: "Open to work",
  email: "firdaus@example.com",
  phone: "0817-7509-3906",
  github: "https://github.com/shuriza",
  linkedin: "https://www.linkedin.com/in/m-firdaus-suryaningrat-73a471338/",
  website: "https://shuriza.tech",
  hero_description: "Portfolio web developer.",
  cv_headline: "Junior Fullstack Web Developer",
  cv_summary: "Ringkasan profesional.",
  hero_roles: "Membangun aplikasi web",
  soft_skills: "Komunikasi\nKolaborasi",
  languages: "Indonesia | Native\nEnglish | Professional working proficiency",
};

describe("admin validation", () => {
  it("accepts a bounded valid project payload", () => {
    expect(readProjectInput(formData(validProject))).toMatchObject({
      title: "Portfolio",
      tech: ["Next.js", "TypeScript"],
      featured: false,
      published: false,
      sort_order: 1,
    });
  });

  it("accepts case-study fields and normalizes their line-based input", () => {
    const project = readProjectInput(
      formData({
        ...validProject,
        slug: "portfolio-lab",
        status: "case-study",
        category: "web",
        role: "Developer utama",
        problem: "Masalah operasional yang perlu diringkas.",
        features: "Import data\nDashboard analitik",
        limitations: "Data asli tidak dipublikasikan.",
        video: "https://example.com/demo",
        screenshots: "/project-evidence/dashboard.png\n/project-evidence/detail.png",
      }),
    );

    expect(project).toMatchObject({
      slug: "portfolio-lab",
      status: "case-study",
      category: "web",
      features: ["Import data", "Dashboard analitik"],
      screenshots: ["/project-evidence/dashboard.png", "/project-evidence/detail.png"],
    });
  });

  it("rejects non-HTTPS project URLs", () => {
    expect(() => readProjectInput(formData({ ...validProject, demo: "javascript:alert(1)" }))).toThrow(
      AdminValidationError,
    );
  });

  it("requires evidence for a video demo status", () => {
    expect(() => readProjectInput(formData({ ...validProject, status: "video" }))).toThrow(
      "Status Video Demo membutuhkan Video URL.",
    );
  });

  it("rejects placeholder-only required text", () => {
    expect(() => readProjectInput(formData({ ...validProject, title: "-" }))).toThrow(
      "Nama project tidak boleh hanya berisi tanda hubung.",
    );
  });

  it("rejects unbounded project technology lists", () => {
    expect(() => readProjectInput(formData({ ...validProject, tech: "x".repeat(61) }))).toThrow(
      "Teknologi maksimal 20 item dan 60 karakter per item.",
    );
  });

  it("requires valid profile URLs and structured languages", () => {
    expect(readProfileInput(formData(validProfile))).toMatchObject({
      languages: [
        { name: "Indonesia", level: "Native" },
        { name: "English", level: "Professional working proficiency" },
      ],
    });
    expect(() => readProfileInput(formData({ ...validProfile, github: "http://github.com/shuriza" }))).toThrow(
      AdminValidationError,
    );
    expect(() => readProfileInput(formData({ ...validProfile, languages: "Indonesia" }))).toThrow(
      "Bahasa harus memakai format Nama | Level.",
    );
  });

  it("rejects unknown skill configuration and invalid UUIDs", () => {
    expect(() =>
      readSkillInput(
        formData({ name: "React", category: "Unknown", icon: "SiReact", color: "#61DAFB", sort_order: "0" }),
      ),
    ).toThrow("Kategori skill tidak valid.");
    expect(isUuid("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
    expect(isUuid("not-a-uuid")).toBe(false);
  });
});
