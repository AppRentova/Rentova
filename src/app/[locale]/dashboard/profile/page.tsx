"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const router = useRouter();
  const [locale, setLocale] = useState("tr");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const resolved = await params;
        if (!mounted) return;

        setLocale(resolved.locale);

        const res = await fetch("/api/profile");
        if (!res.ok) {
          router.push(`/${resolved.locale}/auth/login`);
          return;
        }

        const data = await res.json();
        setUser(data);
        setName(data.name ?? "");
        setPhone(data.phone ?? "");
        setAvatarUrl(data.image ?? "");
      } catch {
        router.push(`/${locale}/auth/login`);
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [params, router]);

  async function uploadAvatar(file: File) {
    setUploadingAvatar(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gorsel yuklenemedi");
      }

      setAvatarUrl(data.url);
      return data.url as string;
    } catch (err: any) {
      setError(err.message || "Gorsel yuklenemedi");
      throw err;
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadAvatar(file);
    } finally {
      e.target.value = "";
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: phone || null,
          image: avatarUrl || null,
          ...(newPassword ? { currentPassword, newPassword } : {}),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Guncelleme basarisiz");
        return;
      }

      setUser(data);
      setName(data.name ?? "");
      setPhone(data.phone ?? "");
      setAvatarUrl(data.image ?? "");
      setCurrentPassword("");
      setNewPassword("");
      setSuccess("Profil basariyla guncellendi");
      router.refresh();
    } catch {
      setError("Bir hata olustu");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded-sm" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const avatarInitial = user.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
          <p className="text-sm text-gray-500 mt-1">
            Temel bilgiler, profil fotoğrafı ve şifre ayarlarını buradan yönetin.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-gray-100">
          <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
            {avatarUrl ? (
              <img src={avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold text-gray-500">{avatarInitial}</span>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-sm cursor-pointer hover:bg-gray-800 transition-colors">
                {uploadingAvatar ? "Yukleniyor..." : "Fotoğraf Yükle"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>

              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl("")}
                  className="text-sm font-medium text-gray-600 hover:text-red-600"
                >
                  Fotoğrafı kaldır
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Ad Soyad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
          />

          <Input
            label="E-posta"
            type="email"
            value={user.email}
            disabled
          />

          <Input
            label="Telefon"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <hr className="border-gray-100" />
          <h3 className="text-lg font-semibold text-gray-900">Şifre Değiştir</h3>

          <Input
            label="Mevcut Şifre"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            minLength={6}
          />

          <Input
            label="Yeni Şifre"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={6}
          />

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-sm px-4 py-3">{error}</p>}
          {success && <p className="text-sm text-green-600 bg-green-50 rounded-sm px-4 py-3">{success}</p>}

          <Button
            type="submit"
            className="w-full sm:w-auto"
            size="lg"
            loading={saving}
          >
            Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
