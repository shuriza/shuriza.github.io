import Link from "next/link";
import { deleteSkill, signOut } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin";
import { SKILL_ICON_OPTIONS, type Skill } from "@/lib/skills";

export default async function AdminSkillsPage() {
  const { supabase, user } = await requireAdmin();
  const { data, error } = await supabase
    .from("skills")
    .select("id, name, category, icon, color, published, sort_order")
    .order("category")
    .order("sort_order");
  const skills = (data ?? []) as Skill[];

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-6 py-10 text-slate-200">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="mb-2 text-sm uppercase tracking-[0.2em] text-cyan-400">Dashboard</p><h1 className="text-3xl font-bold text-white">Skills</h1><p className="mt-2 text-sm text-slate-400">Login sebagai {user.email}</p></div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/projects" className="rounded-lg border border-[#475569] px-4 py-2 text-sm text-slate-300 hover:border-cyan-400 hover:text-cyan-300">Projects</Link>
            <Link href="/admin/profile" className="rounded-lg border border-[#475569] px-4 py-2 text-sm text-slate-300 hover:border-cyan-400 hover:text-cyan-300">Profile</Link>
            <Link href="/admin/skills/new" className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-[#0a0a0f] hover:bg-cyan-400">+ Tambah skill</Link>
            <form action={signOut}><button className="rounded-lg border border-[#475569] px-4 py-2 text-sm text-slate-300 hover:border-cyan-400 hover:text-cyan-300">Keluar</button></form>
          </div>
        </header>
        {error && <p className="mb-5 text-sm text-red-400">Gagal memuat skill: {error.message}</p>}
        <div className="overflow-hidden rounded-xl border border-[#334155] bg-[#0f172a]">
          {skills.length === 0 ? <p className="px-5 py-10 text-center text-slate-400">Belum ada skill. Jalankan migration Supabase terlebih dahulu.</p> : skills.map((skill) => {
            const Icon = SKILL_ICON_OPTIONS[skill.icon] ?? SKILL_ICON_OPTIONS.TbApi;
            return <div key={skill.id} className="grid gap-4 border-b border-[#334155] px-5 py-5 last:border-0 sm:grid-cols-[1fr_140px_120px_160px] sm:items-center">
              <div className="flex items-center gap-3"><Icon size={22} style={{ color: skill.color }} /><div><h2 className="font-semibold text-white">{skill.name}</h2><p className="text-xs text-slate-500">{skill.icon}</p></div></div>
              <span className="text-sm text-cyan-400">{skill.category}</span>
              <span className={skill.published ? "text-sm text-emerald-400" : "text-sm text-slate-500"}>{skill.published ? "Published" : "Draft"}</span>
              <div className="flex items-center gap-3 text-sm"><Link href={`/admin/skills/${skill.id}/edit`} className="text-cyan-400 hover:text-cyan-300">Edit</Link><form action={deleteSkill}><input type="hidden" name="id" value={skill.id} /><button className="text-red-400 hover:text-red-300">Hapus</button></form></div>
            </div>;
          })}
        </div>
      </div>
    </main>
  );
}
