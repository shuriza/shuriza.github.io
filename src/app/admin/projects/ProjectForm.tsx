"use client";

import Link from "next/link";
import type { Project } from "@/lib/projects";
import { PROJECT_CATEGORY_LABELS, PROJECT_STATUS_LABELS, type ProjectCategory, type ProjectStatus } from "@/lib/project-model";
import SubmitButton from "@/components/SubmitButton";

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
      <div className="grid gap-6 sm:grid-cols-3">
        <label className="block text-sm text-slate-300">
          Slug URL
          <input name="slug" defaultValue={project?.slug ?? ""} placeholder="nama-project" className="admin-input" />
        </label>
        <label className="block text-sm text-slate-300">
          Status
          <select name="status" defaultValue={project?.status ?? "case-study"} className="admin-input">
            {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map((status) => (
              <option key={status} value={status}>{PROJECT_STATUS_LABELS[status]}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-slate-300">
          Kategori
          <select name="category" defaultValue={project?.category ?? "case-study"} className="admin-input">
            {(Object.keys(PROJECT_CATEGORY_LABELS) as ProjectCategory[]).map((category) => (
              <option key={category} value={category}>{PROJECT_CATEGORY_LABELS[category]}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm text-slate-300">
          GitHub URL
          <input name="github" type="url" defaultValue={project?.github ?? ""} placeholder="https://github.com/..." className="admin-input" />
        </label>
        <label className="block text-sm text-slate-300">
          Demo URL
          <input name="demo" type="url" defaultValue={project?.demo ?? ""} placeholder="https://..." className="admin-input" />
        </label>
        <label className="block text-sm text-slate-300">
          Video URL <span className="text-slate-500">(opsional)</span>
          <input name="video" type="url" defaultValue={project?.video ?? ""} placeholder="https://..." className="admin-input" />
        </label>
      </div>
      <details open className="rounded-lg border border-[#334155] p-4">
        <summary className="cursor-pointer font-semibold text-white">Case study detail</summary>
        <div className="mt-5 space-y-5">
          <label className="block text-sm text-slate-300">
            Peran
            <input name="role" defaultValue={project?.role ?? ""} placeholder="Developer utama aplikasi" className="admin-input" />
          </label>
          <label className="block text-sm text-slate-300">
            Masalah yang diselesaikan
            <textarea name="problem" rows={3} defaultValue={project?.problem ?? ""} className="admin-input resize-y" />
          </label>
          <label className="block text-sm text-slate-300">
            Fitur <span className="text-slate-500">(satu fitur per baris)</span>
            <textarea name="features" rows={5} defaultValue={project?.features?.join("\n") ?? ""} className="admin-input resize-y" />
          </label>
          <label className="block text-sm text-slate-300">
            Batasan akses
            <textarea name="limitations" rows={3} defaultValue={project?.limitations ?? ""} className="admin-input resize-y" />
          </label>
          <label className="block text-sm text-slate-300">
            Screenshot <span className="text-slate-500">(satu path lokal /public per baris)</span>
            <textarea name="screenshots" rows={4} defaultValue={project?.screenshots?.join("\n") ?? ""} placeholder="/project-evidence/dashboard.png" className="admin-input resize-y" />
          </label>
        </div>
      </details>
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
        <SubmitButton>Simpan project</SubmitButton>
        <Link href="/admin/projects" className="text-sm text-slate-400 hover:text-cyan-300">Batal</Link>
      </div>
    </form>
  );
}
