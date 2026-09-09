-- Jalankan file ini jika schema.sql versi project sudah pernah dijalankan.
-- File ini aman dijalankan setelah tabel projects/admin_users sudah tersedia.
-- Phase 1 (expand): aman dijalankan sebelum atau sesudah deploy aplikasi baru.
-- Jalankan supabase/lockdown.sql hanya setelah aplikasi baru terverifikasi di production.

begin;

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
  1, 'M. Firdaus Suryaningrat', 'Shuriza', 'Fullstack Web Developer',
  'Halo! Saya Shuriza, seorang fullstack web developer dari Kediri, Jawa Timur. Saya passionate dalam membangun aplikasi web modern yang clean, performant, dan user-friendly.',
  'Dengan pengalaman di React, Next.js, Laravel, dan berbagai teknologi web modern, saya selalu berusaha menciptakan solusi digital yang memberikan dampak nyata.',
  'Kediri, Jawa Timur', 'Fullstack Web', 'Informatics Eng.', 'Open to work',
  'firdausmfirdaus657@gmail.com', 'https://github.com/shuriza',
  'https://www.linkedin.com/in/m-firdaus-suryaningrat-73a471338/', 'https://shuriza.tech',
  array['I build modern web apps', 'I craft clean & scalable code', 'I turn ideas into reality', 'I love React & Laravel'],
  'Saya membangun aplikasi web yang rapi, cepat, dan siap dipakai menggunakan React, Next.js, dan Laravel.'
)
on conflict (id) do nothing;

update public.profile
set
  linkedin = 'https://www.linkedin.com/in/m-firdaus-suryaningrat-73a471338/',
  website = 'https://shuriza.tech'
where id = 1;

update public.profile
set display_name = 'M. Firdaus Suryaningrat'
where id = 1 and btrim(display_name) in ('', '-');

update public.profile
set
  role = 'Junior Laravel Developer',
  status = 'Terbuka untuk Magang',
  location = 'Kediri, Jawa Timur',
  focus = 'Laravel & API Integration',
  education = 'D3 Manajemen Informatika · IPK 3,63',
  bio_primary = 'Lulusan D3 Manajemen Informatika dengan fokus pada pengembangan aplikasi web berbasis Laravel, PHP, MySQL, dan integrasi API.',
  bio_secondary = 'Saya mengembangkan sistem rekap absensi untuk DPMPTSP Kota Kediri serta aplikasi manajemen tugas yang terintegrasi Google Classroom, Gemini AI, dan Telegram Bot. Saya juga tertarik dan sedang mendalami penerapan AI dalam pengembangan aplikasi web.',
  hero_description = 'Junior Laravel Developer dengan pengalaman membangun aplikasi operasional, integrasi API, autentikasi, dan laporan berbasis data.',
  hero_roles = array['Laravel 12 · PHP · MySQL', 'REST API · OAuth · AI Integration', 'Blade · Alpine.js · Tailwind CSS']
where id = 1;

update public.projects
set
  description = case title
    when 'Todo AI' then 'Aplikasi manajemen tugas Laravel dengan Matriks Eisenhower, Google Classroom, Gemini AI, Google OAuth, Telegram Bot dua arah, kalender, dan laporan analitik.'
    when 'Sistem Rekap Absensi DPMPTSP' then 'Sistem Laravel untuk impor dan validasi data absensi, pengelolaan izin, dashboard analitik, serta laporan bulanan dan tahunan dalam format Excel dan PDF.'
    when 'Kandangan Fresh' then 'Marketplace Laravel untuk petani bawang merah dengan katalog, role admin dan pelanggan, Google OAuth, pembayaran Midtrans, invoice PDF, dan laporan penjualan.'
    when 'Shuriza Store' then 'Platform e-commerce Laravel 12 untuk produk digital dengan checkout guest, pembayaran multi-gateway, sinkronisasi stok supplier, alokasi kredensial, dan otomasi fulfillment melalui bot WhatsApp serta Telegram.'
    else description
  end,
  tech = case
    when title = 'Shuriza Store' then array['Laravel 12', 'MySQL', 'Blade', 'Tailwind CSS', 'Payment Gateway', 'Bot Automation']
    else tech
  end,
  github = case when title = 'Shuriza Store' then 'https://github.com/shuriza/shuriza-store' else github end,
  demo = case
    when title = 'Todo AI' then null
    when title = 'Shuriza Store' then 'https://shurizastore.biz.id/'
    else demo
  end
