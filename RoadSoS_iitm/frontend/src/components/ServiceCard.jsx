import { Ambulance, Building2, Car, Droplets, MapPin, Phone, Shield, Wrench } from "lucide-react";

const icons = {
  ambulance: Ambulance,
  hospital: Building2,
  trauma_centre: Building2,
  police: Shield,
  towing: Wrench,
  tyre_shop: Car,
  blood_bank: Droplets
};

export default function ServiceCard({ service }) {
  const Icon = icons[service.service_type] || MapPin;
  const phone = service.phone_numbers?.[0];
  return (
    <article className="rounded-lg border border-orange-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-orange-100 text-red-700"><Icon size={20} /></span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-gray-950">{service.name}</h3>
          <p className="text-sm text-gray-600">{service.service_type?.replace("_", " ")} · {(service.distance_m / 1000).toFixed(1)} km · ETA {Math.ceil(service.eta_seconds / 60)} min</p>
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">{service.address || service.city || service.source}</p>
        </div>
        {phone && (
          <a className="grid h-10 w-10 place-items-center rounded-lg bg-green-600 text-white" href={`tel:${phone}`} aria-label={`Call ${service.name}`}>
            <Phone size={18} />
          </a>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs font-semibold text-gray-600">
        <span>MFER {service.mfer_score?.toFixed?.(3) || service.mfer_score}</span>
        <span>{service.is_24_hours ? "24h" : service.opening_hours || "hours unknown"}</span>
      </div>
    </article>
  );
}
