import Link from "next/link";
import { createSkill } from "@/app/admin/actions";
import SkillForm from "@/app/admin/skills/SkillForm";
import { requireAdmin } from "@/lib/admin";

export default async function NewSkillPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireAdmin();
  const { error } = await searchParams;
  return <main className="min-h-screen bg-[#0a0a0f] px-6 py-10 text-slate-200"><div className="mx-auto max-w-3xl"><Link href="/admin/skills" className="text-sm text-slate-400 hover:text-cyan-400">&larr; Semua skill</Link><h1 className="mb-8 mt-6 text-3xl font-bold text-white">Tambah skill</h1><SkillForm action={createSkill} error={error} /></div></main>;
}
