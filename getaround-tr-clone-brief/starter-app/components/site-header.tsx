"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { getMessages } from "../lib/i18n";
import { useAuth } from "./auth-provider";

export function SiteHeader() {
  const m = getMessages("en").navigation;
  const { user } = useAuth();
  const account = user ? <Link className="button button-dark" href="/profile">My profile</Link> : <><Link href="/login">{m.signIn}</Link><Link className="button button-dark" href="/register">{m.signUp}</Link></>;
  return <header className="site-header"><Link className="brand" href="/" translate="no">Rentova</Link><nav aria-label="Primary navigation"><Link href="/search">{m.cars}</Link><Link href="/#how-it-works">{m.howItWorks}</Link><Link href="/owner">{m.owners}</Link><Link href="/admin">Admin demo</Link></nav><div className="account-actions"><button className="locale-button" type="button" aria-label="Language: English">EN</button>{account}</div><details className="mobile-navigation"><summary aria-label="Open navigation menu"><Menu aria-hidden="true" /></summary><nav aria-label="Mobile navigation"><Link href="/search">{m.cars}</Link><Link href="/#how-it-works">{m.howItWorks}</Link><Link href="/owner">{m.owners}</Link><Link href="/admin">Admin demo</Link>{account}</nav></details></header>;
}
