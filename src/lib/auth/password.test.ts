import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("admin password hashing", () => {
  it("verifies the original password and rejects a different one", async () => {
    const encoded = await hashPassword("correct horse battery staple");

    expect(encoded).toMatch(/^scrypt\$16384\$8\$1\$/);
    await expect(verifyPassword("correct horse battery staple", encoded)).resolves.toBe(true);
    await expect(verifyPassword("wrong password", encoded)).resolves.toBe(false);
  });

  it("rejects malformed hashes without throwing", async () => {
    await expect(verifyPassword("anything", "not-a-password-hash")).resolves.toBe(false);
  });
});
