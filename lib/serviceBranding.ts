export type ServiceFamily =
  | "cleaning"
  | "electrical"
  | "plumbing"
  | "climate"
  | "craft"
  | "painting"
  | "field";

const FAMILY_ARTWORK: Record<ServiceFamily, string> = {
  cleaning: "/services/speedfix-cleaning-kitchen.png",
  electrical: "/services/speedfix-electrician-switch.png",
  plumbing: "/services/speedfix-plumbing-sink.png",
  climate: "/services/speedfix-ac-service.png",
  craft: "/services/speedfix-tv-installation.png",
  painting: "/services/cleaning.png",
  field: "/services/cleaning.png",
};

const DIRECT_ARTWORK: Array<{ keywords: string[]; image: string }> = [
  {
    keywords: ["fan-installation", "fan-and-light", "fan"],
    image: "/services/fan-installation.png",
  },
  {
    keywords: [
      "cleaning",
      "kitchen-deep-cleaning",
      "bathroom-deep-cleaning",
      "move-in-cleaning",
      "maid",
      "laundry",
      "sofa",
      "mattress",
      "curtain",
    ],
    image: "/services/speedfix-cleaning-kitchen.png",
  },
  {
    keywords: [
      "electrician",
      "switchboard",
      "socket",
      "wiring",
      "fan",
      "inverter",
      "ups",
    ],
    image: "/services/speedfix-electrician-switch.png",
  },
  {
    keywords: [
      "plumbing",
      "bathroom-plumbing",
      "kitchen-plumbing",
      "drain",
      "leak",
      "waterproofing",
      "water-purifier",
      "purifier",
      "filter",
      "ro-service",
      "uv-lamp",
      "geyser",
    ],
    image: "/services/speedfix-plumbing-sink.png",
  },
  {
    keywords: ["ac-service", "split-ac", "window-ac", "jet-cleaning", "ac-repair"],
    image: "/services/speedfix-ac-service.png",
  },
  {
    keywords: [
      "appliance-repair",
      "appliance-installation",
      "washing-machine",
      "microwave",
      "chimney",
      "multi-appliance",
    ],
    image: "/services/speedfix-appliance-repair.png",
  },
  {
    keywords: ["tv", "cctv", "security", "home-office", "smart-home"],
    image: "/services/speedfix-tv-installation.png",
  },
];

const KEYWORD_TO_FAMILY: Array<{ family: ServiceFamily; keywords: string[] }> = [
  {
    family: "cleaning",
    keywords: [
      "cleaning",
      "laundry",
      "maid",
      "mattress",
      "curtain",
      "sofa",
      "salon",
      "beauty",
      "senior-care",
      "event-setup",
    ],
  },
  {
    family: "electrical",
    keywords: [
      "electrician",
      "cctv",
      "security",
      "smart-home",
      "inverter",
      "ups",
      "fan",
      "home-office",
    ],
  },
  {
    family: "plumbing",
    keywords: ["plumbing", "waterproofing", "bathroom", "drain", "leak"],
  },
  {
    family: "climate",
    keywords: [
      "ac-service",
      "appliance",
      "purifier",
      "geyser",
      "kitchen",
      "washing-machine",
    ],
  },
  {
    family: "craft",
    keywords: [
      "carpentry",
      "furniture",
      "wardrobe",
      "modular-kitchen",
      "false-ceiling",
      "flooring",
      "glass",
      "decor",
      "locksmith",
    ],
  },
  {
    family: "painting",
    keywords: [
      "painting",
      "pest-control",
      "gardening",
      "landscaping",
      "bird-netting",
    ],
  },
  {
    family: "field",
    keywords: [
      "packers",
      "movers",
      "car-detailing",
      "bike-service",
      "inspection",
      "recruiter",
    ],
  },
];

export function getServiceFamily(serviceSlug: string): ServiceFamily {
  const normalized = serviceSlug.toLowerCase();

  const match = KEYWORD_TO_FAMILY.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword))
  );

  return match?.family || "cleaning";
}

export function getServiceArtwork(serviceSlug: string, fallbackImage?: string) {
  const normalized = serviceSlug.toLowerCase();
  const directMatch = DIRECT_ARTWORK.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword))
  );

  if (directMatch) {
    return directMatch.image;
  }

  const family = getServiceFamily(serviceSlug);
  return fallbackImage || FAMILY_ARTWORK[family] || "/services/cleaning.png";
}
