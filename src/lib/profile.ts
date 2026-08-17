import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface Profile {
  id: number;
  display_name: string;
  short_name: string;
  role: string;
  bio_primary: string;
  bio_secondary: string;
  location: string;
  focus: string;
  education: string;
  status: string;
  email: string;
  github: string;
  linkedin: string;
  website: string;
  hero_roles: string[];
  hero_description: string;
}

export const fallbackProfile: Profile = {
  id: 1,
  display_name: "M. Firdaus Suryaningrat",
  short_name: "Shuriza",
  role: "Fullstack Web Developer",
  bio_primary:
    "Halo! Saya Shuriza, seorang fullstack web developer dari Kediri, Jawa Timur. Saya passionate dalam membangun aplikasi web modern yang clean, performant, dan user-friendly.",
  bio_secondary:
    "Dengan pengalaman di React, Next.js, Laravel, dan berbagai teknologi web modern, saya selalu berusaha menciptakan solusi digital yang memberikan dampak nyata.",
  location: "Kediri, Jawa Timur",
  focus: "Fullstack Web",
  education: "Informatics Eng.",
  status: "Open to work",
  email: "firdausmfirdaus657@gmail.com",
  github: "https://github.com/shuriza",
  linkedin: "https://linkedin.com/in/shuriza",
  website: "https://shuriza.me",
  hero_roles: [
    "I build modern web apps",
    "I craft clean & scalable code",
    "I turn ideas into reality",
    "I love React & Laravel",
  ],
  hero_description:
    "Saya membangun aplikasi web yang rapi, cepat, dan siap dipakai menggunakan React, Next.js, dan Laravel.",
};

export async function getProfile(): Promise<Profile> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return fallbackProfile;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("profile").select("*").eq("id", 1).maybeSingle();

  if (error || !data) {
    if (error) console.error("Failed to load profile:", error.message);
    return fallbackProfile;
  }

  return { ...fallbackProfile, ...data } as Profile;
}
