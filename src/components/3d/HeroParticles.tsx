"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const ParticleField = dynamic(() => import("@/components/3d/ParticleField"), { ssr: false });
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribe(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

export default function HeroParticles({ enabled }: { enabled: boolean }) {
  // Start disabled during SSR so motion-sensitive users never receive a canvas flash.
  const prefersReducedMotion = useSyncExternalStore(subscribe, getSnapshot, () => true);

  if (!enabled || prefersReducedMotion) return null;
  return <ParticleField />;
}
