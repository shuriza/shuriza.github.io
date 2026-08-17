"use client";

import Link from "next/link";
import type { Project } from "@/lib/projects";

type ProjectAction = (formData: FormData) => void | Promise<void>;

export default function ProjectForm({
  action,
  project,
  error,
}: {
  action: ProjectAction;
  project?: Project;
  error?: string;
}) {
  return (
    <form action={action} className="space-y-6 rounded-xl border border-[#334155] bg-[#0f172a] p-6 sm:p-8">
      {project && <input type="hidden" name="id" value={project.id} />}
      <label className="block text-sm text-slate-300">
        Nama project
        <input name="title" required defaultValue={project?.title} className="admin-input" />
      </label>
      <label className="block text-sm text-slate-300">
        Description
        <textarea name="description" required rows={5} defaultValue={project?.description} className="admin-input resize-y" />
      </label>
      <label className="block text-sm text-slate-300">
        Teknologi <span className="text-slate-500">(pisahkan dengan koma)</span>
        <input name="tech" required defaultValue={project?.tech.join(", ")} className="admin-input" />
      </label>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm text-slate-300">
          GitHub URL
          <input name="github" type="url" defaultValue={project?.github ?? ""} placeholder="https://github.com/..." className="admin-input" />
        </label>
        <label className="block text-sm text-slate-300">
          Demo URL
          <input name="demo" type="url" defaultValue={project?.demo ?? ""} placeholder="https://..." className="admin-input" />
        </label>
      </div>
      <label className="block text-sm text-slate-300">
        Urutan tampil
        <input name="sort_order" type="number" defaultValue={project?.sort_order ?? 0} className="admin-input" />
      </label>
      <div className="flex flex-wrap gap-5 text-sm text-slate-300">
        <label className="inline-flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} /> Featured</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={project?.published ?? true} /> Tampilkan di portfolio</label>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex items-center gap-4">
        <button className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-[#0a0a0f] hover:bg-cyan-400">Simpan project</button>
        <Link href="/admin/projects" className="text-sm text-slate-400 hover:text-cyan-300">Batal</Link>
      </div>
    </form>
  );
}
