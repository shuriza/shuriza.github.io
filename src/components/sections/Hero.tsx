import HeroParticles from "@/components/3d/HeroParticles";
import type { Profile } from "@/lib/profile";

export default function Hero({
  profile,
  showParticles = true,
  projectsEnabled = true,
}: {
  profile: Profile;
  showParticles?: boolean;
  projectsEnabled?: boolean;
}) {
  const heroRole = profile.hero_roles.find((role) => role.trim()) ?? profile.role;

  return (
    <section id="hero" className="relative flex min-h-svh items-center justify-center overflow-hidden px-6 py-24">
      <HeroParticles enabled={showParticles} />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0a0a0f] via-transparent to-[#0a0a0f]"
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-400 md:text-base">
          {profile.display_name} / {profile.short_name}
        </p>
        <h1 className="mb-4 break-words text-5xl font-bold text-white md:text-7xl">{profile.short_name}</h1>
        <p className="mb-4 text-lg text-slate-300 md:text-xl">{profile.role}</p>
        <p className="mx-auto mb-6 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg">
          {profile.hero_description}
        </p>
        <p className="mb-10 min-h-8 break-words text-base text-cyan-400 md:text-lg">{heroRole}</p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {projectsEnabled && (
            <a
              href="#projects"
              className="rounded-full bg-cyan-500 px-8 py-3 font-semibold text-[#0a0a0f] transition-colors hover:bg-cyan-400"
            >
              Lihat Projects
            </a>
          )}
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full border border-cyan-500/50 px-8 py-3 text-cyan-400 transition-colors hover:bg-cyan-500/10"
          >
            Hubungi Saya
          </a>
        </div>
      </div>
    </section>
  );
}
