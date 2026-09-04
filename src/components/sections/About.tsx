import type { Profile } from "@/lib/profile";

function ProfileTerminal({ profile }: { profile: Profile }) {
  const lines = [
    "const shuriza = {",
    `  role: "${profile.role}",`,
    `  location: "${profile.location}",`,
    '  passion: "Building modern web apps",',
    `  education: "${profile.education}",`,
    `  status: "${profile.status}",`,
    "};",
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-[#334155] bg-[#0d1117] shadow-2xl">
      <div className="flex items-center gap-2 border-b border-[#334155] bg-[#161b22] px-4 py-3">
        <div aria-hidden="true" className="size-3 rounded-full bg-red-500/80" />
        <div aria-hidden="true" className="size-3 rounded-full bg-yellow-500/80" />
        <div aria-hidden="true" className="size-3 rounded-full bg-green-500/80" />
        <span className="ml-3 font-mono text-xs text-slate-400">shuriza.ts</span>
      </div>
      <ol aria-label="Ringkasan profil dalam format kode" className="space-y-1 p-5 font-mono text-sm leading-relaxed">
        {lines.map((line, index) => (
          <li key={line} className="flex min-w-0 gap-4">
            <span aria-hidden="true" className="w-4 shrink-0 select-none text-right text-slate-500">
              {index + 1}
            </span>
            <code className="break-words text-slate-300">{line}</code>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function About({ profile }: { profile: Profile }) {
  const facts = [
    { label: "Location", value: profile.location },
    { label: "Focus", value: profile.focus },
    { label: "Education", value: profile.education },
    { label: "Status", value: profile.status },
  ];

  return (
    <section id="about" className="relative overflow-x-clip px-6 py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #22d3ee 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 flex items-center gap-3">
          <div aria-hidden="true" className="h-8 w-1 rounded-full bg-cyan-400" />
          <h2 className="text-3xl font-bold text-white md:text-4xl">About Me</h2>
        </div>

        <div className="grid min-w-0 items-center gap-12 md:grid-cols-2">
          <ProfileTerminal profile={profile} />
          <div className="min-w-0 space-y-6">
            <p className="text-lg leading-relaxed text-slate-300">{profile.bio_primary}</p>
            <p className="leading-relaxed text-slate-400">{profile.bio_secondary}</p>

            <dl className="grid grid-cols-2 gap-4 pt-4">
              {facts.map((fact) => (
                <div key={fact.label} className="min-w-0 space-y-1">
                  <dt className="text-xs uppercase tracking-wider text-cyan-400">{fact.label}</dt>
                  <dd className="break-words text-sm text-slate-300">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
