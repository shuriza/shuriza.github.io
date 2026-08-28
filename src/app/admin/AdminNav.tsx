import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/app/admin/actions";

const ADMIN_LINKS = [
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/settings", label: "Settings" },
];

/**
 * Navigasi dashboard admin.
 * `active` = rute halaman saat ini (link-nya disembunyikan).
 * `action` = tombol utama opsional, mis. "+ Tambah project".
 */
export default function AdminNav({
  active,
  action,
}: {
  active: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {ADMIN_LINKS.filter((link) => link.href !== active).map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-lg border border-[#475569] px-4 py-2 text-sm text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
        >
          {link.label}
        </Link>
      ))}
      {action}
      <form action={signOut}>
        <button className="rounded-lg border border-[#475569] px-4 py-2 text-sm text-slate-300 hover:border-cyan-400 hover:text-cyan-300">
          Keluar
        </button>
      </form>
    </div>
  );
}
