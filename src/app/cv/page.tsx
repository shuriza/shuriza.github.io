import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlineArrowLeft,
  HiOutlinePhone,
} from "react-icons/hi";
import { FaGithub, FaGlobe, FaLinkedin } from "react-icons/fa";
import PrintButton from "./PrintButton";
import { getProfile, type Profile } from "@/lib/profile";
import { getPublishedProjects } from "@/lib/projects";
import { getPublishedSkills } from "@/lib/skills-server";
import { getSiteSettings } from "@/lib/settings-server";
import { certifications } from "@/lib/certificates";

const PHONE_NUMBER = "0817-7509-3906";

export async function generateMetadata(): Promise<Metadata> {
  const [profile, settings] = await Promise.all([getProfile(), getSiteSettings()]);
  const title = `CV | ${profile.display_name}`;
  const description = `Curriculum vitae ${profile.display_name} — ${profile.cv_headline}. Skill, project, dan kontak dalam satu halaman yang siap dicetak.`;

  return {
    title,
    description,
    alternates: { canonical: "/cv" },
    robots: settings.cv_enabled ? undefined : { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: "/cv",
      type: "profile",
      siteName: "Shuriza",
      locale: "id_ID",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

/** "M. Firdaus Suryaningrat" -> "MF" */
function initialsOf(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase();

  return initials || "CV";
}

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

export default async function CVPage() {
  const settings = await getSiteSettings();
  if (!settings.cv_enabled) notFound();

  const [profile, projects, skills] = await Promise.all([
    getProfile(),
    getPublishedProjects(),
    getPublishedSkills(),
  ]);

  const skillGroups = ["Backend", "Frontend", "Tools"].map((category) => ({
    title: category,
    items: skills.filter((skill) => skill.category === category),
  })).filter((group) => group.items.length > 0);
  const cvProjects = projects
    .filter(
      (project) =>
        project.title === "Shuriza Store" ||
        project.tech.some((technology) => technology.startsWith("Laravel")),
    )
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#0a0a0f] py-10 px-4 sm:px-6 cv-root">
      {/* Top action bar — hidden on print */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 no-print">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <HiOutlineArrowLeft size={18} />
          <span>Back to Portfolio</span>
        </Link>
        <div className="shrink-0">
          <PrintButton />
        </div>
      </div>

      {/* CV Document */}
      <article className="cv-document max-w-4xl mx-auto bg-[#0f172a] border border-[#334155] rounded-2xl p-8 sm:p-12 shadow-2xl">
        <CvHeader profile={profile} />

        <Section title="Profil Profesional">
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            {profile.cv_summary}
          </p>
        </Section>

        <Section title="Pengalaman">
          <div className="cv-item">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="text-base font-semibold text-white">
                Mahasiswa Magang - Pengembangan Aplikasi Web
              </h3>
              <span className="text-xs text-slate-400">Juni 2025 - Agustus 2025</span>
            </div>
            <p className="mt-1 text-sm font-medium text-cyan-400">
              DPMPTSP Kota Kediri · Kota Kediri, Jawa Timur
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-300">
              <li>
                Mengembangkan sistem rekap absensi internal berbasis Laravel 12 dan MySQL
                untuk membantu pengolahan data kehadiran pegawai.
              </li>
              <li>
                Mengimplementasikan impor dan validasi Excel, izin presensi, dashboard
                analitik, serta laporan bulanan dan tahunan dalam format Excel dan PDF.
              </li>
            </ul>
          </div>
        </Section>

        <Section title="Pendidikan">
          <div className="space-y-5">
            <div className="cv-item">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="text-base font-semibold text-white">
                  D3 Manajemen Informatika
                </h3>
                <span className="text-xs text-slate-400">2023 - 2026 · IPK 3,63</span>
              </div>
              <p className="mt-1 text-sm text-cyan-400">Politeknik Negeri Malang</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Fokus pada pengembangan perangkat lunak, basis data, analisis sistem,
                dan manajemen proyek.
              </p>
            </div>
            <div className="cv-item">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="text-base font-semibold text-white">
                  Rekayasa Perangkat Lunak (RPL)
                </h3>
                <span className="text-xs text-slate-400">2020 - 2023</span>
              </div>
              <p className="mt-1 text-sm text-cyan-400">SMKN 1 Kertosono</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Mempelajari dasar pemrograman dan pengembangan perangkat lunak dengan Java.
              </p>
            </div>
          </div>
        </Section>

        {skillGroups.length > 0 && (
          <Section title="Keahlian Teknis">
            <div className="space-y-2">
              {skillGroups.map((group) => (
                <div key={group.title} className="cv-item">
                  <p className="mb-1 text-sm font-semibold text-cyan-400">{group.title}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill.id}
                        className="cv-badge text-xs px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-200"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {cvProjects.length > 0 && (
          <Section title="Project Laravel Pilihan">
            <div className="space-y-5">
              {cvProjects.map((project) => (
                <div key={project.id} className="cv-item">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h3 className="text-base font-semibold text-white">{project.title}</h3>
                    <div className="cv-links flex flex-wrap gap-x-3 text-xs text-cyan-400">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Buka repositori GitHub ${project.title} di tab baru`}
                          className="hover:underline"
                        >
                          GitHub
                        </a>
                      )}
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Buka demo ${project.title} di tab baru`}
                          className="hover:underline"
                        >
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="print-url" aria-hidden="true">
                    {project.github && <span>GitHub: {project.github}</span>}
                    {project.demo && <span>Demo: {project.demo}</span>}
                  </div>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    {project.description}
                  </p>
                  {project.tech.length > 0 && (
                    <p className="text-xs text-slate-400 mt-1.5">
                      <span className="text-cyan-400">Tech:</span> {project.tech.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section title="Sertifikasi">
          <div className="space-y-3">
            {certifications.filter((certification) => certification.showOnCv).map((certification) => (
              <div key={certification.name} className="cv-item">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="text-sm font-semibold text-white">{certification.name}</h3>
                  <span className="text-xs text-slate-400">{certification.date}</span>
                </div>
                <p className="mt-1 text-xs text-cyan-400">
                  {certification.issuer}
                  {certification.credential && " · Credential: " + certification.credential}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {(profile.soft_skills.length > 0 || profile.languages.length > 0) && (
          <div className="grid sm:grid-cols-2 gap-8 mt-8">
            {profile.soft_skills.length > 0 && (
              <SubSection title="Keterampilan Profesional">
                <ul className="text-sm text-slate-300 space-y-1.5">
                  {profile.soft_skills.map((skill) => (
                    <li key={skill} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </SubSection>
            )}

            {profile.languages.length > 0 && (
              <SubSection title="Bahasa">
                <ul className="text-sm text-slate-300 space-y-1.5">
                  {profile.languages.map((language) => (
                    <li key={language.name} className="flex items-center justify-between">
                      <span>{language.name}</span>
                      {language.level && (
                        <span className="text-xs text-slate-400">{language.level}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </SubSection>
            )}
          </div>
        )}
      </article>

      <p className="no-print text-center text-xs text-slate-400 mt-6 max-w-4xl mx-auto">
        Tip: gunakan tombol Print di atas, lalu pilih &quot;Save as PDF&quot; sebagai
        destination.
      </p>
    </main>
  );
}

function CvHeader({ profile }: { profile: Profile }) {
  return (
    <header className="cv-header flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-[#334155]">
      <div className="cv-avatar shrink-0 w-20 h-20 rounded-full bg-cyan-500 flex items-center justify-center text-2xl font-bold text-[#0a0a0f]">
        {initialsOf(profile.display_name)}
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
          {profile.display_name}
        </h1>
        <p className="text-cyan-400 text-base sm:text-lg mb-3">{profile.cv_headline}</p>
        <div className="cv-contact min-w-0 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex min-w-0 items-center gap-1.5 hover:text-cyan-400 transition-colors"
          >
            <HiOutlineMail size={15} />
            <span className="break-all">{profile.email}</span>
          </a>
          <span className="inline-flex items-center gap-1.5">
            <HiOutlineLocationMarker size={15} />
            <span>{profile.location}</span>
          </span>
          <a
            href="tel:+6281775093906"
            className="inline-flex min-w-0 items-center gap-1.5 hover:text-cyan-400 transition-colors"
          >
            <HiOutlinePhone size={15} />
            <span>{PHONE_NUMBER}</span>
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buka profil GitHub di tab baru"
            className="inline-flex min-w-0 items-center gap-1.5 hover:text-cyan-400 transition-colors"
          >
            <FaGithub size={14} />
            <span className="break-all">{stripProtocol(profile.github)}</span>
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buka profil LinkedIn di tab baru"
            className="inline-flex min-w-0 items-center gap-1.5 hover:text-cyan-400 transition-colors"
          >
            <FaLinkedin size={14} />
            <span>LinkedIn</span>
          </a>
          <a
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buka situs portfolio di tab baru"
            className="inline-flex min-w-0 items-center gap-1.5 hover:text-cyan-400 transition-colors"
          >
            <FaGlobe size={14} />
            <span className="break-all">{stripProtocol(profile.website)}</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="cv-section-title text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}
