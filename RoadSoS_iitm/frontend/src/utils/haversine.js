export function haversineDistanceMeters(a, b) {
  const toRadians = (value) => (Number(value) * Math.PI) / 180;
  const earthRadiusMeters = 6371000;
  const lat1 = toRadians(a.latitude ?? a.lat);
  const lat2 = toRadians(b.latitude ?? b.lat);
  const deltaLat = toRadians((b.latitude ?? b.lat) - (a.latitude ?? a.lat));
  const deltaLng = toRadians((b.longitude ?? b.lng) - (a.longitude ?? a.lng));
  const h =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
