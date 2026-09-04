create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.projects (
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

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;

create policy "Admins can read their admin record"
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid());

create policy "Anyone can read published projects"
  on public.projects for select
  to anon, authenticated
  using (published = true or exists (
    select 1 from public.admin_users where user_id = auth.uid()
  ));

create policy "Admins can insert projects"
  on public.projects for insert
  to authenticated
  with check (exists (
    select 1 from public.admin_users where user_id = auth.uid()
  ));

create policy "Admins can update projects"
  on public.projects for update
  to authenticated
  using (exists (
    select 1 from public.admin_users where user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.admin_users where user_id = auth.uid()
  ));

create policy "Admins can delete projects"
  on public.projects for delete
  to authenticated
  using (exists (
    select 1 from public.admin_users where user_id = auth.uid()
  ));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

insert into public.projects (title, description, tech, github, demo, featured, sort_order)
values (
  'Shuriza Store',
  'E-commerce platform with product catalog, shopping cart, and order management system.',
  array['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
  'https://github.com/shuriza/shuriza-store',
  'https://shurizastore.my.id/',
  true,
  0
);

-- Setelah membuat user melalui Supabase Auth, jalankan:
-- insert into public.admin_users (user_id) values ('UUID_USER_ADMIN');

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  category text not null check (category in ('Frontend', 'Backend', 'Tools')),
  icon text not null default 'TbApi',
  color text not null default '#22d3ee',
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
  updated_at timestamptz not null default now()
);

