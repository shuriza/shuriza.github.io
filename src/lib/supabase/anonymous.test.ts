import { describe, expect, it } from "vitest";
import { isMissingRelationError } from "@/lib/supabase/anonymous";

describe("isMissingRelationError", () => {
  it("recognizes only the named missing PostgREST relation", () => {
    const missingView = {
      code: "PGRST205",
      message: "Could not find the table 'public.portfolio_profile' in the schema cache",
    };

    expect(isMissingRelationError(missingView, "portfolio_profile")).toBe(true);
    expect(isMissingRelationError(missingView, "profile")).toBe(false);
  });

  it("does not hide unrelated database errors", () => {
    expect(
      isMissingRelationError(
        { code: "42501", message: 'permission denied for table "portfolio_profile"' },
        "portfolio_profile",
      ),
    ).toBe(false);
  });
});
