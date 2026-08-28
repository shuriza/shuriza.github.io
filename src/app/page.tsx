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

export default async function Home() {
  const [projects, skills, profile, settings] = await Promise.all([
    getPublishedProjects(),
    getPublishedSkills(),
    getProfile(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Navbar settings={settings} />
      <main>
        <Hero profile={profile} showParticles={settings.particles_enabled} />
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
