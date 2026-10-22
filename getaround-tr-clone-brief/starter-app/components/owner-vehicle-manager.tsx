"use client";

import { LocateFixed, MapPin, Plus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import type { Coordinates } from "../lib/geo";

type DraftVehicle = { id: string; name: string; district: string; year: number; maskedPlate: string; location: Coordinates; createdAt: string };
const storageKey = "rentova.ownerVehicleDrafts";

export function OwnerVehicleManager() {
  const [drafts, setDrafts] = useState<DraftVehicle[]>([]);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [savingMessage, setSavingMessage] = useState("");

  useEffect(() => {
    try { setDrafts(JSON.parse(localStorage.getItem(storageKey) || "[]")); } catch { setDrafts([]); }
  }, []);

  const locateVehicle = () => {
    if (!("geolocation" in navigator)) { setLocationMessage("Location is not supported by this browser."); return; }
    setLocationMessage("Finding the vehicle location…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ lat: Number(coords.latitude.toFixed(3)), lng: Number(coords.longitude.toFixed(3)) });
        setLocationMessage("Approximate location captured. The exact address is not shown publicly.");
      },
      (error) => setLocationMessage(error.code === error.PERMISSION_DENIED ? "Location permission was blocked. Enable it in browser settings." : "The vehicle location could not be captured. Try again."),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  };

  const saveDraft = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!location) { setSavingMessage("Capture the vehicle location before saving the draft."); return; }
    const data = new FormData(event.currentTarget);
    const plate = String(data.get("plate") || "").trim().toUpperCase();
    const draft: DraftVehicle = {
      id: crypto.randomUUID(),
      name: `${data.get("make")} ${data.get("model")}`.trim(),
      district: String(data.get("district")),
      year: Number(data.get("year")),
      maskedPlate: plate.length > 2 ? `${plate.slice(0, 2)} ••••` : "Hidden",
      location,
      createdAt: new Date().toISOString(),
    };
    const next = [draft, ...drafts];
    localStorage.setItem(storageKey, JSON.stringify(next));
    setDrafts(next);
    setSavingMessage("Draft saved on this device. Connect your account to submit it for review.");
    event.currentTarget.reset();
    setLocation(null);
  };

  return <section id="vehicles" className="owner-vehicle-section">
    <div className="owner-section-heading"><div><h2>Add a vehicle</h2><p>Capture an approximate GPS position so renters can discover the car without exposing its exact address.</p></div><span><MapPin aria-hidden="true" /> Address protected</span></div>
    <form className="owner-vehicle-form" onSubmit={saveDraft}>
      <label><span>Make</span><input name="make" required placeholder="Toyota" /></label>
      <label><span>Model</span><input name="model" required placeholder="Corolla Cross" /></label>
      <label><span>Year</span><input name="year" required type="number" min="2000" max="2027" placeholder="2024" /></label>
      <label><span>Plate</span><input name="plate" required autoComplete="off" placeholder="34 ABC 123" /></label>
      <label><span>City</span><input name="city" required defaultValue="Istanbul" /></label>
      <label><span>District</span><input name="district" required placeholder="Kadıköy" /></label>
      <div className="owner-location-control">
        <button type="button" className="button location-button" onClick={locateVehicle}><LocateFixed aria-hidden="true" />Capture vehicle location</button>
        <p role="status">{locationMessage || "Location is requested only when you press the button."}</p>
      </div>
      <button className="button button-dark owner-save-button" type="submit"><Plus aria-hidden="true" />Save vehicle draft</button>
      {savingMessage && <p className="owner-form-message" role="status">{savingMessage}</p>}
    </form>
    <div className="owner-drafts"><h3>Vehicle drafts on this device</h3>{drafts.length ? <div className="owner-draft-list">{drafts.map((draft) => <article key={draft.id}><div><strong>{draft.name}</strong><span>{draft.year} · {draft.maskedPlate}</span></div><div><span>{draft.district}</span><small>{draft.location.lat.toFixed(3)}, {draft.location.lng.toFixed(3)}</small></div><b>Draft</b></article>)}</div> : <p>No local drafts yet.</p>}</div>
  </section>;
}
