"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    searchParams.get("error") === "unauthorized"
      ? "Akun ini belum terdaftar sebagai admin."
      : ""
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Email atau password tidak valid.");
      setLoading(false);
      return;
    }

    router.push("/admin/projects");
    router.refresh();
  }

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

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm text-slate-300">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-lg border border-[#475569] bg-[#0a0a0f] px-4 py-3 text-white outline-none focus:border-cyan-400"
                autoComplete="email"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-lg border border-[#475569] bg-[#0a0a0f] px-4 py-3 text-white outline-none focus:border-cyan-400"
                autoComplete="current-password"
              />
            </label>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-[#0a0a0f] transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
