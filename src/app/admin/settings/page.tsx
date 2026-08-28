import type { Metadata } from "next";
import AdminNav from "@/app/admin/AdminNav";
import { updateSettings } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin";
import { FEATURE_TOGGLES, resolveSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Site settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { supabase, user } = await requireAdmin();
  const [{ data, error }, params] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    searchParams,
  ]);

  const settings = resolveSettings(data);

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-6 py-10 text-slate-200">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-cyan-400">Dashboard</p>
            <h1 className="text-3xl font-bold text-white">Site settings</h1>
            <p className="mt-2 text-sm text-slate-400">Login sebagai {user.email}</p>
          </div>
          <AdminNav active="/admin/settings" />
        </header>

        {params.saved && (
          <p className="mb-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            Pengaturan berhasil disimpan.
          </p>
        )}
        {params.error && (
          <p className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {params.error}
          </p>
        )}
        {error && (
          <p className="mb-5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Tabel <code>site_settings</code> belum tersedia ({error.message}). Jalankan{" "}
            <code>supabase/upgrade.sql</code> di SQL Editor, lalu muat ulang halaman ini.
            Sementara itu semua fitur dianggap aktif.
          </p>
        )}

        <form
          action={updateSettings}
          className="rounded-xl border border-[#334155] bg-[#0f172a] p-6 sm:p-8"
        >
          <p className="mb-6 text-sm text-slate-400">
            Matikan toggle untuk menyembunyikan fitur dari halaman publik. Datanya tetap
            tersimpan di database, jadi bisa dinyalakan kembali kapan saja.
          </p>

          <ul className="divide-y divide-[#334155]">
            {FEATURE_TOGGLES.map((toggle) => (
              <li key={toggle.key} className="py-4">
                <label className="flex cursor-pointer items-start gap-4">
                  <input
                    type="checkbox"
                    name={toggle.key}
                    defaultChecked={settings[toggle.key]}
                    className="mt-1 h-5 w-5 shrink-0 accent-cyan-500"
                  />
                  <span>
                    <span className="block font-medium text-white">{toggle.label}</span>
                    <span className="mt-1 block text-sm text-slate-400">
                      {toggle.description}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>

          <button className="mt-6 rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-[#0a0a0f] hover:bg-cyan-400">
            Simpan pengaturan
          </button>
        </form>
      </div>
    </main>
  );
}
