import Link from "next/link";
import { updateProfile } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin";
import { fallbackProfile, getProfile } from "@/lib/profile";

export default async function AdminProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { user } = await requireAdmin();
  const [profile, params] = await Promise.all([getProfile(), searchParams]);

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-6 py-10 text-slate-200">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-cyan-400">Dashboard</p>
            <h1 className="text-3xl font-bold text-white">Profile settings</h1>
            <p className="mt-2 text-sm text-slate-400">Login sebagai {user.email}</p>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm">
            <Link href="/admin/projects" className="rounded-lg border border-[#475569] px-4 py-2 text-slate-300 hover:border-cyan-400 hover:text-cyan-300">Projects</Link>
            <Link href="/admin/skills" className="rounded-lg border border-[#475569] px-4 py-2 text-slate-300 hover:border-cyan-400 hover:text-cyan-300">Skills</Link>
          </nav>
        </header>

        {params.saved && <p className="mb-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">Profile berhasil disimpan.</p>}
        {params.error && <p className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{params.error}</p>}

        <form action={updateProfile} className="space-y-8 rounded-xl border border-[#334155] bg-[#0f172a] p-6 sm:p-8">
          <section>
            <h2 className="mb-5 text-lg font-semibold text-white">Identitas</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm text-slate-300">Nama lengkap<input name="display_name" required defaultValue={profile.display_name || fallbackProfile.display_name} className="admin-input" /></label>
              <label className="block text-sm text-slate-300">Nama singkat<input name="short_name" required defaultValue={profile.short_name || fallbackProfile.short_name} className="admin-input" /></label>
              <label className="block text-sm text-slate-300">Role<input name="role" required defaultValue={profile.role || fallbackProfile.role} className="admin-input" /></label>
              <label className="block text-sm text-slate-300">Status<input name="status" required defaultValue={profile.status || fallbackProfile.status} className="admin-input" /></label>
              <label className="block text-sm text-slate-300">Lokasi<input name="location" required defaultValue={profile.location || fallbackProfile.location} className="admin-input" /></label>
              <label className="block text-sm text-slate-300">Focus<input name="focus" required defaultValue={profile.focus || fallbackProfile.focus} className="admin-input" /></label>
              <label className="block text-sm text-slate-300 sm:col-span-2">Pendidikan<input name="education" required defaultValue={profile.education || fallbackProfile.education} className="admin-input" /></label>
            </div>
          </section>

          <section>
            <h2 className="mb-5 text-lg font-semibold text-white">About</h2>
            <div className="space-y-5">
              <label className="block text-sm text-slate-300">Bio utama<textarea name="bio_primary" required rows={4} defaultValue={profile.bio_primary || fallbackProfile.bio_primary} className="admin-input resize-y" /></label>
              <label className="block text-sm text-slate-300">Bio tambahan<textarea name="bio_secondary" required rows={4} defaultValue={profile.bio_secondary || fallbackProfile.bio_secondary} className="admin-input resize-y" /></label>
            </div>
          </section>

          <section>
            <h2 className="mb-5 text-lg font-semibold text-white">Hero & Kontak</h2>
            <div className="space-y-5">
              <label className="block text-sm text-slate-300">Hero description<textarea name="hero_description" required rows={3} defaultValue={profile.hero_description || fallbackProfile.hero_description} className="admin-input resize-y" /></label>
              <label className="block text-sm text-slate-300">Hero roles <span className="text-slate-500">(satu role per baris)</span><textarea name="hero_roles" required rows={5} defaultValue={profile.hero_roles.join("\n")} className="admin-input resize-y" /></label>
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">Email<input name="email" type="email" required defaultValue={profile.email || fallbackProfile.email} className="admin-input" /></label>
                <label className="block text-sm text-slate-300">Website URL<input name="website" type="url" required defaultValue={profile.website || fallbackProfile.website} className="admin-input" /></label>
                <label className="block text-sm text-slate-300">GitHub URL<input name="github" type="url" required defaultValue={profile.github || fallbackProfile.github} className="admin-input" /></label>
                <label className="block text-sm text-slate-300">LinkedIn URL<input name="linkedin" type="url" required defaultValue={profile.linkedin || fallbackProfile.linkedin} className="admin-input" /></label>
              </div>
            </div>
          </section>

          <button className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-[#0a0a0f] hover:bg-cyan-400">Simpan profile</button>
        </form>
      </div>
    </main>
  );
}
