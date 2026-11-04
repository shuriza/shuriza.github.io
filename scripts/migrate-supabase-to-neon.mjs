import postgres from "postgres";

const sourceUrl = process.env.SUPABASE_DATABASE_URL;
const targetUrl = process.env.DATABASE_URL;

if (!sourceUrl || !targetUrl) {
  throw new Error("Set SUPABASE_DATABASE_URL dan DATABASE_URL sebelum menjalankan migrasi.");
}

const source = postgres(sourceUrl, { max: 1, prepare: false, ssl: "require" });
const target = postgres(targetUrl, { max: 1, prepare: false, ssl: "require" });

function valueOr(value, fallback) {
  return value === null || value === undefined ? fallback : value;
}

try {
  const [sourceProjects, sourceSkills, sourceProfiles, sourceSettings] = await Promise.all([
    source`select * from public.projects order by sort_order asc, created_at asc`,
    source`select * from public.skills order by category asc, sort_order asc, created_at asc`,
    source`select * from public.profile where id = 1`,
    source`select * from public.site_settings where id = 1`,
  ]);

  await target.begin(async (transaction) => {
    for (const row of sourceProjects) {
      await transaction`
        insert into public.projects
          (id, title, description, tech, github, demo, featured, published, sort_order, created_at, updated_at)
        values
          (${row.id}, ${row.title}, ${row.description}, ${row.tech ?? []}, ${row.github}, ${row.demo},
           ${valueOr(row.featured, false)}, ${valueOr(row.published, true)}, ${valueOr(row.sort_order, 0)},
           ${valueOr(row.created_at, new Date())}, ${valueOr(row.updated_at, row.created_at ?? new Date())})
        on conflict (id) do update set
          title = excluded.title,
          description = excluded.description,
          tech = excluded.tech,
          github = excluded.github,
          demo = excluded.demo,
          featured = excluded.featured,
          published = excluded.published,
          sort_order = excluded.sort_order,
          created_at = excluded.created_at,
          updated_at = excluded.updated_at
      `;
    }

    for (const row of sourceSkills) {
      await transaction`
        insert into public.skills
          (id, name, category, icon, color, published, sort_order, created_at, updated_at)
        values
          (${row.id}, ${row.name}, ${row.category}, ${valueOr(row.icon, "TbApi")},
           ${valueOr(row.color, "#22d3ee")}, ${valueOr(row.published, true)}, ${valueOr(row.sort_order, 0)},
           ${valueOr(row.created_at, new Date())}, ${valueOr(row.updated_at, row.created_at ?? new Date())})
        on conflict (id) do update set
          name = excluded.name,
          category = excluded.category,
          icon = excluded.icon,
          color = excluded.color,
          published = excluded.published,
          sort_order = excluded.sort_order,
          created_at = excluded.created_at,
          updated_at = excluded.updated_at
      `;
    }

    const row = sourceProfiles[0];
    if (row) {
      await transaction`
        insert into public.profile
          (id, display_name, short_name, role, bio_primary, bio_secondary, location, focus, education,
           status, email, github, linkedin, website, hero_roles, hero_description, cv_headline, cv_summary,
           soft_skills, languages, updated_at)
        values
          (1, ${row.display_name}, ${row.short_name}, ${row.role}, ${row.bio_primary}, ${row.bio_secondary},
           ${row.location}, ${row.focus}, ${row.education}, ${row.status}, ${row.email}, ${row.github},
           ${row.linkedin}, ${row.website}, ${valueOr(row.hero_roles, [])}, ${row.hero_description},
           ${valueOr(row.cv_headline, "")}, ${valueOr(row.cv_summary, "")}, ${valueOr(row.soft_skills, [])},
           ${JSON.stringify(valueOr(row.languages, []))}::jsonb, ${valueOr(row.updated_at, new Date())})
        on conflict (id) do update set
          display_name = excluded.display_name,
          short_name = excluded.short_name,
          role = excluded.role,
          bio_primary = excluded.bio_primary,
          bio_secondary = excluded.bio_secondary,
          location = excluded.location,
          focus = excluded.focus,
          education = excluded.education,
          status = excluded.status,
          email = excluded.email,
          github = excluded.github,
          linkedin = excluded.linkedin,
          website = excluded.website,
          hero_roles = excluded.hero_roles,
          hero_description = excluded.hero_description,
          cv_headline = excluded.cv_headline,
          cv_summary = excluded.cv_summary,
          soft_skills = excluded.soft_skills,
          languages = excluded.languages,
          updated_at = excluded.updated_at
      `;
    }

    const settings = sourceSettings[0];
    if (settings) {
      await transaction`
        insert into public.site_settings
          (id, about_enabled, skills_enabled, projects_enabled, contact_enabled, cv_enabled,
           particles_enabled, admin_link_enabled, updated_at)
        values
          (1, ${valueOr(settings.about_enabled, true)}, ${valueOr(settings.skills_enabled, true)},
           ${valueOr(settings.projects_enabled, true)}, ${valueOr(settings.contact_enabled, true)},
           ${valueOr(settings.cv_enabled, true)}, ${valueOr(settings.particles_enabled, true)},
           ${valueOr(settings.admin_link_enabled, true)}, ${valueOr(settings.updated_at, new Date())})
        on conflict (id) do update set
          about_enabled = excluded.about_enabled,
          skills_enabled = excluded.skills_enabled,
          projects_enabled = excluded.projects_enabled,
          contact_enabled = excluded.contact_enabled,
          cv_enabled = excluded.cv_enabled,
          particles_enabled = excluded.particles_enabled,
          admin_link_enabled = excluded.admin_link_enabled,
          updated_at = excluded.updated_at
      `;
    }
  });

  console.log(`Migrasi selesai: ${sourceProjects.length} project, ${sourceSkills.length} skill, ${sourceProfiles.length} profile, ${sourceSettings.length} settings.`);
} finally {
  await Promise.all([source.end(), target.end()]);
}
