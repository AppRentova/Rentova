"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = useCallback(async (email: string, password: string, locale: string = "tr") => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Giriş başarısız");
    setUser(data.user);
    router.push(`/${locale}/dashboard`);
    router.refresh();
    return data.user;
  }, [router]);

  const register = useCallback(async (name: string, email: string, password: string, phone?: string, locale: string = "tr") => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Kayıt başarısız");
    setUser(data.user);
    router.push(`/${locale}/dashboard`);
    router.refresh();
    return data.user;
  }, [router]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout");
    setUser(null);
    router.push("/");
    router.refresh();
  }, [router]);

  return { user, loading, login, register, logout };
}