alter table public.skills enable row level security;
alter table public.profile enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'skills' and policyname = 'Anyone can read published skills') then
    create policy "Anyone can read published skills" on public.skills for select to anon, authenticated
      using (published = true or exists (select 1 from public.admin_users where user_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'skills' and policyname = 'Admins can insert skills') then
    create policy "Admins can insert skills" on public.skills for insert to authenticated
      with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'skills' and policyname = 'Admins can update skills') then
    create policy "Admins can update skills" on public.skills for update to authenticated
      using (exists (select 1 from public.admin_users where user_id = auth.uid()))
      with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'skills' and policyname = 'Admins can delete skills') then
    create policy "Admins can delete skills" on public.skills for delete to authenticated
      using (exists (select 1 from public.admin_users where user_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profile' and policyname = 'Anyone can read profile') then
    create policy "Anyone can read profile" on public.profile for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profile' and policyname = 'Admins can insert profile') then
    create policy "Admins can insert profile" on public.profile for insert to authenticated
      with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profile' and policyname = 'Admins can update profile') then
    create policy "Admins can update profile" on public.profile for update to authenticated
      using (exists (select 1 from public.admin_users where user_id = auth.uid()))
      with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
  end if;
end $$;

insert into public.profile (
  id, display_name, short_name, role, bio_primary, bio_secondary, location,
  focus, education, status, email, github, linkedin, website, hero_roles,
  hero_description
)
values (
  1,
  'M. Firdaus Suryaningrat',
  'Shuriza',
  'Fullstack Web Developer',
  'Halo! Saya Shuriza, seorang fullstack web developer dari Kediri, Jawa Timur. Saya passionate dalam membangun aplikasi web modern yang clean, performant, dan user-friendly.',
  'Dengan pengalaman di React, Next.js, Laravel, dan berbagai teknologi web modern, saya selalu berusaha menciptakan solusi digital yang memberikan dampak nyata.',
  'Kediri, Jawa Timur',
  'Fullstack Web',
  'Informatics Eng.',
  'Open to work',
  'firdausmfirdaus657@gmail.com',
  'https://github.com/shuriza',
  'https://www.linkedin.com/in/m-firdaus-suryaningrat-73a471338/',
  'https://shuriza.tech',
  array['I build modern web apps', 'I craft clean & scalable code', 'I turn ideas into reality', 'I love React & Laravel'],
  'Saya membangun aplikasi web yang rapi, cepat, dan siap dipakai menggunakan React, Next.js, dan Laravel.'
)
on conflict (id) do nothing;

insert into public.skills (name, category, icon, color, sort_order)
select * from (values
  ('React', 'Frontend', 'SiReact', '#61DAFB', 0),
  ('Next.js', 'Frontend', 'SiNextdotjs', '#ffffff', 1),
  ('TypeScript', 'Frontend', 'SiTypescript', '#3178C6', 2),
  ('Tailwind CSS', 'Frontend', 'SiTailwindcss', '#06B6D4', 3),
  ('Framer Motion', 'Frontend', 'SiFramer', '#0055FF', 4),
  ('Vite', 'Frontend', 'SiVite', '#646CFF', 5),
  ('Laravel', 'Backend', 'SiLaravel', '#FF2D20', 0),
  ('PHP', 'Backend', 'SiPhp', '#777BB4', 1),
  ('Node.js', 'Backend', 'SiNodedotjs', '#339933', 2),
  ('MySQL', 'Backend', 'SiMysql', '#4479A1', 3),
  ('SQLite', 'Backend', 'SiSqlite', '#003B57', 4),
  ('REST API', 'Backend', 'TbApi', '#22d3ee', 5),
  ('Git', 'Tools', 'SiGit', '#F05032', 0),
  ('Docker', 'Tools', 'SiDocker', '#2496ED', 1),
  ('Vercel', 'Tools', 'SiVercel', '#ffffff', 2),
  ('VS Code', 'Tools', 'VscVscode', '#007ACC', 3)
) as seed(name, category, icon, color, sort_order)
where not exists (select 1 from public.skills);

-- ============================================================
-- CV content + feature toggles (idempotent, aman dijalankan ulang)
-- Blok ini identik dengan bagian akhir supabase/upgrade.sql.
-- ============================================================

alter table public.profile add column if not exists cv_headline text not null default '';
alter table public.profile add column if not exists cv_summary text not null default '';
alter table public.profile add column if not exists soft_skills text[] not null default '{}';
alter table public.profile add column if not exists languages jsonb not null default '[]'::jsonb;

-- Data pendidikan tetap statis di halaman CV; kolom legacy ini tidak lagi digunakan.
alter table public.profile drop column if exists cv_education;

update public.profile
set cv_headline = 'Junior Fullstack Web Developer'
where id = 1 and (cv_headline = '' or cv_headline = 'Fullstack Web Developer');

update public.profile
set cv_summary = 'Lulusan D3 Manajemen Informatika dengan dasar Rekayasa Perangkat Lunak sejak SMK. Memiliki pengalaman mengerjakan proyek web menggunakan Laravel, PHP, MySQL, React, Next.js, dan TypeScript. Memiliki ketertarikan pada perkembangan Artificial Intelligence (AI).'
where id = 1 and (
  cv_summary = ''
  or cv_summary like 'Mahasiswa D3%'
  or cv_summary like 'Fullstack web developer dengan fokus pada pengembangan web modern:%'
);

update public.profile
set
  cv_headline = coalesce(nullif(cv_headline, ''), role),
  cv_summary = coalesce(
    nullif(cv_summary, ''),
    'Lulusan D3 Manajemen Informatika dengan dasar Rekayasa Perangkat Lunak sejak SMK. Memiliki pengalaman mengerjakan proyek web menggunakan Laravel, PHP, MySQL, React, Next.js, dan TypeScript. Memiliki ketertarikan pada perkembangan Artificial Intelligence (AI).'
  ),
  soft_skills = case
    when coalesce(cardinality(soft_skills), 0) = 0
      then array['Self-learning', 'Problem Solving', 'Team Collaboration', 'Time Management']
    else soft_skills
  end,
  languages = case
    when jsonb_array_length(languages) = 0
      then '[{"name":"Bahasa Indonesia","level":"Native"},{"name":"English","level":"Basic"}]'::jsonb
    else languages
  end
where id = 1;

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

alter table public.site_settings enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'site_settings' and policyname = 'Anyone can read site settings') then
    create policy "Anyone can read site settings" on public.site_settings for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'site_settings' and policyname = 'Admins can insert site settings') then
    create policy "Admins can insert site settings" on public.site_settings for insert to authenticated
      with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'site_settings' and policyname = 'Admins can update site settings') then
    create policy "Admins can update site settings" on public.site_settings for update to authenticated
      using (exists (select 1 from public.admin_users where user_id = auth.uid()))
      with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
  end if;
end $$;

insert into public.site_settings (id) values (1) on conflict (id) do nothing;
