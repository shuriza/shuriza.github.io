# Shuriza Portfolio

Personal portfolio website with 3D particle animations, animated terminal, and modern UI.

**Live:** [shuriza.tech](https://shuriza.tech)

[![CI](https://github.com/shuriza/shuriza.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/shuriza/shuriza.github.io/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

## Features

- 3D floating particles & wireframe shapes (Three.js / React Three Fiber)
- Typewriter text animation
- Animated terminal (code typing effect)
- Scroll-triggered section animations (Framer Motion)
- Responsive design with mobile hamburger menu
- Dark theme with cyan accent

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| 3D | Three.js, @react-three/fiber, @react-three/drei |
| Animation | Framer Motion |
| Deploy | Vercel |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
```

## Admin Project CRUD

Dashboard admin tersedia di `/admin/login` dan menggunakan Supabase Auth dengan
email/password. Data project, skills, profile, halaman CV, dan pengaturan fitur
disimpan di Supabase PostgreSQL, bukan di browser.

1. Buat project di [Supabase](https://supabase.com/), lalu buka SQL Editor.
2. Jalankan isi file `supabase/schema.sql` untuk membuat tabel, RLS policy, dan seed project, skills, serta profile. Jika schema lama sudah pernah dijalankan, cukup jalankan `supabase/upgrade.sql`.
3. Buat user admin di Supabase Dashboard melalui **Authentication > Users > Add user**.
4. Jalankan query terakhir di `supabase/schema.sql` dengan UUID user tersebut agar akun punya akses admin.
5. Salin `.env.example` menjadi `.env.local`, lalu isi URL dan anon key dari **Project Settings > API**.
6. Jalankan `npm run dev`, kemudian buka `http://localhost:3000/admin/login`.

Menu dashboard:

| Menu | Fungsi |
|------|--------|
| Projects | CRUD project yang tampil di halaman utama dan CV |
| Skills | CRUD skill per kategori (Frontend/Backend/Tools) |
| Profile | Identitas, bio, hero, kontak, dan konten halaman CV |
| Settings | Menyembunyikan/menampilkan fitur situs |

### Halaman CV

`/cv` sepenuhnya mengambil data dari database: header dan ringkasan dari tabel
`profile`, skill dari tabel `skills`, dan project dari tabel `projects`. Tidak ada
lagi data yang di-hardcode, jadi CV tidak bisa lagi berbeda dari halaman utama.
Field khusus CV (`cv_headline`, `cv_summary`, soft skills, dan bahasa) diatur di
menu **Profile**.

### Menyembunyikan fitur

Menu **Settings** menyimpan toggle di tabel `site_settings`: section About,
Skills, Projects, Contact, halaman CV, background 3D, dan tombol Login di navbar.
Mematikan toggle hanya menyembunyikan tampilannya — datanya tetap di database dan
bisa dinyalakan lagi kapan saja. Khusus `cv_enabled`, rute `/cv` akan membalas 404
saat dimatikan, dan link CV di navbar serta section Contact ikut hilang.

Toggle **Tombol Login di navbar** hanya menyembunyikan tombolnya; `/admin/login`
tetap bisa diakses langsung dan tetap dilindungi Supabase Auth + RLS.

Jika tabel `site_settings` atau kolom CV belum ada (migration belum dijalankan),
semua fitur dianggap aktif dan halaman publik tetap tampil normal. Halaman
`/admin/settings` akan menampilkan peringatan berisi instruksi migration.

Environment yang dibutuhkan:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Saat environment Supabase belum diisi, halaman publik tetap menampilkan seed
`Shuriza Store` sebagai fallback. CRUD admin baru aktif setelah konfigurasi
Supabase selesai.

## License

MIT
