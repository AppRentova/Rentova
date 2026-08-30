import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function AppShell({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader compact={compact} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

