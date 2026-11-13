begin;

-- Extend the legacy content tables without removing any existing columns or rows.
alter table public.projects add column if not exists catalog_key text;
alter table public.projects add column if not exists slug text;
alter table public.projects add column if not exists status text;
alter table public.projects add column if not exists category text;
alter table public.projects add column if not exists role text;
alter table public.projects add column if not exists problem text;
alter table public.projects add column if not exists features text[] not null default '{}';
alter table public.projects add column if not exists limitations text;
alter table public.projects add column if not exists video text;
alter table public.projects add column if not exists screenshots text[] not null default '{}';

alter table public.profile add column if not exists phone text not null default '';
alter table public.profile add column if not exists cv_experiences jsonb not null default '[]'::jsonb;
alter table public.profile add column if not exists cv_education jsonb not null default '[]'::jsonb;
alter table public.profile add column if not exists cv_project_keys text[] not null default '{}';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'projects_status_check') then
    alter table public.projects add constraint projects_status_check
      check (status is null or status in ('live', 'hosted', 'video', 'case-study', 'private'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'projects_category_check') then
    alter table public.projects add constraint projects_category_check
      check (category is null or category in ('web', 'laravel', 'mobile-desktop', 'ai-automation', 'case-study'));
  end if;
end $$;

create unique index if not exists projects_catalog_key_unique
  on public.projects (catalog_key)
  where catalog_key is not null;

create unique index if not exists projects_slug_unique
  on public.projects (slug)
  where slug is not null;

-- Backfill stable identity from the catalog. Future edits use catalog_key, not title.
update public.projects as project
set
  catalog_key = coalesce(project.catalog_key, seed.catalog_key),
  slug = coalesce(project.slug, seed.slug),
  status = coalesce(project.status, seed.status),
  category = coalesce(project.category, seed.category)
from (values
  ('Luncur', 'luncur', 'luncur', 'case-study', 'laravel'),
  ('Gudang Scan', 'gudang-scan', 'gudang-scan', 'case-study', 'mobile-desktop'),
  ('Focus Tracker', 'focus-tracker', 'focus-tracker', 'live', 'web'),
  ('Todo AI', 'todo-ai', 'todo-ai', 'case-study', 'ai-automation'),
  ('Sistem Rekap Absensi DPMPTSP', 'rekap-absensi-dpmptsp', 'sistem-rekap-absensi-dpmptsp', 'case-study', 'laravel'),
  ('CosplayNesia', 'cosplaynesia', 'cosplaynesia', 'case-study', 'laravel'),
  ('Akui HRIS', 'akui-hris', 'akui-hris', 'private', 'case-study'),
  ('Antrian Loket', 'antrian-loket', 'antrian-loket', 'case-study', 'mobile-desktop'),
  ('Website Komunitas Desa Muneng', 'website-desa-muneng', 'website-komunitas-desa-muneng', 'private', 'web'),
  ('Kandangan Fresh', 'kandangan-fresh', 'kandangan-fresh', 'case-study', 'laravel'),
  ('Shuriza Store', 'shuriza-store', 'shuriza-store', 'live', 'laravel'),
  ('Carte — Affiliate Content Studio', 'carte', 'carte-affiliate-content-studio', 'private', 'ai-automation'),
  ('Front-end Lab', 'front-end-lab', 'front-end-lab', 'case-study', 'web'),
  ('Web Anime', 'web-anime', 'web-anime', 'case-study', 'web'),
  ('Shopee Seller Notifikasi', 'shopee-seller-notifikasi', 'shopee-seller-notifikasi', 'case-study', 'ai-automation'),
  ('Sosmed Storefront', 'sosmed-storefront', 'sosmed-storefront', 'private', 'laravel'),
  ('9Router', '9router', '9router', 'private', 'ai-automation'),
  ('LMS Cerdas', 'lms-cerdas', 'lms-cerdas', 'private', 'laravel'),
  ('Dashboard Visualisasi Data JKN', 'dashboard-jkn', 'dashboard-visualisasi-data-jkn', 'private', 'web'),
  ('Arsip Surat', 'arsip-surat', 'arsip-surat', 'private', 'laravel'),
  ('Tokoku', 'tokoku', 'tokoku', 'private', 'laravel'),
  ('Aplikasi Mobile Polinema', 'polinema-mobile', 'aplikasi-mobile-polinema', 'private', 'mobile-desktop')
) as seed(title, catalog_key, slug, status, category)
where project.title = seed.title;

-- Reconcile stale legacy links with the currently published evidence policy.
update public.projects set demo = null where catalog_key = 'todo-ai' and demo = 'https://todosxai.ninja/';
update public.projects set github = null where catalog_key = 'shuriza-store' and github = 'https://github.com/shuriza/shuriza-store';

update public.profile
set
  phone = case when btrim(phone) = '' then '0817-7509-3906' else phone end,
  cv_experiences = case when jsonb_array_length(cv_experiences) = 0 then '[{"title":"Mahasiswa Magang - Pengembangan Aplikasi Web","company":"DPMPTSP Kota Kediri","location":"Kota Kediri, Jawa Timur","period":"Juni 2025 - Agustus 2025","bullets":["Mengembangkan sebagian besar alur sistem rekap absensi internal dalam tim beranggotakan empat mahasiswa, menggunakan Laravel 12 dan MySQL untuk mengelola data kehadiran pegawai.","Membangun alur impor dan validasi Excel, pengelolaan izin presensi, dashboard analitik per departemen, serta laporan bulanan dan tahunan dalam format Excel dan PDF.","Mendemonstrasikan sistem kepada karyawan dan pengguna pada tahap akhir pengembangan."]}]'::jsonb else cv_experiences end,
  cv_education = case when jsonb_array_length(cv_education) = 0 then '[{"title":"D3 Manajemen Informatika","institution":"Politeknik Negeri Malang","period":"2023 - 2026 · IPK 3,63","description":"Fokus pada pengembangan perangkat lunak, basis data, analisis sistem, dan manajemen proyek."},{"title":"Rekayasa Perangkat Lunak (RPL)","institution":"SMKN 1 Kertosono","period":"2020 - 2023","description":"Mempelajari dasar pemrograman dan pengembangan perangkat lunak dengan Java."}]'::jsonb else cv_education end,
  cv_project_keys = case when coalesce(cardinality(cv_project_keys), 0) = 0 then array['rekap-absensi-dpmptsp', 'todo-ai', 'shuriza-store'] else cv_project_keys end
where id = 1;

commit;
