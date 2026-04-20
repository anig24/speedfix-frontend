export type ServicePackage = {
  name: string;
  price: number;
  description: string;
  turnaround: string;
  checklist: string[];
};

export type ServiceAddon = {
  name: string;
  price: number;
};

export type ServiceCatalogItem = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  rating: number;
  reviews: string;
  jobsCompleted: string;
  responseTime: string;
  basePrice: number;
  coverage: string;
  highlights: string[];
  problemsSolved: string[];
  packages: ServicePackage[];
  addons: ServiceAddon[];
  searchTerms: string[];
};

export const serviceCatalog: ServiceCatalogItem[] = [
  {
    slug: "cleaning",
    name: "Home Cleaning",
    tagline: "Deep, move-in and recurring cleaning delivered by trained crews.",
    description:
      "Give every room a reset with apartment and villa cleaning designed for busy homes, tenants and managed communities.",
    image: "/services/cleaning.png",
    rating: 4.9,
    reviews: "1.8k reviews",
    jobsCompleted: "18k homes served",
    responseTime: "Same-day slots in top pincodes",
    basePrice: 1499,
    coverage: "Kitchen, bathroom, bedrooms and living areas",
    highlights: [
      "Background-checked cleaning partners",
      "On-app tracking and ETA updates",
      "Checklist-based quality handoff",
    ],
    problemsSolved: [
      "Move-in or move-out cleaning",
      "Post-renovation dust removal",
      "Weekend deep cleaning before guests arrive",
    ],
    packages: [
      {
        name: "Refresh",
        price: 1499,
        description: "A focused clean for occupied homes that need a quick reset.",
        turnaround: "2 to 3 hours",
        checklist: [
          "Living room dusting and vacuuming",
          "Bathroom and kitchen wipe-down",
          "Floor mopping across main areas",
        ],
      },
      {
        name: "Deep Clean",
        price: 2499,
        description: "The most-booked package for monthly hygiene and upkeep.",
        turnaround: "4 to 5 hours",
        checklist: [
          "Appliance exterior cleaning",
          "Detailed bathroom descaling",
          "Wardrobe and surface dust extraction",
        ],
      },
      {
        name: "Move-In Ready",
        price: 3899,
        description: "Designed for vacant homes and handover cleaning.",
        turnaround: "6 to 8 hours",
        checklist: [
          "Window and grill cleaning",
          "Cabinet interior cleaning",
          "Floor edge detailing room by room",
        ],
      },
    ],
    addons: [
      { name: "Sofa shampooing", price: 699 },
      { name: "Balcony detailing", price: 299 },
      { name: "Fridge interior cleaning", price: 249 },
    ],
    searchTerms: ["cleaning", "deep clean", "maid", "housekeeping"],
  },
  {
    slug: "electrician",
    name: "Electrician",
    tagline: "Fault diagnostics, fittings and minor electrical work at home.",
    description:
      "From switchboards and fans to urgent breakdowns, get verified electricians with transparent pricing and digital job notes.",
    image: "/services/electrician.png",
    rating: 4.8,
    reviews: "2.4k reviews",
    jobsCompleted: "21k electrical jobs",
    responseTime: "Urgent response in 90 minutes",
    basePrice: 199,
    coverage: "Switches, lights, boards, fans and minor wiring",
    highlights: [
      "Price cards before work starts",
      "Photo proof and material notes",
      "Emergency slots for active faults",
    ],
    problemsSolved: [
      "Faulty switches and sockets",
      "Fan installation and replacement",
      "Power trip diagnostics for a room or floor",
    ],
    packages: [
      {
        name: "Inspection Visit",
        price: 199,
        description: "Best when you need diagnosis before approving repair work.",
        turnaround: "30 to 45 minutes",
        checklist: [
          "Issue inspection and root-cause diagnosis",
          "Repair estimate and parts recommendation",
          "Safety check for the affected area",
        ],
      },
      {
        name: "Repair Visit",
        price: 449,
        description: "Ideal for common electrical issues in occupied homes.",
        turnaround: "60 to 90 minutes",
        checklist: [
          "Repair of one core issue",
          "Minor fitting alignment and testing",
          "Post-work power restore check",
        ],
      },
      {
        name: "Multi-Point Upgrade",
        price: 899,
        description: "For a bundle of fixes in one visit with better value.",
        turnaround: "2 to 3 hours",
        checklist: [
          "Up to five switch/socket replacements",
          "Fan or light fixture installation",
          "End-to-end testing and cleanup",
        ],
      },
    ],
    addons: [
      { name: "Fan installation", price: 149 },
      { name: "MCB replacement", price: 349 },
      { name: "Evening emergency slot", price: 249 },
    ],
    searchTerms: ["electrician", "switch", "socket", "wiring", "fan"],
  },
  {
    slug: "plumbing",
    name: "Plumbing",
    tagline: "Leak fixes, fittings and bathroom or kitchen plumbing on demand.",
    description:
      "Book plumbers for quick leak resolution, tap replacements and drain issues with slot-based arrival and live updates.",
    image: "/services/plumbing.png",
    rating: 4.8,
    reviews: "1.6k reviews",
    jobsCompleted: "14k plumbing jobs",
    responseTime: "Slots from morning to late evening",
    basePrice: 249,
    coverage: "Bathroom, kitchen, utility and terrace plumbing",
    highlights: [
      "Leak and blockage specialists",
      "Material pickup support on request",
      "Digital job history for repeat issues",
    ],
    problemsSolved: [
      "Leaking taps and flush tanks",
      "Kitchen sink clogging",
      "Pipe drips causing wall dampness",
    ],
    packages: [
      {
        name: "Quick Fix",
        price: 249,
        description: "A fast visit for one minor repair or replacement.",
        turnaround: "30 to 60 minutes",
        checklist: [
          "One tap, jet spray or flush repair",
          "Leak isolation and testing",
          "Basic cleanup after work",
        ],
      },
      {
        name: "Bathroom Rescue",
        price: 699,
        description: "For bathroom leaks, fittings and water-flow issues.",
        turnaround: "90 to 120 minutes",
        checklist: [
          "Up to three plumbing tasks in one bathroom",
          "Sealant and fitting alignment",
          "Drain and flush performance check",
        ],
      },
      {
        name: "Kitchen Line Service",
        price: 899,
        description: "The right option for deeper sink and connection issues.",
        turnaround: "2 to 3 hours",
        checklist: [
          "Sink trap cleaning or replacement",
          "Tap and inlet line inspection",
          "Pressure and leak test after repair",
        ],
      },
    ],
    addons: [
      { name: "Drain descaling", price: 299 },
      { name: "Flexible pipe replacement", price: 199 },
      { name: "Water pressure check", price: 149 },
    ],
    searchTerms: ["plumbing", "plumber", "leak", "tap", "drain"],
  },
  {
    slug: "ac-service",
    name: "AC Service",
    tagline: "General service, jet wash and gas checkups for home ACs.",
    description:
      "Keep cooling efficient with preventive AC servicing, fault checks and repair-ready escalation for split and window units.",
    image: "/services/ac-service.png",
    rating: 4.7,
    reviews: "3.1k reviews",
    jobsCompleted: "24k AC visits",
    responseTime: "Next-slot availability during peak season",
    basePrice: 499,
    coverage: "Split AC, window AC and office cabin units",
    highlights: [
      "Cooling performance diagnostics",
      "Filter and coil hygiene routines",
      "Digital job card for annual repeat service",
    ],
    problemsSolved: [
      "Weak cooling and bad odor",
      "Water leakage from indoor unit",
      "Annual maintenance before summer rush",
    ],
    packages: [
      {
        name: "General Service",
        price: 499,
        description: "Routine maintenance to improve cooling efficiency.",
        turnaround: "45 to 60 minutes",
        checklist: [
          "Filter cleaning and airflow test",
          "Basic indoor and outdoor wash",
          "Cooling output and noise inspection",
        ],
      },
      {
        name: "Jet Service",
        price: 899,
        description: "Deep service for units with heavy dust or water issues.",
        turnaround: "60 to 90 minutes",
        checklist: [
          "High-pressure indoor coil cleaning",
          "Drain tray and pipe flush",
          "Post-service cooling calibration",
        ],
      },
      {
        name: "Repair Diagnosis",
        price: 699,
        description: "Ideal when your AC is tripping, leaking or not cooling.",
        turnaround: "60 to 90 minutes",
        checklist: [
          "Electrical and gas pressure diagnosis",
          "Component inspection and estimate",
          "Repair recommendation summary",
        ],
      },
    ],
    addons: [
      { name: "Gas top-up inspection", price: 299 },
      { name: "Foam wash for outdoor unit", price: 199 },
      { name: "Drain pipe extension", price: 249 },
    ],
    searchTerms: ["ac", "air conditioner", "cooling", "leakage", "jet wash"],
  },
  {
    slug: "appliance-repair",
    name: "Appliance Repair",
    tagline: "Diagnosis and repair support for kitchen and daily-use appliances.",
    description:
      "Book professional visits for washing machine, microwave, chimney and other appliance issues with digital inspection summaries.",
    image: "/services/appliance-repair.png",
    rating: 4.7,
    reviews: "1.1k reviews",
    jobsCompleted: "9k appliance repairs",
    responseTime: "Inspection visits across major neighborhoods",
    basePrice: 299,
    coverage: "Kitchen, laundry and small home appliances",
    highlights: [
      "Repair-first approach before replacement",
      "Visit notes shared with issue summary",
      "Parts sourcing support where possible",
    ],
    problemsSolved: [
      "Washing machine not spinning",
      "Microwave heating issues",
      "Chimney servicing and low suction",
    ],
    packages: [
      {
        name: "Inspection Visit",
        price: 299,
        description: "Best when the issue is unclear and needs diagnosis first.",
        turnaround: "45 to 60 minutes",
        checklist: [
          "Issue diagnosis for one appliance",
          "Repair estimate and expected timeline",
          "Safety and wiring check if relevant",
        ],
      },
      {
        name: "Service and Clean",
        price: 699,
        description: "For preventive servicing of working appliances.",
        turnaround: "60 to 90 minutes",
        checklist: [
          "External and functional cleaning",
          "Core moving-part inspection",
          "Performance and safety verification",
        ],
      },
      {
        name: "Repair Plus",
        price: 1199,
        description: "For households bundling diagnosis and one common repair.",
        turnaround: "90 to 150 minutes",
        checklist: [
          "Diagnosis and one approved repair",
          "Minor alignment or fitting adjustment",
          "Operational testing after work",
        ],
      },
    ],
    addons: [
      { name: "Second appliance check", price: 199 },
      { name: "Part pickup assistance", price: 249 },
      { name: "Weekend priority slot", price: 199 },
    ],
    searchTerms: ["appliance", "repair", "washing machine", "chimney", "microwave"],
  },
  {
    slug: "fan-installation",
    name: "Fan Installation",
    tagline: "Ceiling fan installation, replacement and balancing support.",
    description:
      "Swap or install ceiling fans safely with trained electricians who can also handle regulator and bracket adjustments.",
    image: "/services/fan-installation.png",
    rating: 4.8,
    reviews: "780 reviews",
    jobsCompleted: "6k fan installs",
    responseTime: "Fast evening and weekend slots",
    basePrice: 249,
    coverage: "Ceiling fan, wall fan and regulator replacement",
    highlights: [
      "Safety-first ladder and fitting workflow",
      "Noise and wobble reduction checks",
      "Ideal for new move-ins and upgrades",
    ],
    problemsSolved: [
      "New fan installation in one room",
      "Old fan replacement with balancing",
      "Loose regulator or noisy running",
    ],
    packages: [
      {
        name: "Single Fan Install",
        price: 249,
        description: "One standard installation or replacement with testing.",
        turnaround: "30 to 45 minutes",
        checklist: [
          "One fan mount and balancing",
          "Regulator and wiring check",
          "Basic cleanup after work",
        ],
      },
      {
        name: "Double Room Setup",
        price: 449,
        description: "Great for new homes or room upgrade projects.",
        turnaround: "60 to 90 minutes",
        checklist: [
          "Installation of two fans",
          "Speed regulator testing",
          "Noise and wobble calibration",
        ],
      },
      {
        name: "Install and Upgrade",
        price: 699,
        description: "For multi-point work that includes fittings and accessories.",
        turnaround: "90 to 120 minutes",
        checklist: [
          "Up to two fans plus one fitting task",
          "Bracket and anchor reinforcement",
          "Final safety and performance check",
        ],
      },
    ],
    addons: [
      { name: "Regulator replacement", price: 149 },
      { name: "False ceiling mounting", price: 249 },
      { name: "Old fan dismantling", price: 99 },
    ],
    searchTerms: ["fan", "installation", "ceiling fan", "regulator"],
  },
];

const serviceAliases: Record<string, string> = {
  appliance: "appliance-repair",
  "fan-installing": "fan-installation",
};

export const operatingCities = [
  "Bengaluru",
  "Mumbai",
  "Delhi NCR",
  "Hyderabad",
  "Chennai",
  "Pune",
];

export function resolveServiceSlug(slug: string) {
  return serviceAliases[slug] ?? slug;
}

export function getServiceBySlug(slug: string) {
  const resolvedSlug = resolveServiceSlug(slug);
  return serviceCatalog.find((service) => service.slug === resolvedSlug);
}