where title in ('Todo AI', 'Sistem Rekap Absensi DPMPTSP', 'Kandangan Fresh', 'Shuriza Store');

insert into public.projects (
  title, description, tech, github, demo, featured, published, sort_order
)
select seed.*
from (values
  (
    'CosplayNesia',
    'Masih dalam pengembangan — marketplace penyewaan dan pembelian kostum cosplay dengan checkout atomik, reservasi sewa, fulfillment multi-penjual, dan ulasan pembeli terverifikasi.',
    array['Laravel 13', 'PHP', 'SQLite', 'Blade', 'JavaScript']::text[],
    'https://github.com/shuriza/CosplayNesia', null::text, false, true, 4
  ),
  (
    'Focus Tracker',
    'Masih dalam pengembangan — pencatat durasi browsing dan pemblokir distraksi melalui ekstensi Chrome, sinkronisasi Supabase, aturan kuota domain, dan dashboard analitik tujuh hari.',
    array['Next.js 16', 'TypeScript', 'Supabase', 'Chrome Extension MV3', 'Recharts']::text[],
    'https://github.com/shuriza/focus-tracker', null::text, false, true, 5
  )
) as seed(title, description, tech, github, demo, featured, published, sort_order)
where not exists (
  select 1 from public.projects existing where existing.title = seed.title
);

insert into public.skills (name, category, icon, color, sort_order)
select * from (values
  ('React', 'Frontend', 'SiReact', '#61DAFB', 0), ('Next.js', 'Frontend', 'SiNextdotjs', '#ffffff', 1),
  ('TypeScript', 'Frontend', 'SiTypescript', '#3178C6', 2), ('Tailwind CSS', 'Frontend', 'SiTailwindcss', '#06B6D4', 3),
  ('Framer Motion', 'Frontend', 'SiFramer', '#0055FF', 4), ('Vite', 'Frontend', 'SiVite', '#646CFF', 5),
  ('Laravel', 'Backend', 'SiLaravel', '#FF2D20', 0), ('PHP', 'Backend', 'SiPhp', '#777BB4', 1),
  ('Node.js', 'Backend', 'SiNodedotjs', '#339933', 2), ('MySQL', 'Backend', 'SiMysql', '#4479A1', 3),
  ('SQLite', 'Backend', 'SiSqlite', '#003B57', 4), ('REST API', 'Backend', 'TbApi', '#22d3ee', 5),
  ('Git', 'Tools', 'SiGit', '#F05032', 0), ('Docker', 'Tools', 'SiDocker', '#2496ED', 1),
  ('Vercel', 'Tools', 'SiVercel', '#ffffff', 2), ('VS Code', 'Tools', 'VscVscode', '#007ACC', 3)
) as seed(name, category, icon, color, sort_order)
where not exists (select 1 from public.skills);

-- ============================================================
-- CV content + feature toggles (idempotent, aman dijalankan ulang)
-- ============================================================

alter table public.profile add column if not exists cv_headline text not null default '';
alter table public.profile add column if not exists cv_summary text not null default '';
alter table public.profile add column if not exists soft_skills text[] not null default '{}';
alter table public.profile add column if not exists languages jsonb not null default '[]'::jsonb;

