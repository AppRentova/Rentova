import { createClient } from "./supabase/server";

export interface Session {
  userId: string;
  email: string;
  role: string;
  name?: string;
}

export async function getSession(): Promise<Session | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("id, name, email, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;

  return {
    userId: profile.id,
    email: profile.email,
    role: profile.role,
    name: profile.name,
  };
}
