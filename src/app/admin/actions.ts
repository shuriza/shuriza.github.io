"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { SKILL_CATEGORIES, SKILL_ICON_OPTIONS } from "@/lib/skills";
import { FEATURE_TOGGLES } from "@/lib/settings";

/** Halaman publik yang menampilkan data dari database. */
function revalidatePublicPages() {
  revalidatePath("/");
  revalidatePath("/cv");
}

function readProjectForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const tech = String(formData.get("tech") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20);
  const github = String(formData.get("github") ?? "").trim() || null;
  const demo = String(formData.get("demo") ?? "").trim() || null;
  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";
  const sortOrder = Number.parseInt(String(formData.get("sort_order") ?? "0"), 10);

  if (!title || !description) {
    redirect("/admin/projects/new?error=Title%20dan%20description%20wajib%20diisi");
  }

  for (const url of [github, demo]) {
    if (url && !/^https:\/\//i.test(url)) {
      redirect("/admin/projects/new?error=Link%20harus%20menggunakan%20HTTPS");
    }
  }

  return {
    title,
    description,
    tech,
    github,
    demo,
    featured,
    published,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
  };
}

export async function createProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  const project = readProjectForm(formData);
  const { error } = await supabase.from("projects").insert(project);

  if (error) redirect(`/admin/projects/new?error=${encodeURIComponent(error.message)}`);

  revalidatePublicPages();
  redirect("/admin/projects");
}

export async function updateProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const project = readProjectForm(formData);
  const { error } = await supabase.from("projects").update(project).eq("id", id);

  if (error) {
    redirect(`/admin/projects/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePublicPages();
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) redirect(`/admin/projects?error=${encodeURIComponent(error.message)}`);

  revalidatePublicPages();
  redirect("/admin/projects");
}

export async function signOut() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function readSkillForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const icon = String(formData.get("icon") ?? "TbApi");
  const color = String(formData.get("color") ?? "#22d3ee").trim();
  const sortOrder = Number.parseInt(String(formData.get("sort_order") ?? "0"), 10);

  if (!name || !SKILL_CATEGORIES.includes(category as (typeof SKILL_CATEGORIES)[number])) {
    redirect("/admin/skills/new?error=Nama%20dan%20kategori%20skill%20wajib%20diisi");
  }
  if (!(icon in SKILL_ICON_OPTIONS) || !/^#[0-9a-f]{6}$/i.test(color)) {
    redirect("/admin/skills/new?error=Icon%20atau%20warna%20tidak%20valid");
  }

  return {
    name,
    category,
    icon,
    color,
    published: formData.get("published") === "on",
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
  };
}

export async function createSkill(formData: FormData) {
  const { supabase } = await requireAdmin();
  const skill = readSkillForm(formData);
  const { error } = await supabase.from("skills").insert(skill);

  if (error) redirect(`/admin/skills/new?error=${encodeURIComponent(error.message)}`);

  revalidatePublicPages();
  redirect("/admin/skills");
}

export async function updateSkill(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const skill = readSkillForm(formData);
  const { error } = await supabase.from("skills").update(skill).eq("id", id);

  if (error) redirect(`/admin/skills/${id}/edit?error=${encodeURIComponent(error.message)}`);

  revalidatePublicPages();
  redirect("/admin/skills");
}

export async function deleteSkill(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { error } = await supabase.from("skills").delete().eq("id", id);

  if (error) redirect(`/admin/skills?error=${encodeURIComponent(error.message)}`);

  revalidatePublicPages();
  redirect("/admin/skills");
}

export async function updateProfile(formData: FormData) {
  const { supabase } = await requireAdmin();
  const fields = [
    "display_name", "short_name", "role", "bio_primary", "bio_secondary",
    "location", "focus", "education", "status", "email", "github", "linkedin",
    "website", "hero_description", "cv_headline", "cv_summary",
  ];
  const profile = Object.fromEntries(fields.map((field) => [field, String(formData.get(field) ?? "").trim()]));
  const heroRoles = String(formData.get("hero_roles") ?? "")
    .split("\n")
    .map((role) => role.trim())
    .filter(Boolean)
    .slice(0, 8);
  const softSkills = String(formData.get("soft_skills") ?? "")
    .split("\n")
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 12);
  // Satu baris per bahasa dengan format "Nama | Level".
  const languages = String(formData.get("languages") ?? "")
    .split("\n")
    .map((line) => {
      const [name, level] = line.split("|");
      return { name: (name ?? "").trim(), level: (level ?? "").trim() };
    })
    .filter((language) => language.name.length > 0)
    .slice(0, 8);

  if (fields.some((field) => !profile[field])) {
    redirect("/admin/profile?error=Semua%20field%20wajib%20diisi");
  }
  for (const url of [profile.github, profile.linkedin, profile.website]) {
    if (!/^https:\/\//i.test(url)) redirect("/admin/profile?error=Link%20harus%20menggunakan%20HTTPS");
  }
  if (!heroRoles.length) redirect("/admin/profile?error=Minimal%20satu%20role%20hero%20wajib%20diisi");

  const { error } = await supabase.from("profile").upsert({
    id: 1,
    ...profile,
    hero_roles: heroRoles,
    soft_skills: softSkills,
    languages,
  });
  if (error) redirect(`/admin/profile?error=${encodeURIComponent(error.message)}`);

  revalidatePublicPages();
  redirect("/admin/profile?saved=1");
}

export async function updateSettings(formData: FormData) {
  const { supabase } = await requireAdmin();

  // Checkbox yang tidak dicentang tidak ikut terkirim, jadi absennya berarti false.
  const flags = Object.fromEntries(
    FEATURE_TOGGLES.map((toggle) => [toggle.key, formData.get(toggle.key) === "on"])
  );

  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, ...flags, updated_at: new Date().toISOString() });

  if (error) redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`);

  revalidatePublicPages();
  redirect("/admin/settings?saved=1");
}
