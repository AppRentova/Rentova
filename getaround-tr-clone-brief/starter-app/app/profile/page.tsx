"use client";

import { LogOut, Mail, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../../components/auth-provider";
import { supabase } from "../../lib/supabase";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [loading, user, router]);
  if (loading || !user) return <main className="profile-page"><p>Loading your profile…</p></main>;
  const name = String(user.user_metadata?.full_name || user.email?.split("@")[0] || "Rentova member");
  return <main className="profile-page"><section className="profile-heading"><div className="profile-avatar"><UserRound aria-hidden="true" /></div><div><h1>{name}</h1><p>Rentova member</p></div><button className="button profile-signout" type="button" onClick={async () => { await supabase?.auth.signOut(); router.push("/"); router.refresh(); }}><LogOut />Sign out</button></section><section className="profile-details"><h2>Account details</h2><dl><div><dt><Mail />Email</dt><dd>{user.email}</dd></div><div><dt>Account ID</dt><dd>{user.id}</dd></div></dl></section></main>;
}
