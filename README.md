# Shuriza Portfolio

Personal portfolio website with 3D particle animations, animated terminal, and modern UI.

**Live:** [portofolio-gilt-zeta-13.vercel.app](https://portofolio-gilt-zeta-13.vercel.app)

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
email/password. Data project, skills, dan profile disimpan di Supabase PostgreSQL,
bukan di browser.

1. Buat project di [Supabase](https://supabase.com/), lalu buka SQL Editor.
2. Jalankan isi file `supabase/schema.sql` untuk membuat tabel, RLS policy, dan seed project, skills, serta profile. Jika schema lama sudah pernah dijalankan, cukup jalankan `supabase/upgrade.sql`.
3. Buat user admin di Supabase Dashboard melalui **Authentication > Users > Add user**.
4. Jalankan query terakhir di `supabase/schema.sql` dengan UUID user tersebut agar akun punya akses admin.
5. Salin `.env.example` menjadi `.env.local`, lalu isi URL dan anon key dari **Project Settings > API**.
6. Jalankan `npm run dev`, kemudian buka `http://localhost:3000/admin/login`.

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
