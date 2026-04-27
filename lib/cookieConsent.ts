const COOKIE_CONSENT_KEY = "speedfix_cookie_consent";
const COOKIE_CONSENT_EVENT = "speedfix-cookie-consent-updated";

function safeWindow() {
  return typeof window !== "undefined" ? window : null;
}

export function readCookieConsent() {
  const win = safeWindow();
  return win?.localStorage.getItem(COOKIE_CONSENT_KEY) || "";
}

export function writeCookieConsent(value: "accepted" | "necessary") {
  const win = safeWindow();

  if (!win) {
    return;
  }

  win.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  win.document.cookie = `speedfix_cookie_consent=${value}; path=/; max-age=31536000; SameSite=Lax`;
  win.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}

export function subscribeToCookieConsent(listener: () => void) {
  const win = safeWindow();

  if (!win) {
    return () => undefined;
  }

  const handleConsentChange = () => listener();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === COOKIE_CONSENT_KEY) {
      listener();
    }
  };

  win.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
  win.addEventListener("storage", handleStorage);

  return () => {
    win.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
    win.removeEventListener("storage", handleStorage);
  };
}
