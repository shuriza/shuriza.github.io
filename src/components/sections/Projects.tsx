import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import type { Project } from "@/lib/projects";

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group h-full overflow-hidden rounded-xl border border-[#334155] bg-[#1e293b]/50 motion-safe:transition-colors motion-safe:hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]">
      <div
        aria-hidden="true"
        className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 motion-safe:transition-opacity group-hover:opacity-100"
      />

      <div className="p-6">
        {project.featured && (
          <span className="mb-4 inline-block rounded-full border border-cyan-500/30 px-3 py-1 text-xs text-cyan-400">
            Featured Project
          </span>
        )}

        <h3 className="mb-3 text-xl font-semibold text-white transition-colors group-hover:text-cyan-400">
          {project.title}
        </h3>
        <p className="mb-5 leading-relaxed text-slate-400">{project.description}</p>

        <ul aria-label={`Teknologi ${project.title}`} className="mb-6 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <li
              key={tech}
              className="break-words rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-xs text-cyan-300/80"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Lihat kode ${project.title} di GitHub (buka di tab baru)`}
              className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-400"
            >
              <FaGithub aria-hidden="true" size={16} />
              <span>Code</span>
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Lihat demo ${project.title} (buka di tab baru)`}
              className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-400"
            >
              <FaExternalLinkAlt aria-hidden="true" size={14} />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="relative px-6 py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Projects</h2>
          <p className="mx-auto max-w-lg text-slate-400">Some of the projects I&apos;ve built and contributed to</p>
        </div>

        <ul className="grid gap-6 md:grid-cols-2">
          {projects.length > 0 ? (
            projects.map((project) => (
              <li key={project.id} className={project.featured ? "md:col-span-2" : ""}>
                <ProjectCard project={project} />
              </li>
            ))
          ) : (
            <li className="text-center text-slate-400 md:col-span-2">Project sedang diperbarui. Silakan kembali lagi nanti.</li>
          )}
        </ul>
      </div>
    </section>
  );
}
