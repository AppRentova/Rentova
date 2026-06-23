"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input } from "@/components/ui";

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const [locale, setLocale] = useState("tr");

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Giriş başarısız");
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
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Giriş Yap</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="E-posta"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Şifre"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-sm px-4 py-3">{error}</p>
          )}

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Giriş Yap
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Hesabınız yok mu?{" "}
          <Link href={`/${locale}/auth/register`} className="text-black font-medium hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
