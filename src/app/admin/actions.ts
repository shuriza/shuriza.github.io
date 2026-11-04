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
import {
  createProject as insertProject,
  createSkill as insertSkill,
  deleteProject as deleteProjectRow,
  deleteSkill as deleteSkillRow,
  updateProfile as updateProfileRow,
  updateProject as updateProjectRow,
  updateSettings as updateSettingsRow,
  updateSkill as updateSkillRow,
  type ProfileWriteInput,
  type SiteSettingsWriteInput,
} from "@/lib/db/queries";
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
  await requireAdmin();
  let project;
  try {
    project = readProjectInput(formData);
  } catch (error) {
    redirect(errorUrl("/admin/projects/new", validationMessage(error)));
  }

  try {
    const id = await insertProject(project);
    if (!id) throw new Error("Jumlah baris hasil bukan satu");
  } catch (error) {
    reportWriteError("membuat project", error);
    redirect(errorUrl("/admin/projects/new", "Project gagal disimpan. Coba lagi."));
  }

  revalidatePublicData(PROJECTS_CACHE_TAG, "/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!isUuid(id)) redirect(errorUrl("/admin/projects", "ID project tidak valid."));

  let project;
  try {
    project = readProjectInput(formData);
  } catch (error) {
    redirect(errorUrl(`/admin/projects/${id}/edit`, validationMessage(error)));
  }

  try {
    const updatedId = await updateProjectRow(id, project);
    if (!updatedId) throw new Error("Project tidak ditemukan");
  } catch (error) {
    reportWriteError("memperbarui project", error);
    redirect(errorUrl(`/admin/projects/${id}/edit`, "Project gagal diperbarui atau sudah tidak ada."));
  }

  revalidatePublicData(PROJECTS_CACHE_TAG, "/admin/projects");
  revalidatePath(`/admin/projects/${id}/edit`);
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!isUuid(id)) redirect(errorUrl("/admin/projects", "ID project tidak valid."));

  try {
    const deletedId = await deleteProjectRow(id);
    if (!deletedId) throw new Error("Project tidak ditemukan");
  } catch (error) {
    reportWriteError("menghapus project", error);
    redirect(errorUrl("/admin/projects", "Project gagal dihapus atau sudah tidak ada."));
  }

  revalidatePublicData(PROJECTS_CACHE_TAG, "/admin/projects");
  revalidatePath(`/admin/projects/${id}/edit`);
  redirect("/admin/projects");
}

export async function createSkill(formData: FormData) {
  await requireAdmin();
  let skill;
  try {
    skill = readSkillInput(formData);
  } catch (error) {
    redirect(errorUrl("/admin/skills/new", validationMessage(error)));
  }

  try {
    const id = await insertSkill(skill);
    if (!id) throw new Error("Jumlah baris hasil bukan satu");
  } catch (error) {
    reportWriteError("membuat skill", error);
    redirect(errorUrl("/admin/skills/new", "Skill gagal disimpan. Coba lagi."));
  }

  revalidatePublicData(SKILLS_CACHE_TAG, "/admin/skills");
  redirect("/admin/skills");
}

export async function updateSkill(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!isUuid(id)) redirect(errorUrl("/admin/skills", "ID skill tidak valid."));

  let skill;
  try {
    skill = readSkillInput(formData);
  } catch (error) {
    redirect(errorUrl(`/admin/skills/${id}/edit`, validationMessage(error)));
  }

  try {
    const updatedId = await updateSkillRow(id, skill);
    if (!updatedId) throw new Error("Skill tidak ditemukan");
  } catch (error) {
    reportWriteError("memperbarui skill", error);
    redirect(errorUrl(`/admin/skills/${id}/edit`, "Skill gagal diperbarui atau sudah tidak ada."));
  }

  revalidatePublicData(SKILLS_CACHE_TAG, "/admin/skills");
  revalidatePath(`/admin/skills/${id}/edit`);
  redirect("/admin/skills");
}

export async function deleteSkill(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!isUuid(id)) redirect(errorUrl("/admin/skills", "ID skill tidak valid."));

  try {
    const deletedId = await deleteSkillRow(id);
    if (!deletedId) throw new Error("Skill tidak ditemukan");
  } catch (error) {
    reportWriteError("menghapus skill", error);
    redirect(errorUrl("/admin/skills", "Skill gagal dihapus atau sudah tidak ada."));
  }

  revalidatePublicData(SKILLS_CACHE_TAG, "/admin/skills");
  revalidatePath(`/admin/skills/${id}/edit`);
  redirect("/admin/skills");
}

export async function updateProfile(formData: FormData) {
  await requireAdmin();
  let profile: ProfileWriteInput;
  try {
    profile = readProfileInput(formData) as ProfileWriteInput;
  } catch (error) {
    redirect(errorUrl("/admin/profile", validationMessage(error)));
  }

  try {
    const updatedId = await updateProfileRow(profile);
    if (updatedId !== 1) throw new Error("Profile tidak ditemukan");
  } catch (error) {
    reportWriteError("memperbarui profile", error);
    redirect(errorUrl("/admin/profile", "Profile gagal disimpan. Coba lagi."));
  }

  revalidatePublicData(PROFILE_CACHE_TAG, "/admin/profile");
  redirect("/admin/profile?saved=1");
}

export async function updateSettings(formData: FormData) {
  await requireAdmin();
  const flags = Object.fromEntries(
    FEATURE_TOGGLES.map((toggle) => [toggle.key, formData.get(toggle.key) === "on"]),
  ) as SiteSettingsWriteInput;

  try {
    const updatedId = await updateSettingsRow(flags);
    if (updatedId !== 1) throw new Error("Pengaturan tidak ditemukan");
  } catch (error) {
    reportWriteError("memperbarui pengaturan", error);
    redirect(errorUrl("/admin/settings", "Pengaturan gagal disimpan. Coba lagi."));
  }

  revalidatePublicData(SETTINGS_CACHE_TAG, "/admin/settings");
  redirect("/admin/settings?saved=1");
}
