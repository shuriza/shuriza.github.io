export type AdminAuthConfig = {
  email: string;
  passwordHash: string;
  secret: string;
};

export function getAdminAuthConfig(): AdminAuthConfig | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const secret = process.env.AUTH_SECRET?.trim();

  if (!email || !passwordHash || !secret || secret.length < 32) return null;
  return { email, passwordHash, secret };
}
