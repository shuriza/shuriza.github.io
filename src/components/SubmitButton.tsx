"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

export default function SubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-[#0a0a0f] transition-colors hover:bg-cyan-400 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Menyimpan..." : children}
    </button>
  );
}
