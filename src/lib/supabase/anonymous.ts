import { createClient } from "@supabase/supabase-js";

type SupabaseRelationError = { code?: string; message?: string } | null;

export function isMissingRelationError(error: SupabaseRelationError, relation: string) {
  const message = error?.message ?? "";
  const escapedRelation = relation.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const relationPattern = new RegExp(
    `(?:^|[^a-z0-9_])(?:public\\.)?${escapedRelation}(?:$|[^a-z0-9_])`,
    "i",
  );

  return (
    relationPattern.test(message) &&
    (error?.code === "42P01" || error?.code === "PGRST205" || /not found|schema cache|does not exist/i.test(message))
  );
}

export function createAnonymousSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
