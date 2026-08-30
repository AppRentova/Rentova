import { AppShell } from "@/components/layout/app-shell";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell compact>
      <DashboardShell>{children}</DashboardShell>
    </AppShell>
  );
}

