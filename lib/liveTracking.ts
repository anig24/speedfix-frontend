export type Coordinates = {
  latitude: number;
  longitude: number;
};

function normalizeNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function extractCoordinatesFromValue(value: unknown): Coordinates | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value as Record<string, unknown>;
  const latitude =
    normalizeNumber(raw.latitude) ??
    normalizeNumber(raw.lat) ??
    normalizeNumber(raw._latitude);
  const longitude =
    normalizeNumber(raw.longitude) ??
    normalizeNumber(raw.lng) ??
    normalizeNumber(raw.lon) ??
    normalizeNumber(raw._longitude);

  if (latitude === null || longitude === null) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
}

export function extractCoordinates(...sources: unknown[]) {
  for (const source of sources) {
    const coordinates = extractCoordinatesFromValue(source);

    if (coordinates) {
      return coordinates;
    }
  }

  return null;
}

export function calculateDistanceKm(
  origin: Coordinates,
  destination: Coordinates
) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const deltaLatitude = toRadians(destination.latitude - origin.latitude);
  const deltaLongitude = toRadians(destination.longitude - origin.longitude);
  const startLatitude = toRadians(origin.latitude);
  const endLatitude = toRadians(destination.latitude);

  const haversine =
    Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
    Math.sin(deltaLongitude / 2) *
      Math.sin(deltaLongitude / 2) *
      Math.cos(startLatitude) *
      Math.cos(endLatitude);

  const arc = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  return earthRadiusKm * arc;
}
