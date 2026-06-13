# CV Page Design Spec

**Date:** 2026-06-14
**Author:** OpenCode + M. Firdaus Suryaningrat

## Overview

Tambahkan halaman `/cv` di portofolio Next.js yang menampilkan Curriculum Vitae lengkap. Halaman menggunakan tema yang sama dengan portofolio (dark slate + cyan accent) dan mendukung print-to-PDF via browser `window.print()` dengan CSS `@media print` yang menghasilkan output bersih (background putih, teks hitam).

## Data Diri

- **Nama:** M. Firdaus Suryaningrat
- **Tagline:** Aspiring Fullstack Web Developer
- **Email:** firdausmfirdaus657@gmail.com
- **Lokasi:** Kediri, Jawa Timur
- **GitHub:** https://github.com/shuriza
- **Website:** https://shuriza.me
- **Foto:** Tidak ada — gunakan inisial avatar (huruf "MF" di circle)

## Sections (urutan)

### 1. Header
- Inisial avatar (circle dengan huruf "MF", background cyan)
- Nama lengkap besar
- Tagline di bawah nama
- Baris kontak: email, lokasi, GitHub, website — horizontal, icon + teks

### 2. Profile / Summary
> Mahasiswa D3 Manajemen Informatika dengan ketertarikan pada pengembangan web modern. Berfokus pada ekosistem React/Next.js untuk frontend dan Laravel untuk backend. Aktif membangun project pribadi untuk mengasah skill, salah satunya e-commerce Shuriza Store. Terbuka untuk peluang magang, freelance, atau kolaborasi.

### 3. Education
- D3 Manajemen Informatika

### 4. Technical Skills
Diambil dari `src/components/sections/Skills.tsx`:
- **Frontend:** React, Next.js, TypeScript, Tailwind CSS, Framer Motion, Vite
- **Backend:** Laravel, PHP, Node.js, MySQL, SQLite, REST API
- **Tools:** Git, Docker, Vercel, VS Code

Tampilan: badge/tag per skill, dikelompokkan per kategori.

### 5. Projects
Diambil dari `src/components/sections/Projects.tsx`:
- **Shuriza Store** — E-commerce platform dengan product catalog, shopping cart, dan order management system. Tech: Next.js, React, Tailwind CSS, TypeScript. Links: GitHub + Live Demo.

### 6. Soft Skills
- Self-learning
- Problem Solving
- Team Collaboration
- Time Management

### 7. Languages
- Bahasa Indonesia (Native)
- English (Basic)

## File Structure

```
src/
  app/
    cv/
      page.tsx          # Halaman utama CV (server component wrapper)
  components/
    Navbar.tsx          # Tambah link "CV" ke navigasi
```

Semua konten CV ditulis langsung di `page.tsx` — tidak perlu dipecah ke sub-komponen karena scope-nya kecil.

## Styling

### Browse mode (default)
- Tema dark konsisten dengan portofolio: bg-[#0f172a], teks slate-300/white
- Accent cyan-400 untuk heading section dan highlight
- Max-width ~900px, centered
- Inisial avatar: circle 80px, bg-cyan-500, teks putih bold
- Section divider: garis tipis border-[#334155]
- Skill badges: border cyan-500/20, bg cyan-500/5, teks cyan-300
- Tombol "Print CV" di pojok kanan atas (fixed/sticky), icon printer

### Print mode (@media print)
- Background putih, teks hitam/dark gray
- Heading section: cyan-600 (tetap ada warna tapi ramah cetak)
- Sembunyikan: Navbar, Footer, ParticleField, tombol Print
- Font-size dikecilkan sedikit agar muat 1-2 halaman A4
- Margin kertas standar
- Skill badges: border solid gray, tanpa background transparan
- Link ditampilkan sebagai teks (tanpa underline biru)

## Navbar Update

Tambah item "CV" di navigasi:
- Desktop: link biasa di deretan nav items
- Mobile: masuk ke hamburger menu
- Href: `/cv`
- Tidak perlu scroll behavior (beda halaman)

## Out of Scope
- Experience / Magang section (belum ada data)
- Certifications section (belum ada data)
- Foto profil asli
- PDF generation server-side (cukup browser print)
