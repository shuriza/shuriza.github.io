"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const navLinks = NAV_ITEMS.filter((item) => item.flag === null || settings[item.flag]);
  const showAdminLink = settings.admin_link_enabled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0f172a]/90 backdrop-blur-md border-b border-[#334155]/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            href="/#hero"
            className="text-xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {"<Shuriza />"}
          </Link>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              className="text-sm text-slate-300 hover:text-cyan-400 transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
          {showAdminLink && (
            <motion.a
              href="/admin/login"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * navLinks.length, duration: 0.4 }}
              className="px-5 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-[#0a0a0f] text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
            >
              Login
            </motion.a>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-slate-300 hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          {mobileOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            id="mobile-navigation"
            className="md:hidden bg-[#0f172a]/95 backdrop-blur-md border-b border-[#334155]/50"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              {showAdminLink && (
                <a
                  href="/admin/login"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-cyan-500 text-[#0a0a0f] font-semibold transition-colors hover:bg-cyan-400"
                >
                  Login
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
