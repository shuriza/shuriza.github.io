import Link from "next/link";
import { createProject } from "@/app/admin/actions";
import ProjectForm from "@/app/admin/projects/ProjectForm";
import { requireAdmin } from "@/lib/admin";

export default async function NewProjectPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireAdmin();
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-6 py-10 text-slate-200">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin/projects" className="text-sm text-slate-400 hover:text-cyan-400">&larr; Semua project</Link>
        <h1 className="mb-8 mt-6 text-3xl font-bold text-white">Tambah project</h1>
        <ProjectForm action={createProject} error={error} />
      </div>
    </main>
  );
}
