import * as atlas from "@azure/maps-control";
import "@azure/maps-control/dist/atlas.min.css";
import { useEffect, useRef, useState } from "react";
import { fetchHeatmap, fetchNearbyServices } from "../api/client";
import ServiceCard from "../components/ServiceCard";

const colours = { hospital: "#dc2626", trauma_centre: "#991b1b", ambulance: "#16a34a", police: "#2563eb", towing: "#7c3aed", tyre_shop: "#f59e0b", blood_bank: "#be123c" };

export default function MapScreen({ location, sos }) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    mapRef.current = new atlas.Map(ref.current, {
      center: [location.longitude, location.latitude],
      zoom: 12,
      view: "Auto",
      authOptions: { authType: "subscriptionKey", subscriptionKey: import.meta.env.VITE_AZURE_MAPS_KEY || "dev-key" }
    });
  }, [location.latitude, location.longitude]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.events.add("ready", async () => {
      map.setCamera({ center: [location.longitude, location.latitude], zoom: 12 });
      const data = await fetchNearbyServices({ lat: location.latitude, lng: location.longitude, severity: sos.severity });
      const source = new atlas.source.DataSource("services");
      map.sources.add(source);
      source.add((data.services || []).map((service) => new atlas.data.Feature(new atlas.data.Point([service.longitude, service.latitude]), service)));
      map.layers.add(new atlas.layer.BubbleLayer(source, "service-pins", {
        radius: 9,
        color: ["match", ["get", "service_type"], "hospital", colours.hospital, "trauma_centre", colours.trauma_centre, "ambulance", colours.ambulance, "police", colours.police, "towing", colours.towing, "tyre_shop", colours.tyre_shop, "blood_bank", colours.blood_bank, "#111827"],
        strokeColor: "#fff",
        strokeWidth: 2
      }));
      map.events.add("click", "service-pins", (event) => setSelected(event.shapes[0].getProperties()));
      const heat = await fetchHeatmap({ lat: location.latitude, lng: location.longitude }).catch(() => ({ cells: [] }));
      const heatSource = new atlas.source.DataSource("heatmap");
      map.sources.add(heatSource);
      heatSource.add((heat.cells || []).map((cell) => new atlas.data.Feature(new atlas.data.Point([cell.longitude, cell.latitude]), cell)));
      map.layers.add(new atlas.layer.HeatMapLayer(heatSource, "accident-heatmap", { weight: ["get", "count"], radius: 18, opacity: 0.6 }), "service-pins");
    });
  }, [location.latitude, location.longitude, sos.severity]);

  return (
    <section className="grid gap-4 pb-20 lg:grid-cols-[1fr_360px]">
      <div ref={ref} className="map-shell overflow-hidden rounded-lg border border-orange-200 bg-white" />
      <aside className="grid content-start gap-3">
        <h2 className="text-lg font-black">Service detail</h2>
        {selected ? <ServiceCard service={selected} /> : <p className="rounded-lg bg-white p-4 text-sm font-semibold text-gray-600">Tap a map pin for CALL and ETA.</p>}
      </aside>
    </section>
  );
}
