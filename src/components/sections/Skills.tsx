"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SKILL_ICON_OPTIONS, type Skill } from "@/lib/skills";

const categoryOrder = ["Frontend", "Backend", "Tools"] as const;

export default function Skills({ skills }: { skills: Skill[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const skillCategories = categoryOrder
    .map((title) => ({
      title,
      skills: skills.filter((skill) => skill.category === title),
    }))
    .filter((category) => category.skills.length > 0);

  return (
    <section id="skills" className="py-24 px-6 relative">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Skills & Tech Stack
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: catIndex * 0.15 }}
              className="group bg-[#1e293b]/50 border border-[#334155] rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]"
            >
              <h3 className="text-lg font-semibold text-cyan-400 mb-6">
                {category.title}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.3,
                      delay: catIndex * 0.15 + skillIndex * 0.08,
                    }}
                    className="flex items-center gap-3 group/skill"
                  >
                    {(() => {
                      const Icon = SKILL_ICON_OPTIONS[skill.icon] ?? SKILL_ICON_OPTIONS.TbApi;
                      return <Icon
                      size={20}
                      style={{ color: skill.color }}
                      className="shrink-0 group-hover/skill:scale-110 transition-transform"
                      />;
                    })()}
                    <span className="text-sm text-slate-300 group-hover/skill:text-white transition-colors">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
