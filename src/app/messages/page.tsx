import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { messages } from "@/lib/mock-data";

export default function MessagesPage() {
  return (
    <AppShell compact>
      <section className="mx-auto max-w-5xl px-4 py-8">
        <Card>
          <CardHeader>
            <h1 className="font-display text-3xl font-semibold">Mesajlar</h1>
          </CardHeader>
          <CardContent className="space-y-3">
            {messages.map((message) => (
              <div key={message.person} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{message.person}</p>
                  <span className="text-sm text-muted-foreground">{message.time}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{message.preview}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}

