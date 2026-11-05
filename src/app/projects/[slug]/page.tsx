import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  getProjectBySlug,
  getPublishedProjects,
  PROJECT_CATEGORY_LABELS,
  PROJECT_STATUS_LABELS,
} from "@/lib/projects";
import { getProfile } from "@/lib/profile";
import { getSiteSettings } from "@/lib/settings-server";

export async function generateStaticParams() {
  return (await getPublishedProjects()).map((project) => ({ slug: project.slug ?? project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const project = await getProjectBySlug((await params).slug);
  return project
    ? { title: `${project.title} | Shuriza`, description: project.description }
    : { title: "Project tidak ditemukan | Shuriza" };
}

function statusClass(status: string) {
  if (status === "live") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
  if (status === "hosted") return "border-amber-400/30 bg-amber-400/10 text-amber-300";
  if (status === "private") return "border-violet-400/30 bg-violet-400/10 text-violet-300";
  return "border-cyan-400/30 bg-cyan-400/10 text-cyan-300";
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const project = await getProjectBySlug((await params).slug);
  if (!project) notFound();

  const [profile, settings] = await Promise.all([getProfile(), getSiteSettings()]);
  const status = project.status ?? (project.demo ? "live" : "private");
  const category = project.category ?? "case-study";
  const features = project.features?.length
    ? project.features
    : ["Alur utama aplikasi", "Integrasi sesuai kebutuhan project", "Bukti implementasi yang dapat ditinjau"];

  return (
    <>
      <Navbar settings={settings} />
      <main className="portfolio-main px-6 pb-24 pt-32">
        <article className="mx-auto max-w-5xl">
          <Link href="/projects" className="text-sm text-cyan-400 transition-colors hover:text-cyan-300">
            &larr; Kembali ke project lab
          </Link>

          <header className="mt-8 border-b border-[#334155] pb-10">
            <div className="mb-6 flex flex-wrap gap-2 text-sm">
              <span className={`rounded-full border px-3 py-1 ${statusClass(status)}`}>
                {PROJECT_STATUS_LABELS[status]}
              </span>
              <span className="rounded-full border border-[#334155] px-3 py-1 text-slate-400">
                {PROJECT_CATEGORY_LABELS[category]}
              </span>
            </div>
            <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-cyan-400">CASE STUDY</p>
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white md:text-6xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{project.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-cyan-400 px-4 py-2.5 font-semibold text-[#071016] transition-colors hover:bg-cyan-300"
                >
                  Buka demo
                </a>
              )}
              {project.video && (
                <a
                  href={project.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-cyan-400/60 px-4 py-2.5 font-semibold text-cyan-300 transition-colors hover:bg-cyan-400/10"
                >
                  Tonton demo
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-[#475569] px-4 py-2.5 font-semibold text-slate-300 transition-colors hover:border-cyan-400 hover:text-cyan-300"
                >
                  Lihat source
                </a>
              )}
            </div>
          </header>

          <div className="grid gap-12 py-10 md:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-12">
              <section aria-labelledby="project-problem">
                <p className="mb-3 text-sm font-semibold tracking-[0.16em] text-cyan-400">KONTEKS</p>
                <h2 id="project-problem" className="text-2xl font-semibold text-white">
                  Masalah yang diselesaikan
                </h2>
                <p className="mt-4 leading-8 text-slate-300">{project.problem ?? project.description}</p>
              </section>

              <section aria-labelledby="project-features">
                <p className="mb-3 text-sm font-semibold tracking-[0.16em] text-cyan-400">IMPLEMENTASI</p>
                <h2 id="project-features" className="text-2xl font-semibold text-white">
                  Fitur yang dapat ditinjau
                </h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {features.map((feature) => (
                    <li key={feature} className="rounded-xl border border-[#334155] bg-[#111827]/70 p-4 leading-6 text-slate-300">
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>

              {project.screenshots && project.screenshots.length > 0 && (
                <section aria-labelledby="project-evidence">
                  <p className="mb-3 text-sm font-semibold tracking-[0.16em] text-cyan-400">BUKTI VISUAL</p>
                  <h2 id="project-evidence" className="text-2xl font-semibold text-white">
                    Screenshot dan dokumentasi
                  </h2>
                  <div className="mt-5 grid gap-5">
                    {project.screenshots.map((screenshot, index) => (
                      <figure
                        key={screenshot}
                        className="overflow-hidden rounded-2xl border border-[#334155] bg-[#0f172a]"
                      >
                        <a
                          href={screenshot}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Buka screenshot ${index + 1} ${project.title} ukuran penuh`}
                          className="block"
                        >
                          <div className="relative aspect-[16/10]">
                            <Image
                              src={screenshot}
                              alt={`Screenshot ${index + 1} ${project.title}`}
                              fill
                              sizes="(max-width: 768px) 100vw, 760px"
                              className="object-contain"
                            />
                          </div>
                        </a>
                        <figcaption className="border-t border-[#334155] px-4 py-3 text-sm text-slate-400">
                          Bukti visual {index + 1} · klik untuk membuka ukuran penuh
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              )}

              <section aria-labelledby="project-limitations">
                <p className="mb-3 text-sm font-semibold tracking-[0.16em] text-cyan-400">BATAS AKSES</p>
                <h2 id="project-limitations" className="text-2xl font-semibold text-white">
                  Yang perlu diketahui
                </h2>
                <p className="mt-4 leading-8 text-slate-400">
                  {project.limitations ?? "Detail deployment dan akses project mengikuti status yang tertera di atas."}
                </p>
              </section>
            </div>

            <aside className="h-fit rounded-2xl border border-[#334155] bg-[#111827]/80 p-6 md:sticky md:top-28">
              <h2 className="text-sm font-semibold tracking-[0.16em] text-cyan-400">RINGKASAN</h2>
              <dl className="mt-6 space-y-6 text-sm">
                <div>
                  <dt className="text-slate-500">Peran</dt>
                  <dd className="mt-2 leading-6 text-slate-200">{project.role ?? "Developer"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Teknologi</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="rounded-md bg-[#0a0a0f] px-2.5 py-1 text-xs text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </article>
      </main>
      <Footer profile={profile} />
    </>
  );
}
