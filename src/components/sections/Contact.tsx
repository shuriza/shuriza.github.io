"use client";

import { motion, useInView } from "framer-motion";
import { FaEnvelope, FaFileAlt, FaGithub } from "react-icons/fa";
import { useRef } from "react";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="px-6 py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative max-w-4xl mx-auto rounded-2xl border border-cyan-500/25 bg-[#0f172a]/80 px-6 py-10 text-center sm:px-12"
      >
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-cyan-400">
          Let&apos;s build something useful
        </p>
        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          Punya ide atau peluang kolaborasi?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl leading-relaxed text-slate-400">
          Saya terbuka untuk magang, freelance, dan kolaborasi pengembangan web.
          Ceritakan kebutuhanmu, lalu kita cari solusi yang paling tepat.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="mailto:firdausmfirdaus657@gmail.com"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-3 font-semibold text-[#0a0a0f] transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] sm:w-auto"
          >
            <FaEnvelope size={15} />
            Kirim Email
          </a>
          <a
            href="/cv"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cyan-500/40 px-6 py-3 text-cyan-300 transition-colors hover:bg-cyan-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] sm:w-auto"
          >
            <FaFileAlt size={15} />
            Lihat CV
          </a>
          <a
            href="https://github.com/shuriza"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-700 px-6 py-3 text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] sm:w-auto"
          >
            <FaGithub size={15} />
            GitHub
          </a>
        </div>
      </motion.div>
    </section>
  );
}
