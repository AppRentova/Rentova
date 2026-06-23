"use client";

import { useState, useEffect, useCallback } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

const IZMIR: [number, number] = [38.4192, 27.1287];

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Tarayıcınız konum özelliğini desteklemiyor.",
        loading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (err) => {
        let error = "Konum alınamadı.";
        if (err.code === 1) error = "Konum izni reddedildi. Varsayılan konum (İzmir) kullanılıyor.";
        else if (err.code === 2) error = "Konum bilgisi kullanılamıyor.";
        else if (err.code === 3) error = "Konum isteği zaman aşımına uğradı.";
        setState({
          latitude: IZMIR[0],
          longitude: IZMIR[1],
          error,
          loading: false,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  const center: [number, number] =
    state.latitude !== null && state.longitude !== null
      ? [state.latitude, state.longitude]
      : IZMIR;

  return {
    ...state,
    center,
    requestLocation,
    isIzmir: center[0] === IZMIR[0] && center[1] === IZMIR[1],
  };
}
