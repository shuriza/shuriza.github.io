"use client";

import Link from "next/link";
import type { Skill } from "@/lib/skills";
import { SKILL_CATEGORIES, SKILL_ICON_OPTIONS } from "@/lib/skills";

type SkillAction = (formData: FormData) => void | Promise<void>;

export default function SkillForm({ action, skill, error }: { action: SkillAction; skill?: Skill; error?: string }) {
  return <form action={action} className="space-y-6 rounded-xl border border-[#334155] bg-[#0f172a] p-6 sm:p-8">
    {skill && <input type="hidden" name="id" value={skill.id} />}
    <label className="block text-sm text-slate-300">Nama skill<input name="name" required defaultValue={skill?.name} className="admin-input" /></label>
    <div className="grid gap-6 sm:grid-cols-2">
      <label className="block text-sm text-slate-300">Kategori<select name="category" defaultValue={skill?.category ?? "Frontend"} className="admin-input">{SKILL_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
      <label className="block text-sm text-slate-300">Icon<select name="icon" defaultValue={skill?.icon ?? "TbApi"} className="admin-input">{Object.keys(SKILL_ICON_OPTIONS).map((icon) => <option key={icon}>{icon}</option>)}</select></label>
    </div>
    <div className="grid gap-6 sm:grid-cols-2">
      <label className="block text-sm text-slate-300">Warna<input name="color" required pattern="#[0-9a-fA-F]{6}" defaultValue={skill?.color ?? "#22d3ee"} className="admin-input" /></label>
      <label className="block text-sm text-slate-300">Urutan tampil<input name="sort_order" type="number" defaultValue={skill?.sort_order ?? 0} className="admin-input" /></label>
    </div>
    <label className="inline-flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" name="published" defaultChecked={skill?.published ?? true} /> Tampilkan di portfolio</label>
    {error && <p className="text-sm text-red-400">{error}</p>}
    <div className="flex items-center gap-4"><button className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-[#0a0a0f] hover:bg-cyan-400">Simpan skill</button><Link href="/admin/skills" className="text-sm text-slate-400 hover:text-cyan-300">Batal</Link></div>
  </form>;
}
