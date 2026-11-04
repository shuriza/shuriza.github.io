import Link from "next/link";
import { loginAdmin } from "@/app/admin/auth-actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message =
    error === "setup"
      ? "Konfigurasi admin belum lengkap. Isi DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD_HASH, dan AUTH_SECRET di Vercel."
      : error === "invalid"
        ? "Email atau password tidak valid."
        : "";

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-6 py-16 text-slate-200">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-sm text-slate-400 hover:text-cyan-400">
          &larr; Kembali ke portfolio
        </Link>
        <div className="mt-8 rounded-2xl border border-[#334155] bg-[#0f172a] p-8 shadow-2xl">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-cyan-400">Admin</p>
          <h1 className="mb-2 text-3xl font-bold text-white">Masuk ke dashboard</h1>
          <p className="mb-8 text-sm leading-relaxed text-slate-400">
            Kelola project yang tampil di portfolio kamu.
          </p>

          <form action={loginAdmin} className="space-y-5">
            <label className="block text-sm text-slate-300">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-lg border border-[#475569] bg-[#0a0a0f] px-4 py-3 text-white outline-none focus:border-cyan-400"
                autoComplete="email"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Password
              <input
                name="password"
                type="password"
                required
                className="mt-2 w-full rounded-lg border border-[#475569] bg-[#0a0a0f] px-4 py-3 text-white outline-none focus:border-cyan-400"
                autoComplete="current-password"
              />
            </label>
            {message && <p role="alert" className="text-sm text-red-400">{message}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-[#0a0a0f] transition hover:bg-cyan-400"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
