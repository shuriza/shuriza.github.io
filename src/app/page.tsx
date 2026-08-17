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

export default async function Home() {
  const [projects, skills, profile] = await Promise.all([
    getPublishedProjects(),
    getPublishedSkills(),
    getProfile(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
