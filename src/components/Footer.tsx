"use client";

import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import type { Profile } from "@/lib/profile";

export default function Footer({ profile }: { profile: Profile }) {
  const socialLinks = [
    { href: profile.github, icon: FaGithub, label: "GitHub" },
    { href: profile.linkedin, icon: FaLinkedin, label: "LinkedIn" },
    { href: `mailto:${profile.email}`, icon: FaEnvelope, label: "Email" },
  ];
  return (
    <footer className="border-t border-[#334155]/50 bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Shuriza. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-slate-400 hover:text-cyan-400 transition-colors"
              aria-label={link.label}
            >
              <link.icon size={20} />
            </a>
          ))}
        </div>

        <p className="text-xs text-slate-600">
          Built with Next.js & Three.js
        </p>
      </div>
    </footer>
  );
}
