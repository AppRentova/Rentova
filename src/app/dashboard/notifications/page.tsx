import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { notifications } from "@/lib/mock-data";

export default function NotificationsPage() {
  return (
    <Card>
      <CardHeader>
        <h1 className="font-display text-3xl font-semibold">Bildirim ayarları</h1>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((notification) => (
          <div key={notification.title} className="rounded-2xl border border-border p-4">
            <p className="font-medium">{notification.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

