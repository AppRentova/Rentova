import Link from "next/link";
import { Menu } from "lucide-react";
import { getMessages } from "../lib/i18n";
export function SiteHeader() { const m = getMessages("en").navigation; return <header className="site-header"><Link className="brand" href="/">Rentova</Link><nav aria-label="Primary navigation"><Link href="/search">{m.cars}</Link><Link href="/#how-it-works">{m.howItWorks}</Link><Link href="/owner">{m.owners}</Link><Link href="/admin">Admin demo</Link></nav><div className="account-actions"><button className="locale-button" type="button" aria-label="Language: English">EN</button><Link href="/login">{m.signIn}</Link><Link className="button button-dark" href="/register">{m.signUp}</Link></div><button className="mobile-menu" aria-label="Open menu"><Menu /></button></header> }
