"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input } from "@/components/ui";

export default function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const [locale, setLocale] = useState("tr");

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Kayıt başarısız");
        return;
      }

      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch {
      setError("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Kayıt Ol</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Ad Soyad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="E-posta"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Telefon (isteğe bağlı)"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Şifre"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-sm px-4 py-3">{error}</p>
          )}

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Kayıt Ol
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Zaten hesabınız var mı?{" "}
          <Link href={`/${locale}/auth/login`} className="text-black font-medium hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
