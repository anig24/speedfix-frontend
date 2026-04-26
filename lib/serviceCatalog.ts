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

export type ServiceSubcategory = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  starterPrice: number;
  turnaround: string;
  recommendedPackage: string;
  highlights: string[];
  included: string[];
  problemSignals: string[];
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
  offer: string;
  subcategories: ServiceSubcategory[];
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
    offer: "Weekend deep cleaning slots fill fastest",
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
    subcategories: [
      {
        slug: "full-home-deep-cleaning",
        name: "Full Home Deep Cleaning",
        tagline: "A room-by-room reset for occupied apartments and villas.",
        description:
          "Ideal for monthly upkeep, guest prep, or a home reset before a busy week starts.",
        starterPrice: 1499,
        turnaround: "3 to 5 hours",
        recommendedPackage: "Deep Clean",
        highlights: [
          "Best-selling residential cleaning option",
          "Perfect for regular premium upkeep",
          "Works well for 2BHK and 3BHK homes",
        ],
        included: [
          "Bedroom and living area detailing",
          "Dust extraction from reachable surfaces",
          "Wet mopping across all main zones",
        ],
        problemSignals: [
          "Dust buildup across multiple rooms",
          "Guests arriving this weekend",
          "Home feels tired and cluttered",
        ],
      },
      {
        slug: "kitchen-deep-cleaning",
        name: "Kitchen Deep Cleaning",
        tagline: "Degreasing, cabinet wipe-down, and appliance exterior care.",
        description:
          "Built for hardworking kitchens that need more than a quick wipe before daily cooking starts again.",
        starterPrice: 1199,
        turnaround: "2 to 3 hours",
        recommendedPackage: "Refresh",
        highlights: [
          "Focused degreasing workflow",
          "Useful before festivals or hosting",
          "Works as a standalone upgrade",
        ],
        included: [
          "Countertop and hob detailing",
          "Cabinet exterior and handle cleaning",
          "Sink and backsplash cleanup",
        ],
        problemSignals: [
          "Oil buildup around the cooking area",
          "Cabinets and tiles feel sticky",
          "Daily upkeep is no longer enough",
        ],
      },
      {
        slug: "bathroom-deep-cleaning",
        name: "Bathroom Deep Cleaning",
        tagline: "Descaling and stain removal for premium bathroom hygiene.",
        description:
          "A high-detail cleaning routine focused on fittings, tiles, glass, and heavy-use bathroom surfaces.",
        starterPrice: 999,
        turnaround: "90 minutes",
        recommendedPackage: "Refresh",
        highlights: [
          "Popular add-on for family homes",
          "Great for stain-heavy bathrooms",
          "Restores shine to core fittings",
        ],
        included: [
          "Tile and fitting descaling",
          "Mirror and glass wipe-down",
          "Floor edge and drain cleaning",
        ],
        problemSignals: [
          "Water marks and soap stains keep returning",
          "Bathroom smell lingers after routine cleaning",
          "Heavy use has dulled the finish",
        ],
      },
      {
        slug: "move-in-cleaning",
        name: "Move-In Cleaning",
        tagline: "Vacant-home cleaning before handover or new occupancy.",
        description:
          "Designed for empty flats and houses that need a polished, ready-to-live-in finish before keys change hands.",
        starterPrice: 3899,
        turnaround: "6 to 8 hours",
        recommendedPackage: "Move-In Ready",
        highlights: [
          "Best fit for vacant homes",
          "Covers hidden dust after interiors work",
          "Great before shifting day",
        ],
        included: [
          "Cabinet and shelf interior cleaning",
          "Window and grill detailing",
          "Final handover-ready floor clean",
        ],
        problemSignals: [
          "You are moving in this week",
          "Construction dust is still present",
          "The home is vacant but not ready yet",
        ],
      },
    ],
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
    offer: "Emergency evening slots available in key zones",
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
    subcategories: [
      {
        slug: "switchboard-repairs",
        name: "Switchboard Repairs",
        tagline: "Fix hot plates, loose switches, and burnt modules safely.",
        description:
          "A focused visit for faulty switchboards, plates, modules, and minor rewiring issues that need immediate attention.",
        starterPrice: 199,
        turnaround: "30 to 60 minutes",
        recommendedPackage: "Repair Visit",
        highlights: [
          "High-demand electrical quick fix",
          "Useful for recurring small faults",
          "Great for apartment maintenance",
        ],
        included: [
          "Board inspection",
          "Minor replacement and testing",
          "Safety check before handoff",
        ],
        problemSignals: [
          "Switches spark or heat up",
          "A plate is loose or not working",
          "Modules fail repeatedly in the same room",
        ],
      },
      {
        slug: "fan-and-light-installation",
        name: "Fan and Light Installation",
        tagline: "Get fan, chandelier, tube light, and fixture installs handled cleanly.",
        description:
          "Built for new-home setups, fixture replacements, and bundled installation jobs that need neat finishing.",
        starterPrice: 449,
        turnaround: "60 to 90 minutes",
        recommendedPackage: "Multi-Point Upgrade",
        highlights: [
          "Perfect for move-ins and upgrades",
          "Supports bundled fitting work",
          "Useful for multiple-room installs",
        ],
        included: [
          "Fixture mounting",
          "Wiring and load test",
          "Alignment and finishing check",
        ],
        problemSignals: [
          "You bought new lights or fans",
          "Current fittings are outdated",
          "Multiple rooms need installation support",
        ],
      },
      {
        slug: "socket-and-wiring-fixes",
        name: "Socket and Wiring Fixes",
        tagline: "Restore dead sockets, loose ports, and unstable points.",
        description:
          "For rooms where one or two power points have stopped working or need deeper wiring attention.",
        starterPrice: 249,
        turnaround: "45 to 75 minutes",
        recommendedPackage: "Repair Visit",
        highlights: [
          "Useful for home office reliability",
          "Best for recurring point failures",
          "Covers common residential socket issues",
        ],
        included: [
          "Socket and point testing",
          "Minor wire correction",
          "Load validation after repair",
        ],
        problemSignals: [
          "Sockets are dead in one wall",
          "Charging ports keep failing",
          "Wiring smells or crackles lightly",
        ],
      },
      {
        slug: "power-trip-diagnostics",
        name: "Power Trip Diagnostics",
        tagline: "Investigate repeated tripping and isolate the risky circuit.",
        description:
          "A diagnostic-first service for repeated trips, partial blackouts, and room-level electrical instability.",
        starterPrice: 299,
        turnaround: "45 to 90 minutes",
        recommendedPackage: "Inspection Visit",
        highlights: [
          "Best for urgent troubleshooting",
          "Helps prevent repeat electrical issues",
          "Strong fit for older homes",
        ],
        included: [
          "Circuit inspection",
          "Load and trip-point check",
          "Repair recommendation summary",
        ],
        problemSignals: [
          "MCB keeps tripping",
          "One room loses power often",
          "Electrical load feels unstable",
        ],
      },
    ],
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
    offer: "Leak rescue slots open across core urban zones",
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
    subcategories: [
      {
        slug: "bathroom-plumbing",
        name: "Bathroom Plumbing",
        tagline: "Repairs for taps, flush systems, showers, and bathroom fittings.",
        description:
          "A bathroom-focused visit for leaks, low flow, loose fittings, and common water-line fixes.",
        starterPrice: 249,
        turnaround: "45 to 90 minutes",
        recommendedPackage: "Bathroom Rescue",
        highlights: [
          "Popular for family homes",
          "Handles multiple bathroom issues in one slot",
          "Great for older fittings and seals",
        ],
        included: [
          "Tap, shower, and flush inspection",
          "Leak isolation and alignment",
          "Water flow and drainage test",
        ],
        problemSignals: [
          "The flush is weak or leaking",
          "Shower mixer performance has dropped",
          "Bathroom fittings wobble or drip",
        ],
      },
      {
        slug: "kitchen-plumbing",
        name: "Kitchen Plumbing",
        tagline: "Sink, tap, filter line, and inlet repairs for busy kitchens.",
        description:
          "A kitchen-first repair service designed for sink leaks, tap issues, drainage trouble, and utility line fixes.",
        starterPrice: 349,
        turnaround: "60 to 120 minutes",
        recommendedPackage: "Kitchen Line Service",
        highlights: [
          "Great for daily-use kitchens",
          "Useful for recurring sink trouble",
          "Strong choice before hosting or festive prep",
        ],
        included: [
          "Sink trap inspection",
          "Inlet and outlet line review",
          "Connection leak test",
        ],
        problemSignals: [
          "Water gathers under the sink",
          "The kitchen tap drips all day",
          "Water flow has become inconsistent",
        ],
      },
      {
        slug: "drain-and-blockage",
        name: "Drain and Blockage",
        tagline: "Clear slow drains before they turn into an emergency.",
        description:
          "For bathrooms, utility areas, and kitchens where water drains slowly or backs up during heavy use.",
        starterPrice: 299,
        turnaround: "45 to 75 minutes",
        recommendedPackage: "Quick Fix",
        highlights: [
          "Best for nuisance drain issues",
          "Good preventive visit before overflow starts",
          "Useful for terraces and utility points too",
        ],
        included: [
          "Drain opening inspection",
          "Minor blockage clearing",
          "Flow check after service",
        ],
        problemSignals: [
          "Water pools around the drain",
          "The sink empties slowly",
          "Bad smell rises from a drain point",
        ],
      },
      {
        slug: "leak-repair",
        name: "Leak Repair",
        tagline: "Stop dripping pipes and hidden dampness before damage spreads.",
        description:
          "A targeted leak service for exposed lines, concealed warning signs, and fittings that waste water daily.",
        starterPrice: 299,
        turnaround: "45 to 90 minutes",
        recommendedPackage: "Quick Fix",
        highlights: [
          "Great for recurring wall dampness",
          "Useful before repainting",
          "Prevents hidden water loss over time",
        ],
        included: [
          "Leak source diagnosis",
          "Connection tightening or fix",
          "Pressure and drip recheck",
        ],
        problemSignals: [
          "Walls show fresh damp patches",
          "Pipes drip under pressure",
          "You hear water but cannot spot the source",
        ],
      },
    ],
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
    offer: "Pre-summer service slots are moving fast",
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
    subcategories: [
      {
        slug: "split-ac-service",
        name: "Split AC Service",
        tagline: "Routine cleaning and performance tuning for split units.",
        description:
          "A focused maintenance option for split AC owners who want better cooling and smoother everyday performance.",
        starterPrice: 499,
        turnaround: "45 to 60 minutes",
        recommendedPackage: "General Service",
        highlights: [
          "The standard seasonal service choice",
          "Good for pre-summer maintenance",
          "Most useful every 3 to 4 months",
        ],
        included: [
          "Filter and basic coil care",
          "Airflow performance check",
          "Cooling output review",
        ],
        problemSignals: [
          "Cooling is weaker than last month",
          "AC smells stale when switched on",
          "You want preventive maintenance before peak heat",
        ],
      },
      {
        slug: "window-ac-service",
        name: "Window AC Service",
        tagline: "Dedicated cleaning and diagnosis for compact window units.",
        description:
          "Designed for smaller homes and older cooling units that need better upkeep and more frequent checks.",
        starterPrice: 549,
        turnaround: "45 to 75 minutes",
        recommendedPackage: "General Service",
        highlights: [
          "Useful for older AC stock",
          "Great for rental homes and bedrooms",
          "Focuses on airflow and cooling stability",
        ],
        included: [
          "Filter and panel cleaning",
          "Noise and cooling test",
          "Basic external wash",
        ],
        problemSignals: [
          "The room cools too slowly",
          "The unit sounds louder than before",
          "It has been a long time since the last service",
        ],
      },
      {
        slug: "jet-cleaning",
        name: "Jet Cleaning",
        tagline: "Deep cleaning for heavily used ACs with dust or water issues.",
        description:
          "A stronger cleaning workflow for AC units that need more than a regular service to recover performance.",
        starterPrice: 899,
        turnaround: "60 to 90 minutes",
        recommendedPackage: "Jet Service",
        highlights: [
          "Best for dusty urban homes",
          "Useful after long non-service gaps",
          "Great before summer peaks",
        ],
        included: [
          "High-pressure indoor coil cleaning",
          "Drain tray and pipe flush",
          "Performance check after service",
        ],
        problemSignals: [
          "Water leaks from the indoor unit",
          "Cooling has dropped sharply",
          "Dust buildup is clearly visible",
        ],
      },
      {
        slug: "ac-repair",
        name: "AC Repair",
        tagline: "Diagnosis for tripping, leaking, and weak-cooling complaints.",
        description:
          "A diagnosis-led visit for ACs that are not working properly and need repair planning before parts approval.",
        starterPrice: 699,
        turnaround: "60 to 90 minutes",
        recommendedPackage: "Repair Diagnosis",
        highlights: [
          "Best for fault isolation",
          "Useful before approving bigger repair work",
          "Covers common performance complaints",
        ],
        included: [
          "Electrical and cooling diagnosis",
          "Parts and repair recommendation",
          "Issue summary with next steps",
        ],
        problemSignals: [
          "AC trips when it starts",
          "Cooling has stopped almost completely",
          "You need repair cost clarity before deciding",
        ],
      },
    ],
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
    offer: "Book a bundled inspection for multi-appliance homes",
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
    subcategories: [
      {
        slug: "washing-machine-repair",
        name: "Washing Machine Repair",
        tagline: "Diagnosis and common repairs for top-load and front-load units.",
        description:
          "A targeted repair service for wash-cycle failures, drainage trouble, vibration, or spin problems.",
        starterPrice: 299,
        turnaround: "45 to 75 minutes",
        recommendedPackage: "Inspection Visit",
        highlights: [
          "Most common appliance request",
          "Useful for drainage and spin complaints",
          "Suitable for semi-automatic and automatic machines",
        ],
        included: [
          "Functional issue diagnosis",
          "Drum and drainage inspection",
          "Repair cost estimate if needed",
        ],
        problemSignals: [
          "Machine does not spin",
          "Water is not draining",
          "The wash cycle stops mid-way",
        ],
      },
      {
        slug: "microwave-repair",
        name: "Microwave Repair",
        tagline: "Fix heating, door, and control issues in everyday microwave use.",
        description:
          "A diagnosis-first visit for microwaves that have stopped heating, show erratic controls, or need basic repair planning.",
        starterPrice: 299,
        turnaround: "45 to 60 minutes",
        recommendedPackage: "Inspection Visit",
        highlights: [
          "Best for quick kitchen appliance checks",
          "Great before replacement decisions",
          "Useful for premium built-in units too",
        ],
        included: [
          "Heating and panel diagnosis",
          "Safety and connection review",
          "Repair estimate summary",
        ],
        problemSignals: [
          "Microwave runs but food stays cold",
          "Control panel is unstable",
          "The door mechanism feels off",
        ],
      },
      {
        slug: "chimney-service",
        name: "Chimney Service",
        tagline: "Improve suction and kitchen hygiene with chimney cleaning support.",
        description:
          "A service-first option for chimneys that need suction recovery, filter care, and grease cleanup.",
        starterPrice: 699,
        turnaround: "60 to 90 minutes",
        recommendedPackage: "Service and Clean",
        highlights: [
          "Useful for heavy-use kitchens",
          "Best done regularly in oily cooking environments",
          "Supports better kitchen freshness",
        ],
        included: [
          "External and filter cleaning",
          "Suction performance review",
          "Basic functional test",
        ],
        problemSignals: [
          "Kitchen smoke lingers too long",
          "Chimney noise has increased",
          "Grease buildup is visible",
        ],
      },
      {
        slug: "multi-appliance-check",
        name: "Multi-Appliance Check",
        tagline: "Inspect more than one appliance during the same visit.",
        description:
          "A bundled option for homes that need repair planning or servicing across multiple daily-use appliances.",
        starterPrice: 1199,
        turnaround: "90 to 150 minutes",
        recommendedPackage: "Repair Plus",
        highlights: [
          "Good value for multi-issue homes",
          "Ideal before moving or annual upkeep",
          "Saves follow-up visits",
        ],
        included: [
          "Primary appliance diagnosis",
          "Secondary appliance inspection",
          "Consolidated service recommendation",
        ],
        problemSignals: [
          "You have more than one appliance issue",
          "Kitchen and laundry both need checks",
          "You want a single visit for planning repairs",
        ],
      },
    ],
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
    offer: "Bundle multiple room installs in one visit",
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
    subcategories: [
      {
        slug: "single-room-installation",
        name: "Single Room Installation",
        tagline: "Install or replace a fan cleanly in one room.",
        description:
          "A straightforward install service for one standard ceiling fan with balancing and speed test before completion.",
        starterPrice: 249,
        turnaround: "30 to 45 minutes",
        recommendedPackage: "Single Fan Install",
        highlights: [
          "Best for single-room upgrades",
          "Good for rentals and new tenants",
          "Fastest installation option",
        ],
        included: [
          "One fan installation",
          "Basic balancing and wiring check",
          "Speed regulator validation",
        ],
        problemSignals: [
          "You bought a new fan for one room",
          "An old fan needs replacement",
          "You want a quick same-day install",
        ],
      },
      {
        slug: "double-room-setup",
        name: "Double Room Setup",
        tagline: "Install fans in two rooms during the same visit.",
        description:
          "Built for new-home setup, multiple-room upgrades, or bundled installations with better value.",
        starterPrice: 449,
        turnaround: "60 to 90 minutes",
        recommendedPackage: "Double Room Setup",
        highlights: [
          "Better value for new move-ins",
          "Great for bedrooms and living rooms",
          "Cuts the need for repeat scheduling",
        ],
        included: [
          "Two room installations",
          "Noise and wobble correction",
          "Basic cleanup after work",
        ],
        problemSignals: [
          "Two rooms need fan work this week",
          "You are furnishing a new flat",
          "You want one bundled visit",
        ],
      },
      {
        slug: "regulator-and-balancing",
        name: "Regulator and Balancing",
        tagline: "Fix poor speed control, wobble, and noisy operation.",
        description:
          "Use this when the fan is already installed but performance, control, or stability has dropped.",
        starterPrice: 199,
        turnaround: "30 to 60 minutes",
        recommendedPackage: "Single Fan Install",
        highlights: [
          "Perfect for minor performance issues",
          "Useful for older fans",
          "Can reduce noise and shake quickly",
        ],
        included: [
          "Regulator check",
          "Balancing adjustment",
          "Speed and noise test",
        ],
        problemSignals: [
          "Fan speed is inconsistent",
          "The unit wobbles when running fast",
          "Noise has increased over time",
        ],
      },
      {
        slug: "false-ceiling-install",
        name: "False Ceiling Install",
        tagline: "Special handling for fans mounted with ceiling considerations.",
        description:
          "A more careful installation path for spaces with false ceilings or extra mounting requirements.",
        starterPrice: 499,
        turnaround: "60 to 90 minutes",
        recommendedPackage: "Install and Upgrade",
        highlights: [
          "For premium interiors and designer rooms",
          "Includes mount stability attention",
          "Best handled by experienced installers",
        ],
        included: [
          "Mount review",
          "Safe fitting and reinforcement",
          "Final performance check",
        ],
        problemSignals: [
          "The ceiling setup is not standard",
          "You need a designer fan installed safely",
          "Mount stability is your main concern",
        ],
      },
    ],
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

export function getServiceSubcategory(serviceSlug: string, subcategorySlug: string) {
  const service = getServiceBySlug(serviceSlug);

  if (!service) {
    return null;
  }

  const subcategory = service.subcategories.find(
    (item) => item.slug === subcategorySlug
  );

  if (!subcategory) {
    return null;
  }

  return {
    service,
    subcategory,
  };
}

export function getFeaturedSubcategories(limit = 8) {
  return serviceCatalog
    .flatMap((service) =>
      service.subcategories.map((subcategory) => ({
        service,
        subcategory,
      }))
    )
    .slice(0, limit);
}
