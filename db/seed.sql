begin;

insert into public.profile (
  id, display_name, short_name, role, bio_primary, bio_secondary, location,
  focus, education, status, email, github, linkedin, website, hero_roles,
  hero_description, cv_headline, cv_summary, soft_skills, languages
)
values (
  1,
  'M. Firdaus Suryaningrat',
  'Shuriza',
  'Junior Web Developer | AI Automation',
  'Lulusan D3 Manajemen Informatika dengan fokus pada pengembangan aplikasi web berbasis Laravel, PHP, MySQL, integrasi AI/API, dan automasi alur kerja.',
  'Saya mengembangkan sistem rekap absensi DPMPTSP, Todo AI dengan Gemini, Google Classroom, dan Telegram Bot, serta project pribadi untuk routing provider AI dan efisiensi token. Saya sedang memperdalam AI-assisted development, workflow automation, dan penerjemahan kebutuhan bisnis menjadi instruksi yang dapat diuji.',
  'Kediri, Jawa Timur',
  'AI Automation & Laravel',
  'D3 Manajemen Informatika · IPK 3,63',
  'Terbuka untuk Magang',
  'firdausmfirdaus657@gmail.com',
  'https://github.com/shuriza',
  'https://www.linkedin.com/in/m-firdaus-suryaningrat-73a471338/',
  'https://shuriza.tech',
  array['AI Automation · Gemini · Telegram Bot', 'Laravel 12 · PHP · MySQL', 'Token/API Awareness · Workflow Automation'],
  'Junior web developer dengan pengalaman membangun aplikasi operasional, integrasi AI/API, workflow automation, dan laporan berbasis data.',
  'Junior Web Developer | AI Automation, Laravel',
  'Lulusan D3 Manajemen Informatika Politeknik Negeri Malang (IPK 3,63) dengan pengalaman membangun aplikasi web dan automasi berbasis Laravel, PHP, MySQL, serta integrasi AI/API. Dalam tim empat mahasiswa, mengembangkan sebagian besar alur sistem rekap absensi DPMPTSP, termasuk impor dan validasi Excel, dashboard analitik, laporan Excel/PDF, dan demo kepada pengguna. Membangun Todo AI dengan Gemini, Google Classroom, dan Telegram Bot; mengembangkan 9Router untuk routing/fallback provider dan efisiensi token; serta merancang workflow n8n dengan approval Telegram. Sedang memperdalam AI agent, prompt design, pengujian respons, dan dokumentasi SOP.',
  array['Problem Solving', 'Kolaborasi Tim', 'Komunikasi', 'Manajemen Waktu'],
  '[{"name":"Bahasa Indonesia","level":"Native"},{"name":"English","level":"Basic"}]'::jsonb
)
on conflict (id) do nothing;

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

