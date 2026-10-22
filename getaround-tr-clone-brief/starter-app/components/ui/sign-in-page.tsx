"use client";

import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setMessage("Demo sign-in is ready for the Supabase Auth connection."); };
  return <main className="login-page">
    <section className="login-image-panel" aria-label="Rentova vehicle sharing"><Image src="/vehicles/car-three.png" alt="Rentova vehicle ready for a city journey" fill priority sizes="(max-width: 800px) 100vw, 50vw" /><Link className="login-back" href="/" aria-label="Back to Rentova"><ArrowLeft aria-hidden="true" /></Link><div><strong>Rentova</strong><p>Nearby cars, ready when the city moves.</p></div></section>
    <section className="login-form-panel"><div className="login-form-wrap"><h1>Welcome back</h1><p>New to Rentova? <Link href="/register">Create an account</Link></p><form onSubmit={submit}>
      <label><span>Email address</span><input type="email" name="email" autoComplete="email" placeholder="name@example.com" required /></label>
      <label><span>Password</span><div className="password-field"><input type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" placeholder="Your password" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></div></label>
      <div className="login-options"><label><input type="checkbox" name="rememberMe" />Remember me</label><button type="button">Forgot password?</button></div>
      <button className="login-submit" type="submit">Sign in</button>
      {message && <p className="login-message" role="status">{message}</p>}
    </form></div></section>
  </main>;
}
