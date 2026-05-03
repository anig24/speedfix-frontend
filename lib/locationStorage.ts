const CITY_KEY = "city";
const CITY_EVENT = "speedfix-city-updated";
const LATITUDE_KEY = "customer_latitude";
const LONGITUDE_KEY = "customer_longitude";
const AUTO_DETECT_ATTEMPT_KEY = "speedfix_city_autodetect_attempted";

const CITY_ALIASES: Record<string, string> = {
  bangalore: "Bengaluru",
  bengaluru: "Bengaluru",
  calcutta: "Kolkata",
  kolkata: "Kolkata",
  delhi: "Delhi NCR",
  "new delhi": "Delhi NCR",
};

function safeWindow() {
  return typeof window !== "undefined" ? window : null;
}

export function normalizeCityLabel(city: string) {
  const trimmed = city.trim();

  if (!trimmed) {
    return "";
  }

  const normalized = CITY_ALIASES[trimmed.toLowerCase()];
  return normalized || trimmed;
}

export function readStoredCity() {
  const win = safeWindow();
  return win?.localStorage.getItem(CITY_KEY) || "";
}

export function writeStoredCity(city: string) {
  writeStoredLocation(city);
}

export function writeStoredLocation(
  city: string,
  coordinates?: { latitude: number; longitude: number } | null
) {
  const win = safeWindow();

  if (!win) {
    return;
  }

  win.localStorage.setItem(CITY_KEY, normalizeCityLabel(city));

  if (coordinates) {
    win.localStorage.setItem(LATITUDE_KEY, String(coordinates.latitude));
    win.localStorage.setItem(LONGITUDE_KEY, String(coordinates.longitude));
  }

  win.dispatchEvent(new Event(CITY_EVENT));
}

export function hasAttemptedCityAutoDetect() {
  const win = safeWindow();
  return win?.localStorage.getItem(AUTO_DETECT_ATTEMPT_KEY) === "true";
}

export function markCityAutoDetectAttempted() {
  const win = safeWindow();

  if (!win) {
    return;
  }

  win.localStorage.setItem(AUTO_DETECT_ATTEMPT_KEY, "true");
}

export async function reverseGeocodeCity(
  latitude: number,
  longitude: number
) {
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  );

  if (!response.ok) {
    throw new Error("Reverse geocode failed");
  }

  const data = await response.json();
  const detectedCity =
    typeof data.city === "string" && data.city.trim()
      ? data.city
      : typeof data.locality === "string" && data.locality.trim()
        ? data.locality
        : typeof data.principalSubdivision === "string" && data.principalSubdivision.trim()
          ? data.principalSubdivision
          : "Unknown";

  return normalizeCityLabel(detectedCity);
}

export async function detectAndStoreCurrentCity() {
  const win = safeWindow();

  if (!win || !navigator.geolocation) {
    throw new Error("Geolocation unavailable");
  }

  return new Promise<string>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        try {
          const city = await reverseGeocodeCity(
            coordinates.latitude,
            coordinates.longitude
          );

          writeStoredLocation(city, coordinates);
          resolve(city);
        } catch (error) {
          reject(error);
        }
      },
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
}

export function readStoredCoordinates() {
  const win = safeWindow();

  if (!win) {
    return null;
  }

  const latitude = Number(win.localStorage.getItem(LATITUDE_KEY));
  const longitude = Number(win.localStorage.getItem(LONGITUDE_KEY));

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
}

export function subscribeToStoredCity(listener: () => void) {
  const win = safeWindow();

  if (!win) {
    return () => undefined;
  }

  const handleCityChange = () => listener();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === CITY_KEY) {
      listener();
    }
  };

  win.addEventListener(CITY_EVENT, handleCityChange);
  win.addEventListener("storage", handleStorage);

  return () => {
    win.removeEventListener(CITY_EVENT, handleCityChange);
    win.removeEventListener("storage", handleStorage);
  };
}
