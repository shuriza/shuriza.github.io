import Link from "next/link";
import { notFound } from "next/navigation";
import { updateProject } from "@/app/admin/actions";
import ProjectForm from "@/app/admin/projects/ProjectForm";
import { requireAdmin } from "@/lib/admin";
import { isUuid } from "@/lib/admin-validation";
import type { Project } from "@/lib/projects";

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  if (!isUuid(id)) notFound();

  const { data, error: queryError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (queryError) {
    console.error("[admin] gagal memuat project:", queryError);
    return (
      <main className="min-h-screen bg-[#0a0a0f] px-6 py-10 text-slate-200">
        <div className="mx-auto max-w-3xl">
          <Link href="/admin/projects" className="text-sm text-slate-400 hover:text-cyan-400">&larr; Semua project</Link>
          <section role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
            <h1 className="font-semibold text-white">Project tidak dapat dimuat</h1>
            <p className="mt-2 text-sm">Periksa koneksi Supabase, lalu muat ulang halaman. Tidak ada perubahan yang dapat disimpan saat ini.</p>
          </section>
        </div>
      </main>
    );
  }
  if (!data) notFound();

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-6 py-10 text-slate-200">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin/projects" className="text-sm text-slate-400 hover:text-cyan-400">&larr; Semua project</Link>
        <h1 className="mb-8 mt-6 text-3xl font-bold text-white">Edit project</h1>
        <ProjectForm action={updateProject} project={data as Project} error={error} />
      </div>
    </main>
  );
}
