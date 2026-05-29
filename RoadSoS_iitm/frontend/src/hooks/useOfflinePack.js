import { useEffect, useState } from "react";
import { fetchOfflinePack } from "../api/client";
import { getOfflinePack, setOfflinePack } from "../utils/storage";

export function useOfflinePack(location) {
  const [pack, setPack] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!location?.latitude) return;
      const key = `offline_pack:${location.latitude.toFixed(2)}:${location.longitude.toFixed(2)}`;
      const cached = await getOfflinePack(key);
      if (!cancelled && cached) setPack(cached);
      if (navigator.onLine) {
        const fresh = await fetchOfflinePack({ lat: location.latitude, lng: location.longitude }).catch(() => null);
        if (fresh) {
          await setOfflinePack(key, fresh);
          if (!cancelled) setPack(fresh);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [location?.latitude, location?.longitude]);

  return pack;
}
