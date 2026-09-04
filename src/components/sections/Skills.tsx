import { SKILL_ICON_OPTIONS, type Skill } from "@/lib/skills";

const categoryOrder = ["Frontend", "Backend", "Tools"] as const;

export default function Skills({ skills }: { skills: Skill[] }) {
  const skillCategories = categoryOrder
    .map((title) => ({ title, skills: skills.filter((skill) => skill.category === title) }))
    .filter((category) => category.skills.length > 0);

  return (
    <section id="skills" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Skills &amp; Tech Stack</h2>
          <p className="mx-auto max-w-lg text-slate-400">Technologies and tools I use to bring ideas to life</p>
        </div>

        {skillCategories.length > 0 ? (
          <ul className="grid gap-8 md:grid-cols-3">
            {skillCategories.map((category) => (
              <li
                key={category.title}
                className="rounded-xl border border-[#334155] bg-[#1e293b]/50 p-6 motion-safe:transition-colors motion-safe:hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]"
              >
                <h3 className="mb-6 text-lg font-semibold text-cyan-400">{category.title}</h3>
                <ul className="grid grid-cols-2 gap-4">
                  {category.skills.map((skill) => {
                    const Icon = SKILL_ICON_OPTIONS[skill.icon] ?? SKILL_ICON_OPTIONS.TbApi;

                    return (
                      <li key={skill.name} className="flex min-w-0 items-center gap-3">
                        <Icon aria-hidden="true" size={20} style={{ color: skill.color }} className="shrink-0" />
                        <span className="break-words text-sm text-slate-300">{skill.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-slate-400">Skill sedang diperbarui. Silakan kembali lagi nanti.</p>
        )}
      </div>
    </section>
  );
}
