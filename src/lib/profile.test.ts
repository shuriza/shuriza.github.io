import { describe, expect, it } from "vitest";
import { fallbackProfile, normalizeProfile } from "@/lib/profile";

describe("normalizeProfile", () => {
  it("returns only the public profile shape from a legacy wildcard response", () => {
    const profile = normalizeProfile({
      display_name: "Firdaus",
      hero_roles: ["Membangun aplikasi web"],
      private_note: "must not leave the data boundary",
    });

    expect(profile).toMatchObject({
      id: 1,
      display_name: "Firdaus",
      hero_roles: ["Membangun aplikasi web"],
    });
    expect(profile).not.toHaveProperty("private_note");
  });

  it("keeps legacy profile rows usable without missing CV fields", () => {
    const profile = normalizeProfile({
      linkedin: "https://linkedin.com/in/shuriza",
      website: "https://shuriza.me",
    });

    expect(profile.linkedin).toBe(fallbackProfile.linkedin);
    expect(profile.website).toBe(fallbackProfile.website);
    expect(profile.cv_summary).toBe(fallbackProfile.cv_summary);
  });

  it("replaces database placeholder text with the verified fallback", () => {
    expect(normalizeProfile({ display_name: "-" }).display_name).toBe(fallbackProfile.display_name);
  });
});
