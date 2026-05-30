import type { LucideIcon } from "lucide-react";
import {
  Bug,
  Droplets,
  Hammer,
  Paintbrush2,
  Shield,
  ShieldCheck,
  Sofa,
  Sparkles,
  Truck,
  Tv2,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import { getServiceArtwork, getServiceFamily } from "@/lib/serviceBranding";

export function getServiceIcon(serviceSlug: string): LucideIcon {
  const normalized = serviceSlug.toLowerCase();

  if (normalized.includes("cleaning")) {
    return Sparkles;
  }

  if (normalized.includes("electrician")) {
    return Zap;
  }

  if (normalized.includes("plumbing") || normalized.includes("leak")) {
    return Droplets;
  }

  if (normalized.includes("ac-service")) {
    return Wind;
  }

  if (normalized.includes("appliance")) {
    return Tv2;
  }

  if (normalized.includes("carpentry") || normalized.includes("furniture")) {
    return Hammer;
  }

  if (normalized.includes("painting")) {
    return Paintbrush2;
  }

  if (normalized.includes("pest")) {
    return Bug;
  }

  if (normalized.includes("sofa") || normalized.includes("mattress")) {
    return Sofa;
  }

  if (normalized.includes("packers") || normalized.includes("movers")) {
    return Truck;
  }

  if (
    normalized.includes("cctv") ||
    normalized.includes("security") ||
    normalized.includes("bird-netting")
  ) {
    return ShieldCheck;
  }

  if (
    normalized.includes("smart-home") ||
    normalized.includes("inverter") ||
    normalized.includes("home-office")
  ) {
    return Shield;
  }

  return Wrench;
}

const FAMILY_STYLES: Record<
  ReturnType<typeof getServiceFamily>,
  {
    iconWrap: string;
    tint: string;
    border: string;
    imagePosition: string;
  }
> = {
  cleaning: {
    iconWrap: "bg-[#fff4e8] text-orange-600",
    tint: "from-orange-50 to-white",
    border: "border-orange-100",
    imagePosition: "object-[center_42%]",
  },
  electrical: {
    iconWrap: "bg-[#fff4e8] text-orange-600",
    tint: "from-orange-50 to-white",
    border: "border-orange-100",
    imagePosition: "object-[center_28%]",
  },
  plumbing: {
    iconWrap: "bg-[#fff4e8] text-orange-600",
    tint: "from-orange-50 to-white",
    border: "border-orange-100",
    imagePosition: "object-[center_34%]",
  },
  climate: {
    iconWrap: "bg-[#fff4e8] text-orange-600",
    tint: "from-orange-50 to-white",
    border: "border-orange-100",
    imagePosition: "object-[center_32%]",
  },
  craft: {
    iconWrap: "bg-[#fff4e8] text-orange-600",
    tint: "from-orange-50 to-white",
    border: "border-orange-100",
    imagePosition: "object-[center_35%]",
  },
  painting: {
    iconWrap: "bg-[#fff4e8] text-orange-600",
    tint: "from-orange-50 to-white",
    border: "border-orange-100",
    imagePosition: "object-[center_34%]",
  },
  field: {
    iconWrap: "bg-[#fff4e8] text-orange-600",
    tint: "from-orange-50 to-white",
    border: "border-orange-100",
    imagePosition: "object-[center_34%]",
  },
};

export function getServicePresentation(serviceSlug: string, fallbackImage?: string) {
  const family = getServiceFamily(serviceSlug);

  return {
    image: getServiceArtwork(serviceSlug, fallbackImage),
    icon: getServiceIcon(serviceSlug),
    ...FAMILY_STYLES[family],
  };
}
