"use client";

import { useEffect, useState, type RefObject } from "react";
import { useInView } from "framer-motion";

/**
 * Reveal animation saat elemen masuk viewport.
 *
 * Bedanya dengan `useInView` mentah: elemen yang posisinya sudah terlewat di
 * atas viewport saat mount (mis. browser me-restore posisi scroll setelah
 * reload) langsung dianggap terlihat. Tanpa ini IntersectionObserver melaporkan
 * "tidak intersecting", dan karena `once: true` section-nya tersangkut di
 * opacity 0 selamanya sampai user scroll balik ke atas.
 */
export function useReveal(ref: RefObject<Element | null>): boolean {
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (revealed) return;

    if (isInView) {
      setRevealed(true);
      return;
    }

    // Sudah discroll melewati elemen ini sebelum observer jalan.
    const element = ref.current;
    if (element && element.getBoundingClientRect().bottom <= 0) {
      setRevealed(true);
    }
  }, [isInView, ref, revealed]);

  return revealed;
}
