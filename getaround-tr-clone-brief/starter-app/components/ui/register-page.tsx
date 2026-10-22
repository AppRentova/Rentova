"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "../../lib/supabase";

export function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    if (password !== String(form.get("confirmPassword"))) { setMessage("Passwords do not match."); setBusy(false); return; }
    if (!supabase) { setMessage("Authentication is not configured."); setBusy(false); return; }
    const { data, error } = await supabase.auth.signUp({ email: String(form.get("email")), password, options: { data: { full_name: String(form.get("fullName")) }, emailRedirectTo: `${window.location.origin}/profile` } });
    if (error) { setMessage(error.message); setBusy(false); return; }
    if (data.session) { router.push("/profile"); router.refresh(); return; }
    setMessage("Account created. Check your email to confirm your address, then sign in."); setBusy(false);
  };
  return <main className="login-page register-page"><section className="login-image-panel" aria-label="Join Rentova"><Image src="/vehicles/car-two.png" alt="A Rentova car in Istanbul" fill priority sizes="(max-width: 800px) 100vw, 50vw" /><Link className="login-back" href="/" aria-label="Back to Rentova"><ArrowLeft /></Link><div><strong>Rentova</strong><p>Create one account to book nearby cars and manage your trips.</p></div></section><section className="login-form-panel"><div className="login-form-wrap"><h1>Create account</h1><p>Already registered? <Link href="/login">Sign in</Link></p><form onSubmit={submit}><label><span>Full name</span><input type="text" name="fullName" autoComplete="name" required /></label><label><span>Email address</span><input type="email" name="email" autoComplete="email" required /></label><label><span>Password</span><input type="password" name="password" autoComplete="new-password" minLength={6} required /></label><label><span>Confirm password</span><input type="password" name="confirmPassword" autoComplete="new-password" minLength={6} required /></label><button className="login-submit" type="submit" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>{message && <p className="login-message" role="alert">{message}</p>}</form></div></section></main>;
}
