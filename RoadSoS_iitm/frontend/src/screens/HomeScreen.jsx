import { useState } from "react";
import { fetchNearbyServices, submitIncident } from "../api/client";
import GoldenHourTimer from "../components/GoldenHourTimer";
import SOSButton from "../components/SOSButton";
import ServiceCard from "../components/ServiceCard";

export default function HomeScreen({ location, sos, setSos, setTab }) {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState("");

  async function activate() {
    const startedAt = Date.now();
    setSos({ active: true, startedAt, severity: "CRITICAL" });
    setStatus("Fetching services and dispatching alerts");
    const [nearby] = await Promise.all([
      fetchNearbyServices({ lat: location.latitude, lng: location.longitude, severity: "CRITICAL", types: "trauma_centre,hospital,ambulance,police,towing,tyre_shop" }),
      submitIncident({ lat: location.latitude, lng: location.longitude, severity: "CRITICAL", description: "SOS activated from RoadSoS", notify_contacts: [] }).catch(() => null)
    ]);
    setServices(nearby.services || []);
    setStatus("Emergency contacts ready");
  }

  return (
    <section className="grid gap-6 pb-20 lg:grid-cols-[1fr_380px]">
      <div className="grid justify-items-center gap-6 rounded-lg bg-white p-6 text-center shadow-sm">
        <GoldenHourTimer active={sos.active} startedAt={sos.startedAt} />
        <SOSButton active={sos.active} onClick={activate} />
        <p className="max-w-md text-sm font-medium text-gray-600">{status || "Tap only during a real emergency. RoadSoS fetches nearby responders, starts the Golden Hour timer, and queues alerts together."}</p>
        <div className="grid w-full grid-cols-3 gap-2">
          <button onClick={() => setTab("triage")} className="rounded-lg bg-gray-950 px-3 py-3 text-sm font-bold text-white">AI Triage</button>
          <button onClick={() => setTab("map")} className="rounded-lg bg-orange-100 px-3 py-3 text-sm font-bold text-orange-900">Map</button>
          <button onClick={() => setTab("profile")} className="rounded-lg bg-orange-100 px-3 py-3 text-sm font-bold text-orange-900">Medical QR</button>
        </div>
      </div>
      <div className="grid content-start gap-3">
        <h2 className="text-lg font-black text-gray-950">Fastest ranked response</h2>
        {(services.length ? services : []).slice(0, 5).map((service) => <ServiceCard key={service.id} service={service} />)}
      </div>
    </section>
  );
}
