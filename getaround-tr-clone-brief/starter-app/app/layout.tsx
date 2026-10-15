import type { Metadata, Viewport } from "next";
import { SiteHeader } from "../components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Rentova — Local cars, on your time", template: "%s — Rentova" },
  description: "Find and book nearby cars by the hour or day.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#510f84", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader />{children}<footer><strong>Rentova</strong><span>Illustrative MVP · Turkey-ready architecture</span><a href="mailto:apprentova@gmail.com">apprentova@gmail.com</a></footer></body></html>;
}
