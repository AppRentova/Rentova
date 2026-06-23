"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select } from "@/components/ui";
import { useGeolocation } from "@/hooks/useGeolocation";

type FormState = {
  brand: string;
  model: string;
  year: string;
  transmission: "MANUAL" | "AUTOMATIC";
  fuelType: "GASOLINE" | "DIESEL" | "ELECTRIC" | "HYBRID" | "LPG";
  seats: string;
  pricePerHour: string;
  pricePerDay: string;
  deposit: string;
  description: string;
  address: string;
  city: string;
};

export default function ListYourCarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const router = useRouter();
  const geo = useGeolocation();
  const [locale, setLocale] = useState("tr");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [form, setForm] = useState<FormState>({
    brand: "Renault",
    model: "Clio",
    year: "2023",
    transmission: "AUTOMATIC",
    fuelType: "GASOLINE",
    seats: "5",
    pricePerHour: "250",
    pricePerDay: "1800",
    deposit: "1500",
    description:
      "Temiz, bakimli ve sigara icilmemis aractir. Sehir ici ve uzun yol icin uygundur.",
    address: "",
    city: "Istanbul",
  });

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
    geo.requestLocation();
  }, [params, geo.requestLocation]);

  useEffect(() => {
    setForm((prev) => {
      if (prev.address) return prev;
      return {
        ...prev,
        address: `Konum: ${geo.center[0].toFixed(4)}, ${geo.center[1].toFixed(4)}`,
      };
    });
  }, [geo.center]);

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const uploaded: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Fotoğraf yüklenemedi");
        }

        uploaded.push(data.url);
      }

      setImageUrls((prev) => [...prev, ...uploaded].slice(0, 8));
    } catch (err: any) {
      setError(err.message || "Fotoğraf yüklenemedi");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (imageUrls.length === 0) {
        throw new Error("En az bir fotoğraf yükleyin");
      }

      const [lat, lng] = geo.center;
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: form.brand.trim(),
          model: form.model.trim(),
          year: Number(form.year),
          transmission: form.transmission,
          fuelType: form.fuelType,
          seats: Number(form.seats),
          pricePerHour: Number(form.pricePerHour),
          pricePerDay: Number(form.pricePerDay),
          deposit: Number(form.deposit || 0),
          description: form.description.trim(),
          lat,
          lng,
          address: form.address.trim(),
          city: form.city.trim(),
          images: imageUrls,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Araç kaydedilemedi");
      }

      setSuccess("Aracınız başarıyla listelendi");
      router.push(`/${locale}/list-your-car/success`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Araç kaydedilemedi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Aracınızı listeleyin</h1>
        <p className="text-gray-600 mt-2">
          Temel bilgileri girin, fotoğrafları yükleyin ve birkaç dakikada yayına alın.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-gray-100 rounded-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Araç bilgileri</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Marka"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                required
              />
              <Input
                label="Model"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                required
              />
              <Input
                label="Yıl"
                type="number"
                min={2000}
                max={2030}
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                required
              />
              <Input
                label="Koltuk sayısı"
                type="number"
                min={1}
                max={9}
                value={form.seats}
                onChange={(e) => setForm({ ...form, seats: e.target.value })}
                required
              />
              <Select
                label="Vites"
                value={form.transmission}
                onChange={(e) =>
                  setForm({ ...form, transmission: e.target.value as FormState["transmission"] })
                }
                options={[
                  { value: "MANUAL", label: "Manual" },
                  { value: "AUTOMATIC", label: "Automatic" },
                ]}
              />
              <Select
                label="Yakit"
                value={form.fuelType}
                onChange={(e) => setForm({ ...form, fuelType: e.target.value as FormState["fuelType"] })}
                options={[
                  { value: "GASOLINE", label: "Benzin" },
                  { value: "DIESEL", label: "Dizel" },
                  { value: "ELECTRIC", label: "Elektrik" },
                  { value: "HYBRID", label: "Hibrit" },
                  { value: "LPG", label: "LPG" },
                ]}
              />
            </div>
            <Input
              label="Aciklama"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </section>

          <section className="bg-white border border-gray-100 rounded-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Konum ve fiyat</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Sehir"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
              />
              <Input
                label="Adres"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
              />
              <Input
                label="Saatlik fiyat (TL)"
                type="number"
                min={1}
                value={form.pricePerHour}
                onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })}
                required
              />
              <Input
                label="Gunluk fiyat (TL)"
                type="number"
                min={1}
                value={form.pricePerDay}
                onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
                required
              />
              <Input
                label="Depozito (TL)"
                type="number"
                min={0}
                value={form.deposit}
                onChange={(e) => setForm({ ...form, deposit: e.target.value })}
                required
              />
              <div className="rounded-sm border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                Konum: {geo.center[0].toFixed(4)}, {geo.center[1].toFixed(4)}
                {geo.loading ? " (konum aliniyor)" : ""}
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-100 rounded-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Fotoğraflar</h2>
            <label className="block border-2 border-dashed border-gray-200 rounded-sm p-6 text-center cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => uploadFiles(e.target.files)}
                className="hidden"
              />
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  {uploading ? "Fotoğraflar yükleniyor..." : "Fotoğrafları yüklemek için tıklayın"}
                </p>
                <p className="text-xs text-gray-500">En az 1, en fazla 8 fotoğraf</p>
              </div>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {imageUrls.map((url) => (
                <div key={url} className="aspect-video rounded-sm overflow-hidden bg-gray-100">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-100 rounded-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Özet</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-900">Araç:</span> {form.brand} {form.model}
              </p>
              <p>
                <span className="font-medium text-gray-900">Yıl:</span> {form.year}
              </p>
              <p>
                <span className="font-medium text-gray-900">Fiyat:</span> {form.pricePerDay} TL / gün
              </p>
              <p>
                <span className="font-medium text-gray-900">Fotoğraf:</span> {imageUrls.length} adet
              </p>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-sm px-4 py-3">{error}</p>}
            {success && <p className="text-sm text-green-600 bg-green-50 rounded-sm px-4 py-3">{success}</p>}

            <Button type="submit" className="w-full" size="lg" loading={saving}>
              Yayına Al
            </Button>

            <p className="text-xs text-gray-500">
              Konum paylaşımı kapalıysa varsayılan koordinat kullanılır.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
