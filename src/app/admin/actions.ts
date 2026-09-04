"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  AdminValidationError,
  isUuid,
  readProfileInput,
  readProjectInput,
  readSkillInput,
} from "@/lib/admin-validation";
import { requireAdmin } from "@/lib/admin";
import { PROFILE_CACHE_TAG } from "@/lib/profile";
import { PROJECTS_CACHE_TAG } from "@/lib/projects";
import { SETTINGS_CACHE_TAG } from "@/lib/settings-server";
import { FEATURE_TOGGLES } from "@/lib/settings";
import { SKILLS_CACHE_TAG } from "@/lib/skills-server";

function errorUrl(path: string, message: string) {
  return `${path}?error=${encodeURIComponent(message)}`;
}

function validationMessage(error: unknown) {
  return error instanceof AdminValidationError ? error.message : "Data yang dikirim tidak valid.";
}

function reportWriteError(operation: string, error: unknown) {
  console.error(`[admin] ${operation} gagal:`, error);
}

function revalidatePublicData(tag: string, adminPath: string) {
  revalidateTag(tag, { expire: 0 });
  revalidatePath("/");
  revalidatePath("/cv");
  revalidatePath(adminPath);
}

export async function createProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  let project;
  try {
    project = readProjectInput(formData);
  } catch (error) {
    redirect(errorUrl("/admin/projects/new", validationMessage(error)));
  }

  const { data, error } = await supabase.from("projects").insert(project).select("id");
  if (error || data?.length !== 1) {
    reportWriteError("membuat project", error ?? "Jumlah baris hasil bukan satu");
    redirect(errorUrl("/admin/projects/new", "Project gagal disimpan. Coba lagi."));
  }

  revalidatePublicData(PROJECTS_CACHE_TAG, "/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!isUuid(id)) redirect(errorUrl("/admin/projects", "ID project tidak valid."));

  let project;
  try {
    project = readProjectInput(formData);
  } catch (error) {
    redirect(errorUrl(`/admin/projects/${id}/edit`, validationMessage(error)));
  }

  const { data, error } = await supabase.from("projects").update(project).eq("id", id).select("id");
  if (error || data?.length !== 1) {
    reportWriteError("memperbarui project", error ?? "Project tidak ditemukan");
    redirect(errorUrl(`/admin/projects/${id}/edit`, "Project gagal diperbarui atau sudah tidak ada."));
  }

  revalidatePublicData(PROJECTS_CACHE_TAG, "/admin/projects");
  revalidatePath(`/admin/projects/${id}/edit`);
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!isUuid(id)) redirect(errorUrl("/admin/projects", "ID project tidak valid."));

  const { data, error } = await supabase.from("projects").delete().eq("id", id).select("id");
  if (error || data?.length !== 1) {
    reportWriteError("menghapus project", error ?? "Project tidak ditemukan");
    redirect(errorUrl("/admin/projects", "Project gagal dihapus atau sudah tidak ada."));
  }

  revalidatePublicData(PROJECTS_CACHE_TAG, "/admin/projects");
  revalidatePath(`/admin/projects/${id}/edit`);
  redirect("/admin/projects");
}

export async function signOut() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createSkill(formData: FormData) {
  const { supabase } = await requireAdmin();
  let skill;
  try {
    skill = readSkillInput(formData);
  } catch (error) {
    redirect(errorUrl("/admin/skills/new", validationMessage(error)));
  }

  const { data, error } = await supabase.from("skills").insert(skill).select("id");
  if (error || data?.length !== 1) {
    reportWriteError("membuat skill", error ?? "Jumlah baris hasil bukan satu");
    redirect(errorUrl("/admin/skills/new", "Skill gagal disimpan. Coba lagi."));
  }

  revalidatePublicData(SKILLS_CACHE_TAG, "/admin/skills");
  redirect("/admin/skills");
}

export async function updateSkill(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!isUuid(id)) redirect(errorUrl("/admin/skills", "ID skill tidak valid."));

  let skill;
  try {
    skill = readSkillInput(formData);
  } catch (error) {
    redirect(errorUrl(`/admin/skills/${id}/edit`, validationMessage(error)));
  }

  const { data, error } = await supabase.from("skills").update(skill).eq("id", id).select("id");
  if (error || data?.length !== 1) {
    reportWriteError("memperbarui skill", error ?? "Skill tidak ditemukan");
    redirect(errorUrl(`/admin/skills/${id}/edit`, "Skill gagal diperbarui atau sudah tidak ada."));
  }

  revalidatePublicData(SKILLS_CACHE_TAG, "/admin/skills");
  revalidatePath(`/admin/skills/${id}/edit`);
  redirect("/admin/skills");
}

export async function deleteSkill(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!isUuid(id)) redirect(errorUrl("/admin/skills", "ID skill tidak valid."));

  const { data, error } = await supabase.from("skills").delete().eq("id", id).select("id");
  if (error || data?.length !== 1) {
    reportWriteError("menghapus skill", error ?? "Skill tidak ditemukan");
    redirect(errorUrl("/admin/skills", "Skill gagal dihapus atau sudah tidak ada."));
  }

  revalidatePublicData(SKILLS_CACHE_TAG, "/admin/skills");
  revalidatePath(`/admin/skills/${id}/edit`);
  redirect("/admin/skills");
}

export async function updateProfile(formData: FormData) {
  const { supabase } = await requireAdmin();
  let profile;
  try {
    profile = readProfileInput(formData);
  } catch (error) {
    redirect(errorUrl("/admin/profile", validationMessage(error)));
  }

  const { data, error } = await supabase.from("profile").update(profile).eq("id", 1).select("id");
  if (error || data?.length !== 1 || data[0]?.id !== 1) {
    reportWriteError("memperbarui profile", error ?? "Profile tidak ditemukan");
    redirect(errorUrl("/admin/profile", "Profile gagal disimpan. Coba lagi."));
  }

  revalidatePublicData(PROFILE_CACHE_TAG, "/admin/profile");
  redirect("/admin/profile?saved=1");
}

export async function updateSettings(formData: FormData) {
  const { supabase } = await requireAdmin();
  const flags = Object.fromEntries(
    FEATURE_TOGGLES.map((toggle) => [toggle.key, formData.get(toggle.key) === "on"]),
  );

  const { data, error } = await supabase
    .from("site_settings")
    .update({ ...flags, updated_at: new Date().toISOString() })
    .eq("id", 1)
    .select("id");
  if (error || data?.length !== 1 || data[0]?.id !== 1) {
    reportWriteError("memperbarui pengaturan", error ?? "Pengaturan tidak ditemukan");
    redirect(errorUrl("/admin/settings", "Pengaturan gagal disimpan. Coba lagi."));
  }

  revalidatePublicData(SETTINGS_CACHE_TAG, "/admin/settings");
  redirect("/admin/settings?saved=1");
}
