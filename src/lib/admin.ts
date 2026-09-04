import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) redirect("/admin/login?error=setup");

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error("Tidak dapat memverifikasi sesi admin.", { cause: authError });
  }
  if (!user) redirect("/admin/login");

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError) {
    throw new Error("Tidak dapat memverifikasi hak akses admin.", { cause: adminError });
  }
  if (!admin) redirect("/admin/login?error=unauthorized");

  return { supabase, user };
}
