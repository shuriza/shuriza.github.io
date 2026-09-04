import { describe, expect, it } from "vitest";
import { fallbackSettings, resolveSettings } from "@/lib/settings";

describe("resolveSettings", () => {
  it("preserves explicit disabled flags", () => {
    expect(resolveSettings({ about_enabled: false, projects_enabled: "false" })).toMatchObject({
      about_enabled: false,
      projects_enabled: false,
    });
  });

  it("keeps defaults for malformed or missing values", () => {
    expect(resolveSettings({ skills_enabled: "not-a-boolean" }).skills_enabled).toBe(fallbackSettings.skills_enabled);
    expect(resolveSettings(null)).toEqual(fallbackSettings);
  });
});
