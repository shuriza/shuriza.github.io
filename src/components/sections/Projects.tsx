"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { ARCHIVED_REPOSITORIES } from "@/lib/project-catalog";
import {
  PROJECT_CATEGORY_LABELS,
  PROJECT_STATUS_LABELS,
  type Project,
  type ProjectCategory,
  type ProjectStatus,
} from "@/lib/project-model";

type ProjectFilter = "all" | ProjectCategory | ProjectStatus;

const filters: Array<{ value: ProjectFilter; label: string }> = [
  { value: "all", label: "Semua" },
  { value: "live", label: "Live" },
  { value: "hosted", label: "Hosted" },
  { value: "case-study", label: "Case study" },
  { value: "private", label: "Private" },
  { value: "laravel", label: "Laravel" },
  { value: "web", label: "Web" },
  { value: "mobile-desktop", label: "Mobile / desktop" },
  { value: "ai-automation", label: "AI & automation" },
];

function statusTone(status: ProjectStatus) {
  if (status === "live") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
  if (status === "hosted") return "border-amber-400/30 bg-amber-400/10 text-amber-300";
  if (status === "private") return "border-violet-400/30 bg-violet-400/10 text-violet-300";
  return "border-cyan-400/30 bg-cyan-400/10 text-cyan-300";
}

function ProjectCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  const status = project.status ?? (project.demo ? "live" : "private");
  const category = project.category ?? "case-study";
  const slug = project.slug ?? project.id;
  const features = project.features?.slice(0, compact ? 2 : 3) ?? [];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#334155] bg-[#111827]/80 transition-colors hover:border-cyan-400/50">
      <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 opacity-70" aria-hidden="true" />
      <div className="flex h-full flex-col p-6 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-full border px-3 py-1 font-medium ${statusTone(status)}`}>
            {PROJECT_STATUS_LABELS[status]}
          </span>
          <span className="rounded-full border border-[#334155] px-3 py-1 text-slate-400">
            {PROJECT_CATEGORY_LABELS[category]}
          </span>
          {project.featured && <span className="text-amber-300">Pilihan</span>}
        </div>

        <h3 className="text-2xl font-semibold tracking-tight text-white transition-colors group-hover:text-cyan-300">
          {project.title}
        </h3>
        <p className="mt-3 leading-7 text-slate-300">{project.description}</p>

        {project.problem && (
          <div className="mt-5 border-l-2 border-cyan-400/60 pl-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">Yang dibuktikan</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{project.problem}</p>
          </div>
        )}

        {features.length > 0 && (
          <ul className="mt-5 space-y-2 text-sm text-slate-400">
            {features.map((feature) => (
              <li key={feature} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-400" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <ul aria-label={`Teknologi ${project.title}`} className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <li key={tech} className="rounded-md bg-[#0a0a0f] px-2.5 py-1 text-xs text-slate-300">
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 pt-7">
          <Link
            href={`/projects/${slug}`}
            className="rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-[#071016] transition-colors hover:bg-cyan-300"
          >
            Lihat case study
          </Link>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Buka demo ${project.title}`}
              className="inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-cyan-300"
            >
              <FaExternalLinkAlt aria-hidden="true" size={13} />
              Demo
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Buka source ${project.title} di GitHub`}
              className="inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-cyan-300"
            >
              <FaGithub aria-hidden="true" size={16} />
              Source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Projects({ projects, compact = false }: { projects: Project[]; compact?: boolean }) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("all");
  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          activeFilter === "all" || project.category === activeFilter || project.status === activeFilter,
      ),
    [activeFilter, projects],
  );
  const visibleProjects = compact ? filteredProjects.slice(0, 6) : filteredProjects;
  const liveCount = projects.filter((project) => project.status === "live").length;
  const caseStudyCount = projects.filter((project) => project.status === "case-study").length;
  const availableFilters = filters.filter(
    (filter) =>
      filter.value === "all" ||
      projects.some((project) => project.category === filter.value || project.status === filter.value),
  );

  return (
    <section id="projects" className="relative overflow-hidden px-6 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(34,211,238,0.08),transparent_32%),radial-gradient(circle_at_90%_80%,rgba(129,140,248,0.08),transparent_30%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-6 border-b border-[#334155] pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-cyan-400">PROJECT LAB</p>
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              Bukan cuma daftar link.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
              Setiap project punya bentuk bukti yang berbeda: live demo, source code,
              screenshot, atau case study yang menjelaskan batas aksesnya.
            </p>
          </div>
          {compact && (
            <Link
              href="/projects"
              className="shrink-0 rounded-lg border border-cyan-400/50 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition-colors hover:bg-cyan-400/10"
            >
              Buka semua project
            </Link>
          )}
        </header>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[#334155] bg-[#0f172a]/70 p-4">
            <p className="text-2xl font-bold text-white">{projects.length}</p>
            <p className="mt-1 text-sm text-slate-400">project terkurasi</p>
          </div>
          <div className="rounded-xl border border-[#334155] bg-[#0f172a]/70 p-4">
            <p className="text-2xl font-bold text-emerald-300">{liveCount}</p>
            <p className="mt-1 text-sm text-slate-400">demo yang dapat dibuka</p>
          </div>
          <div className="rounded-xl border border-[#334155] bg-[#0f172a]/70 p-4">
            <p className="text-2xl font-bold text-cyan-300">{caseStudyCount}</p>
            <p className="mt-1 text-sm text-slate-400">case study dengan batas jelas</p>
          </div>
        </div>

        {!compact && (
          <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter project">
            {availableFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                aria-pressed={activeFilter === filter.value}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  activeFilter === filter.value
                    ? "border-cyan-400 bg-cyan-400 text-[#071016]"
                    : "border-[#334155] text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        <ul className="grid gap-6 lg:grid-cols-2">
          {visibleProjects.length > 0 ? (
            visibleProjects.map((project) => (
              <li key={project.id} className={project.featured && !compact ? "lg:col-span-2" : undefined}>
                <ProjectCard project={project} compact={compact} />
              </li>
            ))
          ) : (
            <li className="rounded-xl border border-dashed border-[#334155] p-8 text-slate-400 lg:col-span-2">
              Belum ada project dalam kategori ini.
            </li>
          )}
        </ul>

        {!compact && (
          <details className="mt-12 rounded-2xl border border-[#334155] bg-[#0f172a]/60 p-6">
            <summary className="cursor-pointer text-lg font-semibold text-white">
              Repositori dan eksperimen lain
            </summary>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Project kecil dan repository lama tetap dicantumkan agar jejak belajar
              dapat ditinjau tanpa mengganggu case study utama.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {ARCHIVED_REPOSITORIES.map((repository) => (
                <li key={repository.url} className="rounded-xl border border-[#334155] p-4">
                  <a
                    href={repository.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-cyan-300 hover:text-cyan-200"
                  >
                    {repository.title}
                  </a>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{repository.description}</p>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </section>
  );
}
