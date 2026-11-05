# Shuriza Portfolio

Personal portfolio website with 3D particle animations, animated terminal, and a server-side admin dashboard.

**Live:** [shuriza.tech](https://shuriza.tech)

[![CI](https://github.com/shuriza/shuriza.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/shuriza/shuriza.github.io/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

## Features

- 3D floating particles and wireframe shapes (Three.js / React Three Fiber)
- Typewriter text animation
- Animated terminal
- Scroll-triggered section animations
- Responsive layout with mobile navigation
- Certificate and course-completion evidence with direct document links
- Admin CRUD for projects, skills, profile/CV, and feature toggles

## Project catalog

The public [Project Lab](https://shuriza.tech/projects) is a curated catalog, not a list of unverified links. Projects are labeled by the evidence a visitor can actually inspect:

- **Live Demo**: a public URL is available.
- **Hosted Demo**: a hosted preview is available, but it is not presented as a production service.
- **Case Study / Source**: the repository, implementation notes, or a project walkthrough is available without a live deployment.
- **Private Case Study**: the work is described at a safe, anonymized level because the source or data is proprietary.

Projects that are not yet in the database are maintained in `src/lib/project-catalog.ts`. Server-side project loading merges that catalog with CMS rows, while client components consume only the framework-independent model and presentation data. This keeps the portfolio useful in a fresh build and prevents a missing database row from silently hiding a finished project.

Flagship case studies can also render local or repository-hosted screenshots on their detail page. Screenshots are presented as evidence of the interface only; they do not imply a live production deployment.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| 3D | Three.js, @react-three/fiber, @react-three/drei |
| Database | Neon PostgreSQL |
| Data access | Drizzle ORM + Neon HTTP driver |
| Admin auth | Signed HttpOnly session cookie + scrypt password hash |
| Deploy | Vercel |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database setup

The application reads the database only on the server. Public pages use explicit, read-only query projections; browser code never receives a database credential. Admin Server Actions re-check the signed session before every mutation.

1. Create a Neon database through the [Vercel Marketplace Neon integration](https://vercel.com/marketplace/neon), or create a project directly in Neon.
2. Run `db/schema.sql` against the new database.
3. For a new installation, run `db/seed.sql`. For an existing Supabase installation, follow [Migrating from Supabase](#migrating-from-supabase) instead of seeding first.
4. Copy `.env.example` to `.env.local` and fill the variables below.
5. Generate an admin password hash:

   ```bash
   npm run db:hash-password
   ```

   Put the printed value in `ADMIN_PASSWORD_HASH`. The command accepts an optional local-only argument, but an interactive prompt is safer for shell history.

6. Generate `AUTH_SECRET` locally and add the result to `.env.local`:

   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
   ```

7. Start the app and open `http://localhost:3000/admin/login`.

### Environment variables

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD_HASH="scrypt$16384$8$1$generated-salt$generated-hash"
AUTH_SECRET=at-least-32-random-characters
```

`DATABASE_URL`, `ADMIN_PASSWORD_HASH`, and `AUTH_SECRET` are server-only secrets. Do not prefix them with `NEXT_PUBLIC_` and do not commit `.env` files.

When `DATABASE_URL` is absent, public routes deliberately use the checked-in fallback content so CI and a first build remain usable. Admin routes stay disabled until all auth variables are present.

## Admin dashboard

The dashboard is available at `/admin/login`.

| Menu | Function |
|------|----------|
| Projects | CRUD project yang tampil di portfolio dan CV |
| Skills | CRUD skill per kategori (Frontend/Backend/Tools) |
| Profile | Identitas, bio, hero, kontak, dan konten CV |
| Settings | Menyembunyikan/menampilkan fitur situs |

The login account is the single `ADMIN_EMAIL` configured in Vercel. There is no public database API and no browser-side database client. The admin session is an HttpOnly, SameSite cookie signed with `AUTH_SECRET`; the server validates it again inside `requireAdmin()` and every Server Action.

## Migrating from Supabase

The old Supabase project should remain untouched until the new deployment has passed the public-page and admin CRUD smoke checks. The migration copies content tables only; Supabase Auth users are intentionally not copied because the new dashboard uses the configured single-admin credentials.

1. Create the Neon database and run only `db/schema.sql`.
2. Obtain the Supabase **direct PostgreSQL connection string** using the database password. The anon key is not sufficient for a full export.
3. Set temporary local variables (PowerShell example):

   ```powershell
   $env:SUPABASE_DATABASE_URL="postgresql://..."
   $env:DATABASE_URL="postgresql://...neon.tech/...?..."
   ```

4. Run the idempotent importer:

   ```bash
   npm run db:migrate:supabase
   ```

   It migrates `projects`, `skills`, the singleton `profile`, and `site_settings`, preserving IDs, timestamps, drafts, and CV JSON data. It does not migrate `auth.users` or `admin_users`.

5. Generate a new `ADMIN_PASSWORD_HASH` and set `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `AUTH_SECRET` in Vercel.
6. Deploy and verify `/`, `/cv`, `/admin/login`, one project edit, one skill edit, profile save, settings save, and logout.
7. Remove the old `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` variables only after verification. Keep the Supabase project as a temporary rollback source until the cutover is accepted.

The one-time importer requires the `postgres` dev dependency and reads credentials only from process environment. Never commit either connection string.

## Vercel deployment

1. Install the Neon integration from the Vercel Marketplace and connect it to the production project.
2. Add `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `AUTH_SECRET` to the **Production** environment. Keep them out of Preview unless a separate preview admin is intended.
3. Redeploy after the environment variables and Neon schema/data are ready.
4. Confirm the deployment uses `DATABASE_URL` injected by the integration and that no `NEXT_PUBLIC_SUPABASE_*` variable is still required.

Vercel Postgres is not used here: Vercel's own documentation states that the product is no longer available for new projects; Neon is connected through the Marketplace instead.

## Verification commands

```bash
npm test
npm run lint
npm run build
```

## License

MIT
