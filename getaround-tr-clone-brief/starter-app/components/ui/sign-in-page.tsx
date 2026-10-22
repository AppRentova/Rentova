"use client";

import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "../../lib/supabase";

export function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    if (!supabase) { setMessage("Authentication is not configured."); setBusy(false); return; }
    const { error } = await supabase.auth.signInWithPassword({ email: String(form.get("email")), password: String(form.get("password")) });
    if (error) { setMessage(error.message); setBusy(false); return; }
    router.push("/profile"); router.refresh();
  };
  return <main className="login-page"><section className="login-image-panel" aria-label="Rentova vehicle sharing"><Image src="/vehicles/car-three.png" alt="Rentova vehicle ready for a city journey" fill priority sizes="(max-width: 800px) 100vw, 50vw" /><Link className="login-back" href="/" aria-label="Back to Rentova"><ArrowLeft aria-hidden="true" /></Link><div><strong>Rentova</strong><p>Nearby cars, ready when the city moves.</p></div></section><section className="login-form-panel"><div className="login-form-wrap"><h1>Welcome back</h1><p>New to Rentova? <Link href="/register">Create an account</Link></p><form onSubmit={submit}><label><span>Email address</span><input type="email" name="email" autoComplete="email" placeholder="name@example.com" required /></label><label><span>Password</span><div className="password-field"><input type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" placeholder="Your password" minLength={6} required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></div></label><button className="login-submit" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>{message && <p className="login-message" role="alert">{message}</p>}</form></div></section></main>;
}
