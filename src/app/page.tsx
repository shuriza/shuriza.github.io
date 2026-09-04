import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import { getPublishedProjects } from "@/lib/projects";
import { getPublishedSkills } from "@/lib/skills-server";
import { getProfile } from "@/lib/profile";
import { getSiteSettings } from "@/lib/settings-server";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const title = `${profile.display_name} | ${profile.role}`;

  return {
    title,
    description: profile.hero_description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description: profile.hero_description,
      url: "/",
      type: "website",
      siteName: "Shuriza",
      locale: "id_ID",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: profile.hero_description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function Home() {
  const [projects, skills, profile, settings] = await Promise.all([
    getPublishedProjects(),
    getPublishedSkills(),
    getProfile(),
    getSiteSettings(),
  ]);

  return (
    <>
      <a
        href="#main-content"
        className="skip-link fixed left-4 top-4 z-[100] rounded-md bg-cyan-400 px-4 py-2 font-semibold text-[#0a0a0f]"
      >
        Lewati ke konten utama
      </a>
      <Navbar settings={settings} />
      <main id="main-content" tabIndex={-1} className="portfolio-main">
        <Hero
          profile={profile}
          showParticles={settings.particles_enabled}
          projectsEnabled={settings.projects_enabled}
        />
        {settings.about_enabled && <About profile={profile} />}
        {settings.skills_enabled && <Skills skills={skills} />}
        {settings.projects_enabled && <Projects projects={projects} />}
        {settings.contact_enabled && (
          <Contact profile={profile} showCvLink={settings.cv_enabled} />
        )}
      </main>
      <Footer profile={profile} />
    </>
  );
}
