"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route-error]", { digest: error.digest, error });
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-6 text-slate-200">
      <section className="max-w-lg rounded-2xl border border-red-500/30 bg-[#0f172a] p-8 text-center shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Shuriza</p>
        <h1 className="mt-3 text-2xl font-bold text-white">Halaman belum dapat dimuat</h1>
        <p className="mt-3 leading-relaxed text-slate-300">
          Terjadi gangguan sementara saat memuat data. Coba lagi atau kembali ke halaman utama.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-cyan-500 px-5 py-2.5 font-semibold text-[#0a0a0f] transition-colors hover:bg-cyan-400"
          >
            Coba lagi
          </button>
          <Link
            href="/"
            className="rounded-full border border-slate-600 px-5 py-2.5 font-semibold text-slate-200 transition-colors hover:border-cyan-400 hover:text-cyan-300"
          >
            Ke beranda
          </Link>
        </div>
      </section>
    </main>
  );
}
