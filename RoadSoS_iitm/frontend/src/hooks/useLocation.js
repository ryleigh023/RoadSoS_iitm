import { useEffect, useState } from "react";

const FALLBACK = { latitude: 28.6139, longitude: 77.209, accuracy: null, fallback: true };

export function useLocation() {
  const [location, setLocation] = useState(FALLBACK);
  const [status, setStatus] = useState("locating");

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("fallback");
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          fallback: false
        });
        setStatus("ready");
      },
      () => setStatus("fallback"),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 15000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, status };
}
