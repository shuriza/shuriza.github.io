import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export type StoredLanguage = { name: string; level: string };

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tech: text("tech").array().notNull().default([]),
  github: text("github"),
  demo: text("demo"),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  sort_order: integer("sort_order").notNull().default(0),
  created_at: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
});

export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull().default("TbApi"),
  color: text("color").notNull().default("#22d3ee"),
  published: boolean("published").notNull().default(true),
  sort_order: integer("sort_order").notNull().default(0),
  created_at: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
});

export const profile = pgTable("profile", {
  id: integer("id").primaryKey().default(1),
  display_name: text("display_name").notNull(),
  short_name: text("short_name").notNull(),
  role: text("role").notNull(),
  bio_primary: text("bio_primary").notNull(),
  bio_secondary: text("bio_secondary").notNull(),
  location: text("location").notNull(),
  focus: text("focus").notNull(),
  education: text("education").notNull(),
  status: text("status").notNull(),
  email: text("email").notNull(),
  github: text("github").notNull(),
  linkedin: text("linkedin").notNull(),
  website: text("website").notNull(),
  hero_roles: text("hero_roles").array().notNull().default([]),
  hero_description: text("hero_description").notNull(),
  cv_headline: text("cv_headline").notNull().default(""),
  cv_summary: text("cv_summary").notNull().default(""),
  soft_skills: text("soft_skills").array().notNull().default([]),
  languages: jsonb("languages").$type<StoredLanguage[]>().notNull().default([]),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
});

export const site_settings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  about_enabled: boolean("about_enabled").notNull().default(true),
  skills_enabled: boolean("skills_enabled").notNull().default(true),
  projects_enabled: boolean("projects_enabled").notNull().default(true),
  contact_enabled: boolean("contact_enabled").notNull().default(true),
  cv_enabled: boolean("cv_enabled").notNull().default(true),
  particles_enabled: boolean("particles_enabled").notNull().default(true),
  admin_link_enabled: boolean("admin_link_enabled").notNull().default(true),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
});

export const databaseSchema = { projects, skills, profile, site_settings };

export type ProjectRow = typeof projects.$inferSelect;
export type ProjectInsert = typeof projects.$inferInsert;
export type SkillRow = typeof skills.$inferSelect;
export type SkillInsert = typeof skills.$inferInsert;
export type ProfileRow = typeof profile.$inferSelect;
export type ProfileInsert = typeof profile.$inferInsert;
export type SiteSettingsRow = typeof site_settings.$inferSelect;
