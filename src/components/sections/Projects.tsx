"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import type { Project } from "@/lib/projects";
import { useReveal } from "@/components/useReveal";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useReveal(ref);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative bg-[#1e293b]/50 border border-[#334155] rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] ${
        project.featured ? "md:col-span-2" : ""
      }`}
    >
      {/* Gradient top bar */}
      <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-6">
        {/* Featured badge */}
        {project.featured && (
          <span className="inline-block text-xs text-cyan-400 border border-cyan-500/30 rounded-full px-3 py-1 mb-4">
            Featured Project
          </span>
        )}

        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors">
          {project.title}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed mb-5">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="text-xs px-3 py-1 rounded-full border border-cyan-500/20 text-cyan-300/80 bg-cyan-500/5"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <FaGithub size={16} />
              <span>Code</span>
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <FaExternalLinkAlt size={14} />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useReveal(ref);

  return (
    <section id="projects" className="py-24 px-6 relative">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent" />

      <div ref={ref} className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Projects
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Some of the projects I&apos;ve built and contributed to
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))
          ) : (
            <p className="md:col-span-2 text-center text-slate-400">
              Project sedang diperbarui. Silakan kembali lagi nanti.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
