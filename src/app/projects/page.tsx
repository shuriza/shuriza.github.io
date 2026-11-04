import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Projects from "@/components/sections/Projects";
import { getPublishedProjects } from "@/lib/projects";
import { getProfile } from "@/lib/profile";
import { getSiteSettings } from "@/lib/settings-server";

export const metadata: Metadata = {
  title: "Project Lab",
  description: "Katalog project Shuriza dengan live demo, source code, hosted demo, dan case study.",
};

export default async function ProjectsPage() {
  const [projects, profile, settings] = await Promise.all([getPublishedProjects(), getProfile(), getSiteSettings()]);
  return <><Navbar settings={settings} /><main className="portfolio-main pt-16"><Projects projects={projects} /></main><Footer profile={profile} /></>;
}
