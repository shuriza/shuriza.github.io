"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import type { Profile } from "@/lib/profile";

const ParticleField = dynamic(() => import("@/components/3d/ParticleField"), {
  ssr: false,
});

function TypewriterText({ roles }: { roles: string[] }) {
  const [currentRole, setCurrentRole] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const text = roles[currentRole];
    const timeout = isDeleting ? 30 : 80;

    if (!isDeleting && currentChar === text.length) {
      const pauseTimer = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(pauseTimer);
    }

    if (isDeleting && currentChar === 0) {
      const nextTimer = setTimeout(() => {
        setIsDeleting(false);
        setCurrentRole((prev) => (prev + 1) % roles.length);
      }, 100);
      return () => clearTimeout(nextTimer);
    }

    const timer = setTimeout(() => {
      setCurrentChar((prev) => prev + (isDeleting ? -1 : 1));
    }, timeout);

    return () => clearTimeout(timer);
  }, [currentChar, isDeleting, currentRole, roles]);

  return (
    <span className="text-cyan-400">
      {roles[currentRole].substring(0, currentChar)}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default function Hero({
  profile,
  showParticles = true,
}: {
  profile: Profile;
  showParticles?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background */}
      {showParticles && !prefersReducedMotion && <ParticleField />}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-transparent to-[#0a0a0f] z-[1]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm md:text-base text-slate-400 mb-4 tracking-[0.2em] uppercase"
        >
          {profile.display_name} / {profile.short_name}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-5xl md:text-7xl font-bold text-white mb-4"
        >
          {profile.short_name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg md:text-xl text-slate-300 mb-4"
        >
          {profile.role}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="max-w-xl mx-auto text-base md:text-lg leading-relaxed text-slate-400 mb-6"
        >
          {profile.hero_description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-base md:text-lg h-8 mb-10"
        >
          <TypewriterText roles={profile.hero_roles} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-[#0a0a0f] font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
          >
            Lihat Projects
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="px-8 py-3 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-all duration-300"
          >
            Hubungi Saya
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-slate-500 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
