import { FaEnvelope, FaFileAlt, FaGithub } from "react-icons/fa";
import type { Profile } from "@/lib/profile";

export default function Contact({
  profile,
  showCvLink = true,
}: {
  profile: Profile;
  showCvLink?: boolean;
}) {
  return (
    <section id="contact" className="relative px-6 py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent"
      />

      <div className="relative mx-auto min-w-0 max-w-4xl rounded-2xl border border-cyan-500/25 bg-[#0f172a]/80 px-6 py-10 text-center sm:px-12">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-cyan-400">Let&apos;s build something useful</p>
        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Punya ide atau peluang kolaborasi?</h2>
        <p className="mx-auto mb-8 max-w-2xl leading-relaxed text-slate-400">
          Saya terbuka untuk proyek freelance, kontrak, dan peluang full-time. Ceritakan kebutuhanmu, lalu kita
          cari solusi yang paling tepat.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-3 font-semibold text-[#0a0a0f] transition-colors hover:bg-cyan-400 sm:w-auto"
          >
            <FaEnvelope aria-hidden="true" size={15} />
            Kirim Email
          </a>
          {showCvLink && (
            <a
              href="/cv"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cyan-500/40 px-6 py-3 text-cyan-300 transition-colors hover:bg-cyan-500/10 sm:w-auto"
            >
              <FaFileAlt aria-hidden="true" size={15} />
              Lihat CV
            </a>
          )}
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buka profil GitHub Shuriza di tab baru"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-700 px-6 py-3 text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-cyan-300 sm:w-auto"
          >
            <FaGithub aria-hidden="true" size={15} />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