update public.profile
set
  cv_headline = 'Junior Laravel Developer',
  cv_summary = 'Lulusan D3 Manajemen Informatika Politeknik Negeri Malang dengan IPK 3,63 dan dasar Rekayasa Perangkat Lunak. Berpengalaman membangun aplikasi Laravel 11/12 berbasis MySQL untuk kebutuhan instansi dan akademik, termasuk REST API, Google OAuth, integrasi Gemini dan Telegram, serta laporan Excel/PDF. Tertarik dan sedang mendalami penerapan Artificial Intelligence (AI) dalam pengembangan aplikasi web.',
  soft_skills = array['Problem Solving', 'Kolaborasi Tim', 'Komunikasi', 'Manajemen Waktu'],
  languages = '[{"name":"Bahasa Indonesia","level":"Native"},{"name":"English","level":"Basic"}]'::jsonb
where id = 1;

-- Data pendidikan tetap statis di halaman CV; kolom legacy ini tidak lagi digunakan.
alter table public.profile drop column if exists cv_education;

update public.profile
set cv_headline = 'Junior Fullstack Web Developer'
where id = 1 and (cv_headline = '' or cv_headline = 'Fullstack Web Developer');

-- Timpa ringkasan lama bergaya mahasiswa hanya jika masih boilerplate default,
-- supaya ringkasan yang sudah diedit manual lewat admin tidak ikut tertimpa.
update public.profile
set cv_summary = 'Lulusan D3 Manajemen Informatika dengan dasar Rekayasa Perangkat Lunak sejak SMK. Memiliki pengalaman mengerjakan proyek web menggunakan Laravel, PHP, MySQL, React, Next.js, dan TypeScript. Tertarik dan sedang mendalami penerapan Artificial Intelligence (AI) dalam pengembangan aplikasi web.'
where id = 1 and (
  cv_summary = ''
  or cv_summary like 'Mahasiswa D3%'
  or cv_summary like 'Fullstack web developer dengan fokus pada pengembangan web modern:%'
);

-- Isi awal field CV dari data profile yang sudah ada.
update public.profile
set
  cv_headline = coalesce(nullif(cv_headline, ''), role),
  cv_summary = coalesce(
    nullif(cv_summary, ''),
    'Lulusan D3 Manajemen Informatika dengan dasar Rekayasa Perangkat Lunak sejak SMK. Memiliki pengalaman mengerjakan proyek web menggunakan Laravel, PHP, MySQL, React, Next.js, dan TypeScript. Tertarik dan sedang mendalami penerapan Artificial Intelligence (AI) dalam pengembangan aplikasi web.'
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

-- Public views keep the API stable and prevent future private columns from
-- becoming readable merely because they are added to base tables. Legacy base
-- table reads intentionally remain until the contract phase in lockdown.sql.
create or replace view public.portfolio_profile with (security_barrier = true) as
select
  id, display_name, short_name, role, bio_primary, bio_secondary, location,
  focus, education, status, email, github, linkedin, website, hero_roles,
  hero_description, cv_headline, cv_summary, soft_skills, languages
from public.profile
where id = 1;

create or replace view public.portfolio_site_settings with (security_barrier = true) as
select
  id, about_enabled, skills_enabled, projects_enabled, contact_enabled,
  cv_enabled, particles_enabled, admin_link_enabled
from public.site_settings
where id = 1;

create or replace view public.portfolio_projects with (security_barrier = true) as
select id, title, description, tech, github, demo, featured, published, sort_order
from public.projects
where published = true;

create or replace view public.portfolio_skills with (security_barrier = true) as
select id, name, category, icon, color, published, sort_order
from public.skills
where published = true;

-- Views are automatically updatable unless their ACL is explicitly restricted.
revoke all on table public.portfolio_profile, public.portfolio_site_settings,
  public.portfolio_projects, public.portfolio_skills from anon, authenticated, PUBLIC;
grant select on table public.portfolio_profile to anon, authenticated;
grant select on table public.portfolio_site_settings to anon, authenticated;
grant select on table public.portfolio_projects to anon, authenticated;
grant select on table public.portfolio_skills to anon, authenticated;

-- Keep the prior release operational until the view-based release is verified.
grant select on table public.profile, public.site_settings, public.projects, public.skills to anon;

notify pgrst, 'reload schema';

commit;
