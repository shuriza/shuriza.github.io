import "server-only";

import { asc, desc, eq } from "drizzle-orm";
import { getDatabase, requireDatabase } from "./client";
import {
  profile,
  projects,
  site_settings,
  skills,
  type ProfileInsert,
  type ProjectInsert,
  type SkillInsert,
} from "./schema";

export type QueryError = Error;

function toQueryError(error: unknown) {
  return error instanceof Error ? error : new Error("Database query gagal.", { cause: error });
}

async function safeQuery<T>(fallback: T, query: () => Promise<T>) {
  try {
    return { data: await query(), error: null as QueryError | null };
  } catch (error) {
    return { data: fallback, error: toQueryError(error) };
  }
}

function publicProjectSelection() {
  return {
    id: projects.id,
    title: projects.title,
    description: projects.description,
    tech: projects.tech,
    github: projects.github,
    demo: projects.demo,
    featured: projects.featured,
    published: projects.published,
    sort_order: projects.sort_order,
  };
}

function publicSkillSelection() {
  return {
    id: skills.id,
    name: skills.name,
    category: skills.category,
    icon: skills.icon,
    color: skills.color,
    published: skills.published,
    sort_order: skills.sort_order,
  };
}

function publicProfileSelection() {
  return {
    id: profile.id,
    display_name: profile.display_name,
    short_name: profile.short_name,
    role: profile.role,
    bio_primary: profile.bio_primary,
    bio_secondary: profile.bio_secondary,
    location: profile.location,
    focus: profile.focus,
    education: profile.education,
    status: profile.status,
    email: profile.email,
    github: profile.github,
    linkedin: profile.linkedin,
    website: profile.website,
    hero_roles: profile.hero_roles,
    hero_description: profile.hero_description,
    cv_headline: profile.cv_headline,
    cv_summary: profile.cv_summary,
    soft_skills: profile.soft_skills,
    languages: profile.languages,
  };
}

export async function getPublicProjects() {
  const database = requireDatabase();
  return database
    .select(publicProjectSelection())
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.sort_order), asc(projects.id));
}

export async function getPublicSkills() {
  const database = requireDatabase();
  return database
    .select(publicSkillSelection())
    .from(skills)
    .where(eq(skills.published, true))
    .orderBy(asc(skills.category), asc(skills.sort_order), asc(skills.id));
}

export async function getPublicProfile() {
  const database = requireDatabase();
  const rows = await database
    .select(publicProfileSelection())
    .from(profile)
    .where(eq(profile.id, 1))
    .limit(1);
  return rows[0] ?? null;
}

export async function getPublicSettings() {
  const database = requireDatabase();
  const rows = await database
    .select({
      id: site_settings.id,
      about_enabled: site_settings.about_enabled,
      skills_enabled: site_settings.skills_enabled,
      projects_enabled: site_settings.projects_enabled,
      contact_enabled: site_settings.contact_enabled,
      cv_enabled: site_settings.cv_enabled,
      particles_enabled: site_settings.particles_enabled,
      admin_link_enabled: site_settings.admin_link_enabled,
    })
    .from(site_settings)
    .where(eq(site_settings.id, 1))
    .limit(1);
  return rows[0] ?? null;
}

export async function getAdminProjects() {
  const database = getDatabase();
  return safeQuery([], async () => {
    if (!database) throw new Error("DATABASE_URL belum dikonfigurasi.");
    return database
      .select({
        ...publicProjectSelection(),
        created_at: projects.created_at,
      })
      .from(projects)
      .orderBy(asc(projects.sort_order), desc(projects.created_at));
  });
}

export async function getAdminProject(id: string) {
  const database = getDatabase();
  return safeQuery(null, async () => {
    if (!database) throw new Error("DATABASE_URL belum dikonfigurasi.");
    const rows = await database.select().from(projects).where(eq(projects.id, id)).limit(1);
    return rows[0] ?? null;
  });
}

export async function getAdminSkills() {
  const database = getDatabase();
  return safeQuery([], async () => {
    if (!database) throw new Error("DATABASE_URL belum dikonfigurasi.");
    return database
      .select(publicSkillSelection())
      .from(skills)
      .orderBy(asc(skills.category), asc(skills.sort_order), asc(skills.id));
  });
}

