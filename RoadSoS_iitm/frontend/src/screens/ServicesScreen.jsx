import { useEffect, useState } from "react";
import { fetchNearbyServices } from "../api/client";
import ServiceCard from "../components/ServiceCard";

const filters = ["hospital", "trauma_centre", "ambulance", "police", "towing", "tyre_shop", "blood_bank"];

export default function ServicesScreen({ location, sos }) {
  const [type, setType] = useState("");
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchNearbyServices({ lat: location.latitude, lng: location.longitude, types: type, severity: sos.severity }).then((data) => setServices(data.services || []));
  }, [location.latitude, location.longitude, type, sos.severity]);

  return (
    <section className="grid gap-4 pb-20">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setType("")} className={`rounded-lg px-3 py-2 text-sm font-bold ${!type ? "bg-red-600 text-white" : "bg-white"}`}>All</button>
        {filters.map((filter) => <button key={filter} onClick={() => setType(filter)} className={`rounded-lg px-3 py-2 text-sm font-bold ${type === filter ? "bg-red-600 text-white" : "bg-white"}`}>{filter.replace("_", " ")}</button>)}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {services.map((service) => <ServiceCard key={service.id} service={service} />)}
      </div>
    </section>
  );
}
