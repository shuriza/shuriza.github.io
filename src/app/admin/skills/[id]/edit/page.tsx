import Link from "next/link";
import { notFound } from "next/navigation";
import { updateSkill } from "@/app/admin/actions";
import SkillForm from "@/app/admin/skills/SkillForm";
import { requireAdmin } from "@/lib/admin";
import type { Skill } from "@/lib/skills";

export default async function EditSkillPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const { data } = await supabase.from("skills").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <main className="min-h-screen bg-[#0a0a0f] px-6 py-10 text-slate-200"><div className="mx-auto max-w-3xl"><Link href="/admin/skills" className="text-sm text-slate-400 hover:text-cyan-400">&larr; Semua skill</Link><h1 className="mb-8 mt-6 text-3xl font-bold text-white">Edit skill</h1><SkillForm action={updateSkill} skill={data as Skill} error={error} /></div></main>;
}