export async function getAdminSkill(id: string) {
  const database = getDatabase();
  return safeQuery(null, async () => {
    if (!database) throw new Error("DATABASE_URL belum dikonfigurasi.");
    const rows = await database.select().from(skills).where(eq(skills.id, id)).limit(1);
    return rows[0] ?? null;
  });
}

export async function getAdminProfile() {
  const database = getDatabase();
  return safeQuery(null, async () => {
    if (!database) throw new Error("DATABASE_URL belum dikonfigurasi.");
    const rows = await database.select().from(profile).where(eq(profile.id, 1)).limit(1);
    return rows[0] ?? null;
  });
}

export async function getAdminSettings() {
  const database = getDatabase();
  return safeQuery(null, async () => {
    if (!database) throw new Error("DATABASE_URL belum dikonfigurasi.");
    const rows = await database.select().from(site_settings).where(eq(site_settings.id, 1)).limit(1);
    return rows[0] ?? null;
  });
}

export type ProjectWriteInput = Pick<
  ProjectInsert,
  "title" | "description" | "tech" | "github" | "demo" | "featured" | "published" | "sort_order"
>;

export type SkillWriteInput = Pick<
  SkillInsert,
  "name" | "category" | "icon" | "color" | "published" | "sort_order"
>;

export type ProfileWriteInput = Pick<
  ProfileInsert,
  | "display_name"
  | "short_name"
  | "role"
  | "bio_primary"
  | "bio_secondary"
  | "location"
  | "focus"
  | "education"
  | "status"
  | "email"
  | "github"
  | "linkedin"
  | "website"
  | "hero_roles"
  | "hero_description"
  | "cv_headline"
  | "cv_summary"
  | "soft_skills"
  | "languages"
>;

export async function createProject(input: ProjectWriteInput) {
  const rows = await requireDatabase().insert(projects).values(input).returning({ id: projects.id });
  return rows[0]?.id ?? null;
}

export async function updateProject(id: string, input: ProjectWriteInput) {
  const rows = await requireDatabase()
    .update(projects)
    .set({ ...input, updated_at: new Date() })
    .where(eq(projects.id, id))
    .returning({ id: projects.id });
  return rows[0]?.id ?? null;
}

export async function deleteProject(id: string) {
  const rows = await requireDatabase()
    .delete(projects)
    .where(eq(projects.id, id))
    .returning({ id: projects.id });
  return rows[0]?.id ?? null;
}

export async function createSkill(input: SkillWriteInput) {
  const rows = await requireDatabase().insert(skills).values(input).returning({ id: skills.id });
  return rows[0]?.id ?? null;
}

export async function updateSkill(id: string, input: SkillWriteInput) {
  const rows = await requireDatabase()
    .update(skills)
    .set({ ...input, updated_at: new Date() })
    .where(eq(skills.id, id))
    .returning({ id: skills.id });
  return rows[0]?.id ?? null;
}

export async function deleteSkill(id: string) {
  const rows = await requireDatabase()
    .delete(skills)
    .where(eq(skills.id, id))
    .returning({ id: skills.id });
  return rows[0]?.id ?? null;
}

export async function updateProfile(input: ProfileWriteInput) {
  const rows = await requireDatabase()
    .update(profile)
    .set({ ...input, updated_at: new Date() })
    .where(eq(profile.id, 1))
    .returning({ id: profile.id });
  return rows[0]?.id ?? null;
}

export type SiteSettingsWriteInput = Pick<
  typeof site_settings.$inferInsert,
  | "about_enabled"
  | "skills_enabled"
  | "projects_enabled"
  | "contact_enabled"
  | "cv_enabled"
  | "particles_enabled"
  | "admin_link_enabled"
>;

export async function updateSettings(input: SiteSettingsWriteInput) {
  const rows = await requireDatabase()
    .update(site_settings)
    .set({ ...input, updated_at: new Date() })
    .where(eq(site_settings.id, 1))
    .returning({ id: site_settings.id });
  return rows[0]?.id ?? null;
}
