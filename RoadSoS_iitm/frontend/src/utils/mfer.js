import { haversineDistanceMeters } from "./haversine";

export const DEFAULT_WEIGHTS = { w1: 0.4, w2: 0.25, w3: 0.15, w4: 0.1, w5: 0.1 };

export function isNight(date = new Date()) {
  const hour = date.getHours();
  return hour >= 22 || hour < 6;
}

export function getAdjustedWeights({ severity = "MEDIUM", serviceType, now = new Date() } = {}) {
  const weights = { ...DEFAULT_WEIGHTS };
  if (String(severity).toUpperCase() === "CRITICAL") {
    weights.w1 = 0.5;
    weights.w4 = 0.2;
  }
  if (serviceType === "blood_bank") weights.w4 = 0.3;
  if (isNight(now)) weights.w2 = 0.35;
  return weights;
}

export function scoreService(service, origin, options = {}) {
  const now = options.now ? new Date(options.now) : new Date();
  const distance = service.distance_m ?? haversineDistanceMeters(origin, service);
  const weights = getAdjustedWeights({ severity: options.severity, serviceType: service.service_type, now });
  const A = service.is_24_hours ? 1 : service.open_now ? 0.6 : 0.2;
  const R = service.rating ? Math.min(1, Math.max(0, service.rating / 5)) : 0.5;
  const C = ["hospital", "trauma_centre", "blood_bank"].includes(service.service_type)
    ? Math.max(0, Math.min(1, Number(service.free_beds ?? 1) / Math.max(1, Number(service.capacity ?? 2))))
    : 1;
  const ageDays = service.last_verified_at ? (now - new Date(service.last_verified_at)) / 86400000 : 999;
  const V = ageDays < 30 ? 1 : ageDays < 183 ? 0.7 : 0.3;
  const score = weights.w1 * (1 / Math.max(distance, 1)) + weights.w2 * A + weights.w3 * R + weights.w4 * C + weights.w5 * V;
  return {
    ...service,
    distance_m: Math.round(distance),
    eta_seconds: service.eta_seconds ?? Math.max(60, Math.round(distance / 500)),
    mfer_score: Number(score.toFixed(6)),
    mfer_breakdown: { weights, A, R, C, V }
  };
}

export function rankServices(services, origin, options = {}) {
  return services
    .filter((service) => service?.is_active !== false)
    .map((service) => scoreService(service, origin, options))
    .sort((a, b) => b.mfer_score - a.mfer_score || a.eta_seconds - b.eta_seconds)
    .slice(0, options.limit ?? services.length);
}
