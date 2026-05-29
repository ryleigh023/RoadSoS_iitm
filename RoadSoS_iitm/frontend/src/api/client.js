import { getOfflinePack, enqueueIncident } from "../utils/storage";
import { rankServices } from "../utils/mfer";

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { "content-type": "application/json", ...(options.headers || {}) },
    ...options,
    body: options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body
  });
  if (!response.ok) throw new Error(`${path} failed: ${response.status}`);
  return response.json();
}

export async function fetchNearbyServices({ lat, lng, radius = 10000, types = "", severity = "HIGH" }) {
  if (!navigator.onLine) {
    const pack = await getOfflinePack();
    const origin = { latitude: lat, longitude: lng };
    return { offline: true, services: rankServices(pack?.services || [], origin, { severity, limit: 80 }) };
  }
  return request(`/api/services/nearby?lat=${lat}&lng=${lng}&radius=${radius}&types=${types}&severity=${severity}`);
}

export async function fetchOfflinePack({ lat, lng, radius = 50000 }) {
  return request(`/api/services/offline-pack?lat=${lat}&lng=${lng}&radius=${radius}`);
}

export async function submitIncident(report) {
  if (!navigator.onLine) {
    await enqueueIncident(report);
    return { queued: true, incident_id: "offline-queued" };
  }
  return request("/api/incident/report", { method: "POST", body: report });
}

export async function fetchHeatmap({ lat, lng, radius = 50000 }) {
  return request(`/api/heatmap/accidents?lat=${lat}&lng=${lng}&radius=${radius}`);
}

export async function triage(message, profile) {
  return request("/api/triage", { method: "POST", body: { message, profile } });
}
