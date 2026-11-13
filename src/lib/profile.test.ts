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

  it("normalizes editable CV content while rejecting malformed entries", () => {
    const profile = normalizeProfile({
      phone: "+62 817 7509 3906",
      cv_experiences: [
        {
          title: "Developer",
          company: "Studio",
          location: "Kediri",
          period: "2026",
          bullets: ["Membangun fitur."],
        },
      ],
      cv_education: [
        { title: "D3", institution: "Politeknik", period: "2023 - 2026", description: "Software." },
      ],
      cv_project_keys: ["portfolio-lab"],
    });

    expect(profile.phone).toBe("+62 817 7509 3906");
    expect(profile.cv_experiences).toHaveLength(1);
    expect(profile.cv_education).toHaveLength(1);
    expect(profile.cv_project_keys).toEqual(["portfolio-lab"]);
  });
});
