import { redirect } from "next/navigation";
import { getAdminAuthConfig } from "@/lib/auth/config";
import { readAdminSession } from "@/lib/auth/session";

export async function requireAdmin() {
  const config = getAdminAuthConfig();
  if (!config) redirect("/admin/login?error=setup");

  const session = await readAdminSession();
  if (!session || session.email !== config.email) {
    redirect("/admin/login");
  }

  return { user: { email: session.email } };
}
