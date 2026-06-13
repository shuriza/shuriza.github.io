"use client";

import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const socialLinks = [
  { href: "https://github.com/shuriza", icon: FaGithub, label: "GitHub" },
  { href: "https://linkedin.com/in/shuriza", icon: FaLinkedin, label: "LinkedIn" },
  { href: "mailto:shuriza@email.com", icon: FaEnvelope, label: "Email" },
];

export default function Footer() {
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
              target="_blank"
              rel="noopener noreferrer"
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
