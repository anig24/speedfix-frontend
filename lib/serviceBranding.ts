export type ServiceFamily =
  | "cleaning"
  | "electrical"
  | "plumbing"
  | "climate"
  | "craft"
  | "painting"
  | "field";

const FAMILY_ARTWORK: Record<ServiceFamily, string> = {
  cleaning: "/services/illustrations/uniform-cleaning.svg",
  electrical: "/services/illustrations/uniform-electrical.svg",
  plumbing: "/services/illustrations/uniform-plumbing.svg",
  climate: "/services/illustrations/uniform-climate.svg",
  craft: "/services/illustrations/uniform-craft.svg",
  painting: "/services/illustrations/uniform-painting.svg",
  field: "/services/illustrations/uniform-field.svg",
};

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
  const family = getServiceFamily(serviceSlug);
  return FAMILY_ARTWORK[family] || fallbackImage || "/services/cleaning.png";
}
