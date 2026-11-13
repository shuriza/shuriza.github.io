"use server";

import { redirect } from "next/navigation";
import { getAdminAuthConfig } from "@/lib/auth/config";
import { clearAdminSession, createAdminSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { clearLoginFailures, isLoginRateLimited, recordFailedLogin } from "@/lib/auth/rate-limit";

function errorUrl(code: "invalid" | "setup") {
  return `/admin/login?error=${code}`;
}

export async function loginAdmin(formData: FormData) {
  const config = getAdminAuthConfig();
  if (!config) redirect(errorUrl("setup"));

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (await isLoginRateLimited(email)) redirect(errorUrl("invalid"));
  const valid = email === config.email && (await verifyPassword(password, config.passwordHash));

  if (!valid) {
    await recordFailedLogin(email);
    redirect(errorUrl("invalid"));
  }

  await clearLoginFailures(email);
  await createAdminSession(config.email);
  redirect("/admin/projects");
}

export async function signOut() {
  await clearAdminSession();
  redirect("/admin/login");
}
