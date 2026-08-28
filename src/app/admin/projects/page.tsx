import Link from "next/link";
import AdminNav from "@/app/admin/AdminNav";
import { deleteProject } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin";
import type { Project } from "@/lib/projects";

export default async function AdminProjectsPage() {
  const { supabase, user } = await requireAdmin();
  const { data, error } = await supabase
    .from("projects")
    .select("id, title, description, tech, github, demo, featured, published, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  const projects = (data ?? []) as Project[];

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-6 py-10 text-slate-200">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-cyan-400">Dashboard</p>
            <h1 className="text-3xl font-bold text-white">Projects</h1>
            <p className="mt-2 text-sm text-slate-400">Login sebagai {user.email}</p>
          </div>
          <AdminNav
            active="/admin/projects"
            action={
              <Link href="/admin/projects/new" className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-[#0a0a0f] hover:bg-cyan-400">
                + Tambah project
              </Link>
            }
          />
        </header>

        {error && <p className="mb-5 text-sm text-red-400">Gagal memuat project: {error.message}</p>}
        <div className="overflow-hidden rounded-xl border border-[#334155] bg-[#0f172a]">
          <div className="hidden grid-cols-[1fr_140px_120px_160px] gap-4 border-b border-[#334155] px-5 py-4 text-xs uppercase tracking-wider text-slate-500 sm:grid">
            <span>Project</span><span>Status</span><span>Urutan</span><span>Aksi</span>
          </div>
          {projects.length === 0 ? (
            <p className="px-5 py-10 text-center text-slate-400">Belum ada project.</p>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="grid gap-4 border-b border-[#334155] px-5 py-5 last:border-0 sm:grid-cols-[1fr_140px_120px_160px] sm:items-center">
                <div>
                  <h2 className="font-semibold text-white">{project.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-400">{project.description}</p>
                </div>
                <span className={project.published ? "text-sm text-emerald-400" : "text-sm text-slate-500"}>
                  {project.published ? "Published" : "Draft"}
                </span>
                <span className="text-sm text-slate-400">{project.sort_order}</span>
                <div className="flex items-center gap-3 text-sm">
                  <Link href={`/admin/projects/${project.id}/edit`} className="text-cyan-400 hover:text-cyan-300">Edit</Link>
                  <form action={deleteProject}>
                    <input type="hidden" name="id" value={project.id} />
                    <button className="text-red-400 hover:text-red-300">Hapus</button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
