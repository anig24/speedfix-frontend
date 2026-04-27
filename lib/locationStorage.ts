const CITY_KEY = "city";
const CITY_EVENT = "speedfix-city-updated";
const LATITUDE_KEY = "customer_latitude";
const LONGITUDE_KEY = "customer_longitude";

function safeWindow() {
  return typeof window !== "undefined" ? window : null;
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

  win.localStorage.setItem(CITY_KEY, city);

  if (coordinates) {
    win.localStorage.setItem(LATITUDE_KEY, String(coordinates.latitude));
    win.localStorage.setItem(LONGITUDE_KEY, String(coordinates.longitude));
  }

  win.dispatchEvent(new Event(CITY_EVENT));
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
