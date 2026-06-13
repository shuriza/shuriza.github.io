"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const terminalLines = [
  { text: "const shuriza = {", delay: 0 },
  { text: '  role: "Fullstack Web Developer",', delay: 0.5 },
  { text: '  location: "Kediri, Jawa Timur",', delay: 1.0 },
  { text: '  passion: "Building modern web apps",', delay: 1.5 },
  { text: '  education: "Informatics Engineering",', delay: 2.0 },
  { text: '  status: "Open to work"', delay: 2.5 },
  { text: "};", delay: 3.0 },
];

function AnimatedTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [currentChars, setCurrentChars] = useState<number[]>(
    new Array(terminalLines.length).fill(0)
  );
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const timers: NodeJS.Timeout[] = [];

    terminalLines.forEach((line, index) => {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => Math.max(prev, index + 1));

        // Type each character
        let charIndex = 0;
        const charTimer = setInterval(() => {
          charIndex++;
          setCurrentChars((prev) => {
            const newChars = [...prev];
            newChars[index] = charIndex;
            return newChars;
          });
          if (charIndex >= line.text.length) {
            clearInterval(charTimer);
          }
        }, 30);

        timers.push(charTimer as unknown as NodeJS.Timeout);
      }, line.delay * 1000);

      timers.push(timer);
    });

    return () => timers.forEach((t) => clearTimeout(t));
  }, [isInView]);

  return (
    <div ref={ref} className="bg-[#0d1117] rounded-lg border border-[#334155] overflow-hidden shadow-2xl">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-[#334155]">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-xs text-slate-500 font-mono">shuriza.ts</span>
      </div>

      {/* Terminal content */}
      <div className="p-5 font-mono text-sm leading-relaxed">
        {terminalLines.slice(0, visibleLines).map((line, index) => (
          <div key={index} className="flex">
            <span className="text-slate-600 mr-4 select-none w-4 text-right">
              {index + 1}
            </span>
            <span className="text-slate-300">
              {line.text.substring(0, currentChars[index])}
              {currentChars[index] < line.text.length &&
                index === visibleLines - 1 && (
                  <span className="animate-pulse text-cyan-400">|</span>
                )}
            </span>
          </div>
        ))}
        {visibleLines < terminalLines.length && (
          <div className="flex">
            <span className="text-slate-600 mr-4 select-none w-4 text-right">
              {visibleLines + 1}
            </span>
            <span className="animate-pulse text-cyan-400">|</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 px-6 relative">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #22d3ee 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div ref={ref} className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-12"
        >
          <div className="w-1 h-8 bg-cyan-400 rounded-full" />
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            About Me
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Terminal - Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <AnimatedTerminal />
          </motion.div>

          {/* Bio - Right */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="space-y-6"
          >
            <p className="text-slate-300 leading-relaxed text-lg">
              Halo! Saya Shuriza, seorang fullstack web developer dari Kediri,
              Jawa Timur. Saya passionate dalam membangun aplikasi web modern
              yang clean, performant, dan user-friendly.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Dengan pengalaman di React, Next.js, Laravel, dan berbagai
              teknologi web modern, saya selalu berusaha menciptakan solusi
              digital yang memberikan dampak nyata.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { label: "Location", value: "Kediri, Jawa Timur" },
                { label: "Focus", value: "Fullstack Web" },
                { label: "Education", value: "Informatics Eng." },
                { label: "Status", value: "Open to work" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="space-y-1"
                >
                  <p className="text-xs text-cyan-400 uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-sm text-slate-300">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
