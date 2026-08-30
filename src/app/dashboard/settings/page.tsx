"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [messages, setMessages] = useState(false);

  return (
    <Card>
      <CardHeader>
        <h1 className="font-display text-3xl font-semibold">Ayarlar</h1>
      </CardHeader>
      <CardContent className="space-y-4">
        <Switch checked={notifications} onCheckedChange={setNotifications} label="Bildirimler açık" />
        <Switch checked={messages} onCheckedChange={setMessages} label="Mesaj e-postaları" />
        <Button>Kaydet</Button>
      </CardContent>
    </Card>
  );
}
