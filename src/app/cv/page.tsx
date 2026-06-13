"use client";

import Link from "next/link";
import {
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlinePrinter,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import { FaGithub, FaGlobe } from "react-icons/fa";

const skillCategories = [
  {
    title: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"],
  },
  {
    title: "Backend",
    skills: ["Laravel", "PHP", "Node.js", "MySQL", "SQLite", "REST API"],
  },
  {
    title: "Tools",
    skills: ["Git", "Docker", "Vercel", "VS Code"],
  },
];

const projects = [
  {
    title: "Shuriza Store",
    description:
      "E-commerce platform dengan product catalog, shopping cart, dan order management system.",
    tech: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    github: "https://github.com/shuriza/shuriza-store",
    demo: "https://shurizastore.my.id/",
  },
];

const softSkills = [
  "Self-learning",
  "Problem Solving",
  "Team Collaboration",
  "Time Management",
];

const languages = [
  { name: "Bahasa Indonesia", level: "Native" },
  { name: "English", level: "Basic" },
];

function handlePrint() {
  if (typeof window !== "undefined") window.print();
}

export default function CVPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] py-10 px-4 sm:px-6 cv-root">
      {/* Top action bar — hidden on print */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between no-print">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <HiOutlineArrowLeft size={18} />
          <span>Back to Portfolio</span>
        </Link>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-[#0a0a0f] font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
        >
          <HiOutlinePrinter size={18} />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* CV Document */}
      <article className="cv-document max-w-4xl mx-auto bg-[#0f172a] border border-[#334155] rounded-2xl p-8 sm:p-12 shadow-2xl">
        {/* Header */}
        <header className="cv-header flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-[#334155]">
          <div className="cv-avatar shrink-0 w-20 h-20 rounded-full bg-cyan-500 flex items-center justify-center text-2xl font-bold text-[#0a0a0f]">
            MF
          </div>
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
              M. Firdaus Suryaningrat
            </h1>
            <p className="text-cyan-400 text-base sm:text-lg mb-3">
              Aspiring Fullstack Web Developer
            </p>
            <div className="cv-contact flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
              <a
                href="mailto:firdausmfirdaus657@gmail.com"
                className="inline-flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
              >
                <HiOutlineMail size={15} />
                <span>firdausmfirdaus657@gmail.com</span>
              </a>
              <span className="inline-flex items-center gap-1.5">
                <HiOutlineLocationMarker size={15} />
                <span>Kediri, Jawa Timur</span>
              </span>
              <a
                href="https://github.com/shuriza"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
              >
                <FaGithub size={14} />
                <span>github.com/shuriza</span>
              </a>
              <a
                href="https://shuriza.me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
              >
                <FaGlobe size={14} />
                <span>shuriza.me</span>
              </a>
            </div>
          </div>
        </header>

        {/* Profile */}
        <Section title="Profile">
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            Mahasiswa D3 Manajemen Informatika dengan ketertarikan pada
            pengembangan web modern. Berfokus pada ekosistem React/Next.js untuk
            frontend dan Laravel untuk backend. Aktif membangun project pribadi
            untuk mengasah skill, salah satunya e-commerce Shuriza Store.
            Terbuka untuk peluang magang, freelance, atau kolaborasi.
          </p>
        </Section>

        {/* Education */}
        <Section title="Education">
          <div className="text-slate-300">
            <p className="font-semibold text-white">D3 Manajemen Informatika</p>
          </div>
        </Section>

        {/* Skills */}
        <Section title="Technical Skills">
          <div className="space-y-4">
            {skillCategories.map((cat) => (
              <div key={cat.title}>
                <p className="text-sm font-semibold text-cyan-400 mb-2">
                  {cat.title}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="cv-badge text-xs px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Projects */}
        <Section title="Projects">
          <div className="space-y-5">
            {projects.map((p) => (
              <div key={p.title}>
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h3 className="text-base font-semibold text-white">
                    {p.title}
                  </h3>
                  <div className="cv-links flex flex-wrap gap-x-3 text-xs text-cyan-400">
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        GitHub
                      </a>
                    )}
                    {p.demo && (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  {p.description}
                </p>
                <p className="text-xs text-slate-400 mt-1.5">
                  <span className="text-cyan-400">Tech:</span> {p.tech.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Soft Skills + Languages — two columns on desktop */}
        <div className="grid sm:grid-cols-2 gap-8 mt-8">
          <SubSection title="Soft Skills">
            <ul className="text-sm text-slate-300 space-y-1.5">
              {softSkills.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </SubSection>

          <SubSection title="Languages">
            <ul className="text-sm text-slate-300 space-y-1.5">
              {languages.map((l) => (
                <li key={l.name} className="flex items-center justify-between">
                  <span>{l.name}</span>
                  <span className="text-xs text-slate-400">{l.level}</span>
                </li>
              ))}
            </ul>
          </SubSection>
        </div>
      </article>

      <p className="no-print text-center text-xs text-slate-500 mt-6 max-w-4xl mx-auto">
        Tip: gunakan tombol Print di atas, lalu pilih &quot;Save as PDF&quot;
        sebagai destination.
      </p>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cv-section mt-8">
      <h2 className="cv-section-title flex items-center gap-3 text-lg font-bold text-white mb-4">
        <span className="w-1 h-5 bg-cyan-400 rounded-full" />
        {title}
      </h2>
      <div className="pl-4">{children}</div>
    </section>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="cv-section-title text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}
