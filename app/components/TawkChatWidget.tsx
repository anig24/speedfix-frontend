"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const DEFAULT_TAWK_EMBED_URL =
  "https://embed.tawk.to/69fafbb604c2b71c35758879/1jnu6eh55";

declare global {
  interface Window {
    Tawk_API?: {
      onLoad?: () => void;
      maximize?: () => void;
      minimize?: () => void;
      showWidget?: () => void;
      hideWidget?: () => void;
      shutdown?: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}

const INTERNAL_ROUTE_PREFIXES = [
  "/accounts",
  "/admin",
  "/agent",
  "/agent-login",
  "/api",
  "/audit",
  "/corporate",
  "/corporate-login",
  "/corporateStaff",
  "/dashboard",
  "/entry",
  "/executive",
  "/founder",
  "/hr",
  "/management",
  "/operations",
  "/support",
  "/technician",
];

function isCustomerRoute(pathname: string) {
  return !INTERNAL_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export default function TawkChatWidget() {
  const pathname = usePathname();

  useEffect(() => {
    const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID?.trim();
    const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID?.trim();
    const embedUrl =
      process.env.NEXT_PUBLIC_TAWK_EMBED_URL?.trim() ||
      (propertyId && widgetId
        ? `https://embed.tawk.to/${propertyId}/${widgetId}`
        : propertyId
          ? `https://embed.tawk.to/${propertyId}/default`
          : DEFAULT_TAWK_EMBED_URL);

    if (!pathname || !embedUrl) {
      return;
    }

    const syncWidgetVisibility = () => {
      if (!window.Tawk_API) {
        return;
      }

      if (isCustomerRoute(pathname)) {
        window.Tawk_API.showWidget?.();
        window.Tawk_API.minimize?.();
        return;
      }

      window.Tawk_API.minimize?.();
      window.Tawk_API.hideWidget?.();
    };

    if (!isCustomerRoute(pathname)) {
      syncWidgetVisibility();
      return;
    }

    const timer = window.setTimeout(() => {
      window.Tawk_API = window.Tawk_API || {};

      const existingOnLoad = window.Tawk_API.onLoad;
      window.Tawk_API.onLoad = () => {
        existingOnLoad?.();
        syncWidgetVisibility();
      };

      if (document.getElementById("speedfix-tawk-widget")) {
        syncWidgetVisibility();
        return;
      }

      window.Tawk_LoadStart = new Date();

      const script = document.createElement("script");
      script.id = "speedfix-tawk-widget";
      script.async = true;
      script.src = embedUrl;
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");

      document.body.appendChild(script);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