insert into public.projects (id, title, description, tech, github, demo, featured, published, sort_order)
select seed.*
from (values
  ('00000000-0000-4000-8000-000000000007'::uuid, 'Luncur', 'Platform untuk mengunggah HTML atau ZIP, mengelola revisi, dan menerbitkan website statis tanpa menyiapkan VPS sendiri.', array['Laravel 13', 'PHP 8.3', 'React 19', 'Inertia', 'TypeScript', 'Vite']::text[], null::text, null::text, true, true, 0),
  ('00000000-0000-4000-8000-000000000008'::uuid, 'Gudang Scan', 'Aplikasi inventaris gudang berbasis barcode untuk Android dengan database SQLite offline dan alur stok atomik.', array['Laravel 13', 'Livewire 4', 'NativePHP Mobile', 'SQLite', 'Barcode Scanner']::text[], 'https://github.com/shuriza/gudang-scan', null::text, true, true, 1),
  ('00000000-0000-4000-8000-000000000006'::uuid, 'Focus Tracker', 'Ekstensi Chrome dan dashboard untuk memahami durasi browsing, mengatur kuota domain, dan mengurangi distraksi.', array['Next.js', 'TypeScript', 'Supabase', 'Chrome Extension MV3', 'Recharts']::text[], 'https://github.com/shuriza/focus-tracker', 'https://focus-tracker-one-wheat.vercel.app', true, true, 2),
  ('00000000-0000-4000-8000-000000000001'::uuid, 'Todo AI', 'Aplikasi manajemen tugas dengan Matriks Eisenhower, Google Classroom, Gemini AI, Telegram Bot, kalender, dan laporan analitik.', array['Laravel 12', 'PHP', 'MySQL', 'Gemini API', 'Google Classroom API', 'Telegram Bot']::text[], 'https://github.com/shuriza/todos', 'https://todosxai.ninja/', true, true, 3),
  ('00000000-0000-4000-8000-000000000002'::uuid, 'Sistem Rekap Absensi DPMPTSP', 'Sistem Laravel untuk impor dan validasi absensi, pengelolaan izin, dashboard analitik, serta laporan Excel dan PDF.', array['Laravel 12', 'PHP', 'MySQL', 'Alpine.js', 'Laravel Excel', 'DomPDF']::text[], 'https://github.com/shuriza/rekap_absensi', null::text, true, true, 4),
  ('00000000-0000-4000-8000-000000000005'::uuid, 'CosplayNesia', 'Marketplace demo untuk penyewaan dan pembelian kostum cosplay dengan checkout transaksional dan fulfillment multi-penjual.', array['Laravel 13', 'PHP', 'PostgreSQL', 'Blade', 'JavaScript', 'Docker']::text[], 'https://github.com/shuriza/CosplayNesia', null::text, true, true, 5),
  ('00000000-0000-4000-8000-000000000009'::uuid, 'Akui HRIS', 'Sistem informasi SDM internal dengan rekrutmen, data karyawan, absensi, cuti, training, payroll, KPI, dan onboarding.', array['Laravel 13', 'PHP', 'Blade', 'Tailwind CSS', 'Alpine.js', 'Chart.js']::text[], null::text, null::text, false, true, 6),
  ('00000000-0000-4000-8000-000000000010'::uuid, 'Antrian Loket', 'Aplikasi desktop offline untuk petugas loket dengan tiket, pemanggilan, audit trail, backup, dan outbox sinkronisasi.', array['Laravel 13', 'NativePHP Desktop', 'SQLite', 'Blade', 'Tailwind CSS', 'JavaScript']::text[], null::text, null::text, false, true, 7),
  ('00000000-0000-4000-8000-000000000011'::uuid, 'Website Komunitas Desa Muneng', 'Portal komunitas warga untuk berita, agenda, kenangan, destinasi, UMKM, galeri, peta, dan moderasi konten.', array['Laravel 13', 'Inertia.js', 'React', 'TypeScript', 'SQLite', 'Tailwind CSS']::text[], null::text, null::text, false, true, 8),
  ('00000000-0000-4000-8000-000000000003'::uuid, 'Kandangan Fresh', 'Marketplace Laravel untuk produk petani bawang merah dengan katalog, OAuth, pembayaran, invoice, dan laporan penjualan.', array['Laravel 11', 'PHP', 'MySQL', 'Midtrans', 'Laravel Socialite', 'DomPDF']::text[], 'https://github.com/shuriza/bawang', null::text, false, true, 9),
  ('00000000-0000-4000-8000-000000000004'::uuid, 'Shuriza Store', 'Platform e-commerce produk digital dengan checkout guest, multi-gateway payment, sinkronisasi stok, dan otomasi fulfillment.', array['Laravel 12', 'MySQL', 'Blade', 'Tailwind CSS', 'Payment Gateway', 'Bot Automation']::text[], null::text, 'https://shurizastore.biz.id/', false, true, 10),
  ('00000000-0000-4000-8000-000000000012'::uuid, 'Carte — Affiliate Content Studio', 'Workflow n8n untuk mengubah brief produk berbasis fakta menjadi script, audio, video, cover, dan manifest audit.', array['n8n', 'Node.js', 'OpenAI', 'Creatomate', 'Telegram', 'Google Drive']::text[], null::text, null::text, false, true, 11),
  ('00000000-0000-4000-8000-000000000013'::uuid, 'Front-end Lab', 'Kumpulan eksperimen frontend, canvas, physics, dan interaksi visual.', array['HTML', 'CSS', 'JavaScript', 'Canvas', 'Vercel']::text[], 'https://github.com/shuriza/front-end-lab', null::text, false, true, 12),
  ('00000000-0000-4000-8000-000000000014'::uuid, 'Web Anime', 'Website streaming anime berbasis Next.js sebagai latihan katalog dan navigasi frontend.', array['Next.js', 'JavaScript', 'React', 'Vercel']::text[], 'https://github.com/shuriza/web-anime', null::text, false, true, 13),
  ('00000000-0000-4000-8000-000000000015'::uuid, 'Shopee Seller Notifikasi', 'Tool otomasi notifikasi seller yang disimpan sebagai repository publik untuk ditinjau.', array['JavaScript', 'Automation', 'API']::text[], 'https://github.com/shuriza/shopee-seller-notifikasi', null::text, false, true, 14),
  ('00000000-0000-4000-8000-000000000016'::uuid, 'Sosmed Storefront', 'Storefront layanan dengan katalog, order, wallet, dan payment flow.', array['Laravel', 'PHP', 'Orders', 'Wallet', 'Payments']::text[], null::text, null::text, false, true, 15),
  ('00000000-0000-4000-8000-000000000017'::uuid, '9Router', 'Router AI lokal untuk menghubungkan banyak provider dan model, menghemat token, serta melakukan fallback.', array['Next.js', 'React', 'TypeScript', 'SQLite', 'AI API', 'Docker']::text[], null::text, null::text, false, true, 16),
  ('00000000-0000-4000-8000-000000000018'::uuid, 'LMS Cerdas', 'Learning Management System berbasis Laravel untuk materi, tugas, pengumpulan, sinkronisasi LMS kampus, pengingat, dan bantuan AI.', array['Laravel 12', 'PHP', 'MySQL', 'Redis', 'Meilisearch', 'OpenRouter', 'Telegram']::text[], null::text, null::text, false, true, 17),
  ('00000000-0000-4000-8000-000000000019'::uuid, 'Dashboard Visualisasi Data JKN', 'Dashboard Flask untuk preprocessing, analisis statistik, dan visualisasi interaktif jumlah peserta rawat jalan menurut kelompok JKN.', array['Python', 'Flask', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Plotly']::text[], null::text, null::text, false, true, 18),
  ('00000000-0000-4000-8000-000000000020'::uuid, 'Arsip Surat', 'Aplikasi web Laravel untuk mengunggah, mencari, melihat, dan mengelola arsip surat resmi di lingkungan desa.', array['Laravel 12', 'PHP 8.3', 'MySQL', 'Bootstrap', 'Tailwind CSS', 'Vite']::text[], null::text, null::text, false, true, 19),
  ('00000000-0000-4000-8000-000000000021'::uuid, 'Tokoku', 'Marketplace produk digital dengan role admin dan customer, checkout Midtrans, Google SSO, email invoice, dan unduhan produk.', array['Laravel 10', 'PHP', 'MySQL', 'Bootstrap', 'JavaScript', 'Midtrans', 'Google OAuth']::text[], null::text, null::text, false, true, 20),
  ('00000000-0000-4000-8000-000000000022'::uuid, 'Aplikasi Mobile Polinema', 'Aplikasi Android berbasis Kotlin sebagai latihan pengembangan mobile dengan AndroidX, Material Components, dan View Binding.', array['Kotlin', 'Android', 'AndroidX', 'Material Components', 'View Binding']::text[], null::text, null::text, false, true, 21)
) as seed(id, title, description, tech, github, demo, featured, published, sort_order)
where not exists (select 1 from public.projects existing where existing.title = seed.title);

insert into public.skills (id, name, category, icon, color, sort_order)
select seed.*
from (values
  ('00000000-0000-4000-8000-000000000101'::uuid, 'React', 'Frontend', 'SiReact', '#61DAFB', 0),
  ('00000000-0000-4000-8000-000000000102'::uuid, 'Next.js', 'Frontend', 'SiNextdotjs', '#ffffff', 1),
  ('00000000-0000-4000-8000-000000000103'::uuid, 'TypeScript', 'Frontend', 'SiTypescript', '#3178C6', 2),
  ('00000000-0000-4000-8000-000000000104'::uuid, 'Tailwind CSS', 'Frontend', 'SiTailwindcss', '#06B6D4', 3),
  ('00000000-0000-4000-8000-000000000105'::uuid, 'Framer Motion', 'Frontend', 'SiFramer', '#0055FF', 4),
  ('00000000-0000-4000-8000-000000000106'::uuid, 'Vite', 'Frontend', 'SiVite', '#646CFF', 5),
  ('00000000-0000-4000-8000-000000000107'::uuid, 'Laravel', 'Backend', 'SiLaravel', '#FF2D20', 0),
  ('00000000-0000-4000-8000-000000000108'::uuid, 'PHP', 'Backend', 'SiPhp', '#777BB4', 1),
  ('00000000-0000-4000-8000-000000000109'::uuid, 'Node.js', 'Backend', 'SiNodedotjs', '#339933', 2),
  ('00000000-0000-4000-8000-000000000110'::uuid, 'MySQL', 'Backend', 'SiMysql', '#4479A1', 3),
  ('00000000-0000-4000-8000-000000000111'::uuid, 'SQLite', 'Backend', 'SiSqlite', '#003B57', 4),
  ('00000000-0000-4000-8000-000000000112'::uuid, 'REST API', 'Backend', 'TbApi', '#22d3ee', 5),
  ('00000000-0000-4000-8000-000000000113'::uuid, 'Git', 'Tools', 'SiGit', '#F05032', 0),
  ('00000000-0000-4000-8000-000000000114'::uuid, 'Docker', 'Tools', 'SiDocker', '#2496ED', 1),
  ('00000000-0000-4000-8000-000000000115'::uuid, 'Vercel', 'Tools', 'SiVercel', '#ffffff', 2),
  ('00000000-0000-4000-8000-000000000116'::uuid, 'VS Code', 'Tools', 'VscVscode', '#007ACC', 3),
  ('00000000-0000-4000-8000-000000000117'::uuid, 'AI API Integration', 'Tools', 'TbApi', '#22d3ee', 4),
  ('00000000-0000-4000-8000-000000000118'::uuid, 'Workflow Automation', 'Tools', 'TbApi', '#a78bfa', 5),
  ('00000000-0000-4000-8000-000000000119'::uuid, 'AI-assisted Development', 'Tools', 'VscVscode', '#22d3ee', 6)
) as seed(id, name, category, icon, color, sort_order)
where not exists (
  select 1 from public.skills existing where existing.name = seed.name and existing.category = seed.category
);

commit;
