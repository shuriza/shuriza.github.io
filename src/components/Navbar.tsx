"use client";

import { useEffect, useRef, useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import Link from "next/link";
import { fallbackSettings, type SiteSettings } from "@/lib/settings";

/** `flag: null` berarti link selalu tampil. */
const NAV_ITEMS = [
  { href: "/#hero", label: "Home", flag: null },
  { href: "/#about", label: "About", flag: "about_enabled" },
  { href: "/#skills", label: "Skills", flag: "skills_enabled" },
  { href: "/#projects", label: "Projects", flag: "projects_enabled" },
  { href: "/#contact", label: "Contact", flag: "contact_enabled" },
  { href: "/cv", label: "CV", flag: "cv_enabled" },
] as const;

export default function Navbar({ settings = fallbackSettings }: { settings?: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navLinks = NAV_ITEMS.filter((item) => item.flag === null || settings[item.flag]);
  const showAdminLink = settings.admin_link_enabled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  return (
    <nav
      aria-label="Navigasi utama"
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled ? "border-b border-[#334155]/50 bg-[#0f172a]/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/#hero" className="text-xl font-bold text-cyan-400 transition-colors hover:text-cyan-300">
          {"<Shuriza />"}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 transition-colors hover:text-cyan-400"
            >
              {link.label}
            </a>
          ))}
          {showAdminLink && (
            <a
              href="/admin/login"
              className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-[#0a0a0f] transition-colors hover:bg-cyan-400"
            >
              Login
            </a>
          )}
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="rounded text-slate-300 transition-colors hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 md:hidden"
          aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          {mobileOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div id="mobile-navigation" className="border-b border-[#334155]/50 bg-[#0f172a]/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-4 px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-slate-300 transition-colors hover:text-cyan-400"
              >
                {link.label}
              </a>
            ))}
            {showAdminLink && (
              <a
                href="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-2.5 font-semibold text-[#0a0a0f] transition-colors hover:bg-cyan-400"
              >
                Login
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
