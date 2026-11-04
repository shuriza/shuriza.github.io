begin;

create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  description text not null check (char_length(description) between 1 and 1000),
  tech text[] not null default '{}',
  github text,
  demo text,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  category text not null check (category in ('Frontend', 'Backend', 'Tools')),
  icon text not null default 'TbApi',
  color text not null default '#22d3ee' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile (
  id integer primary key default 1 check (id = 1),
  display_name text not null,
  short_name text not null,
  role text not null,
  bio_primary text not null,
  bio_secondary text not null,
  location text not null,
  focus text not null,
  education text not null,
  status text not null,
  email text not null,
  github text not null,
  linkedin text not null,
  website text not null,
  hero_roles text[] not null default '{}',
  hero_description text not null,
  cv_headline text not null default '',
  cv_summary text not null default '',
  soft_skills text[] not null default '{}',
  languages jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  about_enabled boolean not null default true,
  skills_enabled boolean not null default true,
  projects_enabled boolean not null default true,
  contact_enabled boolean not null default true,
  cv_enabled boolean not null default true,
  particles_enabled boolean not null default true,
  admin_link_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists skills_set_updated_at on public.skills;
create trigger skills_set_updated_at
before update on public.skills
for each row execute function public.set_updated_at();

drop trigger if exists profile_set_updated_at on public.profile;
create trigger profile_set_updated_at
before update on public.profile
for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

commit;
