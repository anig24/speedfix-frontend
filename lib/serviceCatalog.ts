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
  ...createGeneratedServiceCatalog(),
];

type GeneratedServiceSeed = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  basePrice: number;
  responseTime: string;
  coverage: string;
  offer: string;
  searchTerms: string[];
  highlights: string[];
  problemsSolved: string[];
  tasks: string[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createGeneratedPackages(seed: GeneratedServiceSeed): ServicePackage[] {
  return [
    {
      name: "Quick Visit",
      price: seed.basePrice,
      description: `A focused ${seed.name.toLowerCase()} visit for urgent fixes and standard task completion.`,
      turnaround: "60 to 120 minutes",
      checklist: [
        `${seed.name} issue assessment`,
        "Immediate service execution for the booked task",
        "Final testing, handover, and clean finish",
      ],
    },
    {
      name: "Priority Service",
      price: seed.basePrice + 499,
      description: `A broader ${seed.name.toLowerCase()} workflow with extra time for adjustment, finishing, and follow-through.`,
      turnaround: "2 to 4 hours",
      checklist: [
        "Detailed inspection before work starts",
        "Primary task completion with quality checks",
        "Adjustment support and expert guidance",
      ],
    },
    {
      name: "Complete Care",
      price: seed.basePrice + 999,
      description: `A premium ${seed.name.toLowerCase()} package for larger homes, multi-point work, or complex requests.`,
      turnaround: "Half-day service window",
      checklist: [
        "Extended execution coverage",
        "Multiple task handling in one visit",
        "Priority finishing and final walkthrough",
      ],
    },
  ];
}

function createGeneratedAddons(seed: GeneratedServiceSeed): ServiceAddon[] {
  return [
    { name: `${seed.name} material pickup`, price: 249 },
    { name: "Urgent same-day coordination", price: 399 },
    { name: "Extra task extension", price: 499 },
  ];
}

function createGeneratedSubcategory(
  seed: GeneratedServiceSeed,
  taskName: string,
  index: number
): ServiceSubcategory {
  const starterPrice = seed.basePrice + index * 80;

  return {
    slug: slugify(taskName),
    name: taskName,
    tagline: `${taskName} by trained ${seed.name.toLowerCase()} specialists with premium on-site coordination.`,
    description: `Book ${taskName.toLowerCase()} with a structured workflow built for homes and workplaces that need dependable ${seed.name.toLowerCase()} support.`,
    starterPrice,
    turnaround: index % 3 === 0 ? "90 minutes" : index % 3 === 1 ? "2 to 3 hours" : "Half-day slot",
    recommendedPackage:
      index % 3 === 0
        ? "Quick Visit"
        : index % 3 === 1
          ? "Priority Service"
          : "Complete Care",
    highlights: [
      `Dedicated ${seed.name.toLowerCase()} specialist for ${taskName.toLowerCase()}`,
      "Structured pre-visit review and clear on-site communication",
      "Built for repeatable premium service quality",
    ],
    included: [
      `${taskName} assessment and scope confirmation`,
      "Execution support with service-quality checks",
      "Final testing, handover, and next-step guidance",
    ],
    problemSignals: [
      `${taskName} is now affecting daily comfort or operations`,
      `You want a scheduled ${taskName.toLowerCase()} visit with clearer execution`,
      `${seed.name} work needs professional handling instead of trial-and-error fixes`,
    ],
  };
}

function createGeneratedService(seed: GeneratedServiceSeed, index: number): ServiceCatalogItem {
  return {
    slug: seed.slug,
    name: seed.name,
    tagline: seed.tagline,
    description: seed.description,
    image: seed.image,
    rating: index % 2 === 0 ? 4.8 : 4.9,
    reviews: `${1.2 + index / 10}k reviews`,
    jobsCompleted: `${8 + index}k jobs served`,
    responseTime: seed.responseTime,
    basePrice: seed.basePrice,
    coverage: seed.coverage,
    highlights: seed.highlights,
    problemsSolved: seed.problemsSolved,
    packages: createGeneratedPackages(seed),
    addons: createGeneratedAddons(seed),
    searchTerms: seed.searchTerms,
    offer: seed.offer,
    subcategories: seed.tasks.map((taskName, taskIndex) =>
      createGeneratedSubcategory(seed, taskName, taskIndex)
    ),
  };
}

function createGeneratedServiceCatalog(): ServiceCatalogItem[] {
  const seeds: GeneratedServiceSeed[] = [
    {
      slug: "pest-control",
      name: "Pest Control",
      tagline: "Targeted pest treatment, prevention, and follow-up for homes and offices.",
      description:
        "Book pest specialists for insects, rodents, seasonal outbreaks, and preventive treatment with cleaner on-site coordination.",
      image: "/services/cleaning.png",
      basePrice: 1199,
      responseTime: "Same-day inspection in core city zones",
      coverage: "Apartments, villas, offices, kitchens, and store rooms",
      offer: "Monsoon pest-prevention demand is live",
      searchTerms: ["pest", "termite", "cockroach", "rodent", "fumigation"],
      highlights: [
        "Treatment plans matched to infestation type",
        "Follow-up guidance after every visit",
        "Suitable for residential and commercial spaces",
      ],
      problemsSolved: [
        "Recurring roach or ant sightings",
        "Rodent movement around kitchen or storage zones",
        "Preventive treatment before seasonal spikes",
      ],
      tasks: [
        "Cockroach Control",
        "Termite Treatment",
        "Rodent Control",
        "Bed Bug Treatment",
        "Ant Control",
        "Mosquito Fogging",
        "Spider Control",
        "Lizard Control",
        "Bee Hive Removal",
        "General Pest Inspection",
      ],
    },
    {
      slug: "painting",
      name: "Painting Services",
      tagline: "Interior, exterior, touch-up, and texture painting with cleaner execution planning.",
      description:
        "Use trained painting crews for home refreshes, handover work, accent walls, and larger repainting projects.",
      image: "/services/cleaning.png",
      basePrice: 1899,
      responseTime: "Site visit scheduling within 24 hours",
      coverage: "Walls, ceilings, facades, doors, grills, and detailed surfaces",
      offer: "Pre-festival repaint slots are filling up",
      searchTerms: ["painting", "wall paint", "texture", "putty", "repaint"],
      highlights: [
        "Site-ready painter coordination",
        "Touch-up to full-home execution paths",
        "Works for homes and managed communities",
      ],
      problemsSolved: [
        "Walls look tired or patchy",
        "You need a room refresh before move-in",
        "Exterior paint has weather damage",
      ],
      tasks: [
        "Interior Wall Painting",
        "Exterior Painting",
        "Accent Wall Painting",
        "Texture Finish Painting",
        "Ceiling Painting",
        "Door and Grill Painting",
        "Wood Polish Touch-Up",
        "Waterproof Primer Coat",
        "Rental Touch-Up Painting",
        "Post-Repair Wall Repaint",
      ],
    },
    {
      slug: "carpentry",
      name: "Carpentry",
      tagline: "Repairs, custom fitting, alignment, and woodwork for everyday spaces.",
      description:
        "Bring in carpentry specialists for repair work, fittings, storage upgrades, and alignment fixes across the home.",
      image: "/services/appliance-repair.png",
      basePrice: 799,
      responseTime: "Fast appointment slots for repair and fitting jobs",
      coverage: "Doors, cabinets, shelves, modular units, and furniture",
      offer: "Bundle multiple carpentry tasks in one visit",
      searchTerms: ["carpenter", "woodwork", "hinge", "cabinet", "shelf"],
      highlights: [
        "Useful for both repair and upgrade work",
        "Ideal for modular storage maintenance",
        "Professional finishing support on-site",
      ],
      problemsSolved: [
        "Cabinet hinges or shutters are failing",
        "Furniture alignment is off",
        "You need extra storage or fitting support",
      ],
      tasks: [
        "Door Alignment Repair",
        "Cabinet Hinge Replacement",
        "Shelf Installation",
        "Drawer Channel Repair",
        "Wardrobe Alignment",
        "TV Unit Fitting",
        "Study Table Assembly",
        "Modular Kitchen Adjustment",
        "Bed Frame Tightening",
        "Custom Storage Fixes",
      ],
    },
    {
      slug: "waterproofing",
      name: "Waterproofing",
      tagline: "Leak-source protection, sealing, and dampness control for roofs and walls.",
      description:
        "Book waterproofing professionals for terrace leaks, seepage, bathroom dampness, and repeated water-entry problems.",
      image: "/services/plumbing.png",
      basePrice: 1499,
      responseTime: "Inspection-led waterproofing visits across key cities",
      coverage: "Terraces, walls, ceilings, balconies, and wet areas",
      offer: "Terrace waterproofing requests rise before rainy weeks",
      searchTerms: ["waterproofing", "seepage", "terrace leak", "damp wall"],
      highlights: [
        "Leak-source focused treatment planning",
        "Built for recurring seepage and dampness control",
        "Useful before monsoon pressure builds up",
      ],
      problemsSolved: [
        "Damp patches keep returning",
        "Terrace or bathroom seepage is visible",
        "Water marks are spreading across ceilings",
      ],
      tasks: [
        "Terrace Waterproofing",
        "Bathroom Leakage Sealing",
        "Balcony Seepage Control",
        "Wall Crack Sealing",
        "Ceiling Dampness Repair",
        "Window Edge Waterproofing",
        "Overhead Tank Base Sealing",
        "Basement Dampness Control",
        "Kitchen Wet-Area Protection",
        "Monsoon Preventive Inspection",
      ],
    },
    {
      slug: "cctv-security",
      name: "CCTV and Security",
      tagline: "Camera setup, troubleshooting, and security-device support at your location.",
      description:
        "Use security technicians for CCTV camera installation, reconfiguration, and monitoring-device troubleshooting.",
      image: "/services/electrician.png",
      basePrice: 1299,
      responseTime: "Quick security-device appointments in active zones",
      coverage: "Homes, office entries, corridors, gates, and shared spaces",
      offer: "Multi-camera setup bundles are available this week",
      searchTerms: ["cctv", "security camera", "dvr", "surveillance", "video doorbell"],
      highlights: [
        "Camera placement with practical field review",
        "Works for fresh installations and rework",
        "Supports home and office security setups",
      ],
      problemsSolved: [
        "Cameras are down or misaligned",
        "A fresh security setup is needed",
        "Monitoring quality is poor after installation",
      ],
      tasks: [
        "CCTV Camera Installation",
        "DVR Setup",
        "NVR Configuration",
        "Video Doorbell Installation",
        "Security Camera Realignment",
        "Cable Routing for Cameras",
        "Motion Sensor Setup",
        "Smart Lock Installation",
        "Intercom System Setup",
        "Security Audit Visit",
      ],
    },
    {
      slug: "smart-home-automation",
      name: "Smart Home Automation",
      tagline: "Smart-device setup, voice control, and connected-home configuration.",
      description:
        "Connect lighting, appliances, entry systems, and automation routines with professional smart-home assistance.",
      image: "/services/electrician.png",
      basePrice: 1399,
      responseTime: "Device-setup support available in top service clusters",
      coverage: "Lighting, switches, locks, hubs, cameras, and scene controls",
      offer: "Bundle switch and hub setup in one visit",
      searchTerms: ["smart home", "automation", "voice assistant", "smart switch"],
      highlights: [
        "Practical automation setup for live homes",
        "Supports standalone devices and grouped scenes",
        "Built for premium connected-home upgrades",
      ],
      problemsSolved: [
        "New smart devices are not configured yet",
        "Automation routines need a cleaner setup",
        "Voice and app control are inconsistent",
      ],
      tasks: [
        "Smart Switch Installation",
        "Voice Assistant Setup",
        "Wi-Fi Device Pairing",
        "Smart Curtain Configuration",
        "Scene Automation Setup",
        "Smart Lock Pairing",
        "Hub Installation",
        "Smart Sensor Setup",
        "Home Network Device Mapping",
        "Automation Troubleshooting",
      ],
    },
    {
      slug: "water-purifier",
      name: "Water Purifier Service",
      tagline: "RO, UV, and purifier installation, maintenance, and filter support.",
      description:
        "Keep drinking-water systems reliable with purifier technicians handling installation, servicing, and performance issues.",
      image: "/services/appliance-repair.png",
      basePrice: 699,
      responseTime: "Rapid purifier service in core household zones",
      coverage: "RO systems, UV units, under-sink filters, and countertop purifiers",
      offer: "Filter replacement bookings are trending this week",
      searchTerms: ["ro service", "water purifier", "filter change", "uv service"],
      highlights: [
        "Installation to maintenance coverage",
        "Useful for water flow and taste complaints",
        "Ideal for annual purifier upkeep",
      ],
      problemsSolved: [
        "Purified water output has dropped",
        "Filters are overdue for replacement",
        "A fresh purifier needs installation",
      ],
      tasks: [
        "RO Service",
        "Filter Replacement",
        "Purifier Installation",
        "UV Lamp Replacement",
        "Water Flow Repair",
        "AMC Service Visit",
        "Taste and TDS Check",
        "Leakage in Purifier Line",
        "Under-Sink Purifier Setup",
        "Purifier Deep Cleaning",
      ],
    },
    {
      slug: "inverter-ups",
      name: "Inverter and UPS",
      tagline: "Backup-power installation, battery replacement, and preventive support.",
      description:
        "Book electrical backup specialists for inverter setup, battery issues, and home or office UPS stability.",
      image: "/services/electrician.png",
      basePrice: 899,
      responseTime: "Same-day backup-power service in active areas",
      coverage: "Inverters, batteries, UPS units, and backup lines",
      offer: "Power-backup readiness checks are in demand",
      searchTerms: ["inverter", "ups", "battery", "backup power"],
      highlights: [
        "Installation and troubleshooting support",
        "Good fit for homes and compact offices",
        "Useful before summer power-pressure periods",
      ],
      problemsSolved: [
        "Backup power is unreliable",
        "Battery replacement is overdue",
        "A new inverter setup is needed",
      ],
      tasks: [
        "Inverter Installation",
        "Battery Replacement",
        "UPS Troubleshooting",
        "Power Backup Inspection",
        "Charging Circuit Repair",
        "Inverter Wiring Review",
        "Home UPS Installation",
        "Battery Watering Support",
        "Load Capacity Check",
        "Emergency Backup Repair",
      ],
    },
    {
      slug: "locksmith",
      name: "Locksmith",
      tagline: "Door lock repair, fitting, and access hardware support for homes and offices.",
      description:
        "Get locksmith help for stuck locks, hardware replacement, and secure entry upgrades without long wait windows.",
      image: "/services/electrician.png",
      basePrice: 599,
      responseTime: "Quick-response lock and hardware visits",
      coverage: "Main doors, room doors, gates, drawers, and access points",
      offer: "High-demand slots for digital lock upgrades are open",
      searchTerms: ["locksmith", "door lock", "smart lock", "key issue"],
      highlights: [
        "Works for repair and upgrade requests",
        "Suitable for residential and office entry points",
        "Supports mechanical and smart-lock categories",
      ],
      problemsSolved: [
        "A lock is jammed or unreliable",
        "You want a faster lock upgrade",
        "Door access hardware needs replacement",
      ],
      tasks: [
        "Main Door Lock Repair",
        "Lock Replacement",
        "Digital Lock Installation",
        "Latch Alignment Fix",
        "Door Handle Replacement",
        "Drawer Lock Repair",
        "Gate Lock Service",
        "Bedroom Lock Change",
        "Office Lock Upgrade",
        "Smart Lock Setup",
      ],
    },
    {
      slug: "packers-movers",
      name: "Packers and Movers",
      tagline: "Packing, loading, moving, and setup coordination for homes and offices.",
      description:
        "Plan local shifting with crews that can handle packing flow, fragile handling, loading, and room-level placement.",
      image: "/services/cleaning.png",
      basePrice: 2499,
      responseTime: "Pre-move planning support with scheduled crew slots",
      coverage: "Apartment shifting, office moves, partial moves, and storage loads",
      offer: "Weekend moving schedules are booking quickly",
      searchTerms: ["packers", "movers", "shifting", "relocation", "transport"],
      highlights: [
        "Structured move-day coordination",
        "Useful for both full and partial moves",
        "Crew support from packing to unloading",
      ],
      problemsSolved: [
        "You are shifting this week",
        "Packing and transport need to be coordinated together",
        "Fragile or bulky items need careful handling",
      ],
      tasks: [
        "1BHK Shifting",
        "2BHK Shifting",
        "Villa Relocation",
        "Office Move Support",
        "Packing Only Service",
        "Loading and Unloading",
        "Furniture Dismantling for Move",
        "Fragile Item Packing",
        "Storage Transfer Move",
        "Local City Relocation",
      ],
    },
    {
      slug: "gardening-landscaping",
      name: "Gardening and Landscaping",
      tagline: "Plant care, balcony green setup, trimming, and outdoor upkeep services.",
      description:
        "Book gardeners for routine maintenance, plant styling, and outdoor refresh work across homes and gated communities.",
      image: "/services/cleaning.png",
      basePrice: 899,
      responseTime: "Garden care visits available through scheduled slots",
      coverage: "Balconies, terraces, lawns, entrance greens, and planters",
      offer: "Seasonal pruning and replanting demand is active",
      searchTerms: ["gardening", "plants", "landscape", "lawn", "balcony garden"],
      highlights: [
        "Useful for routine and seasonal upkeep",
        "Supports compact balconies and larger lawns",
        "Good fit for plant styling refreshes",
      ],
      problemsSolved: [
        "Plants need better upkeep",
        "Outdoor areas look neglected",
        "A balcony or lawn refresh is overdue",
      ],
      tasks: [
        "Balcony Garden Setup",
        "Lawn Mowing",
        "Plant Repotting",
        "Seasonal Pruning",
        "Drip Irrigation Check",
        "Terrace Garden Refresh",
        "Hedge Trimming",
        "Soil and Compost Refill",
        "Outdoor Plant Styling",
        "Garden Maintenance Visit",
      ],
    },
    {
      slug: "flooring-tiling",
      name: "Flooring and Tiling",
      tagline: "Tile fixes, grout work, replacements, and finishing support for wet and dry zones.",
      description:
        "Use flooring specialists for damaged tiles, loose sections, and finishing work across bathrooms, kitchens, and main rooms.",
      image: "/services/plumbing.png",
      basePrice: 999,
      responseTime: "Tile-repair and inspection slots available citywide",
      coverage: "Bathrooms, kitchens, balconies, living rooms, and wall sections",
      offer: "Multi-point tile repair visits are popular right now",
      searchTerms: ["tiling", "flooring", "grout", "tile repair", "marble polish"],
      highlights: [
        "Repair-first approach for damaged surfaces",
        "Useful for both flooring and wall tile work",
        "Helps avoid small issues turning structural",
      ],
      problemsSolved: [
        "Tiles are cracked or loose",
        "Grout lines look worn or dirty",
        "Small water-entry issues are affecting floors",
      ],
      tasks: [
        "Tile Replacement",
        "Loose Tile Resetting",
        "Grout Rework",
        "Bathroom Floor Repair",
        "Kitchen Backsplash Tiling",
        "Balcony Tile Repair",
        "Skirting Tile Fix",
        "Marble Polishing Support",
        "Anti-Skid Tile Installation",
        "Wall Tile Crack Repair",
      ],
    },
    {
      slug: "false-ceiling",
      name: "False Ceiling and Gypsum",
      tagline: "Ceiling repair, panel work, lighting cutouts, and gypsum finishing support.",
      description:
        "Schedule ceiling specialists for gypsum repairs, panel alignment, and finishing work in premium interior spaces.",
      image: "/services/fan-installation.png",
      basePrice: 1499,
      responseTime: "Interior ceiling visits are bookable through planned slots",
      coverage: "Living rooms, bedrooms, offices, lobbies, and retail interiors",
      offer: "Designer ceiling repair requests are increasing",
      searchTerms: ["false ceiling", "gypsum", "ceiling repair", "panel work"],
      highlights: [
        "Good for repairs and finish-level touch-ups",
        "Supports lighting coordination points",
        "Useful for residential and office interiors",
      ],
      problemsSolved: [
        "Ceiling panels look damaged or uneven",
        "Lighting cutouts need finishing support",
        "Water damage has marked the ceiling finish",
      ],
      tasks: [
        "Gypsum Ceiling Repair",
        "Ceiling Panel Replacement",
        "Cove Lighting Cutout",
        "False Ceiling Touch-Up",
        "Access Panel Fitting",
        "Joint Crack Repair",
        "Ceiling Repaint Prep",
        "Designer Ceiling Alignment",
        "Office Ceiling Tile Fix",
        "Post-Leak Ceiling Repair",
      ],
    },
    {
      slug: "glass-aluminium",
      name: "Glass and Aluminium",
      tagline: "Sliding, partition, frame, and hardware work for clean interior finishing.",
      description:
        "Book specialists for glass doors, partitions, windows, sliding systems, and aluminium frame fixes.",
      image: "/services/electrician.png",
      basePrice: 999,
      responseTime: "Frame and sliding-system visits available in service zones",
      coverage: "Windows, partitions, shower enclosures, railings, and sliders",
      offer: "Sliding-door tune-up visits are in demand this month",
      searchTerms: ["glass", "aluminium", "sliding door", "partition", "window frame"],
      highlights: [
        "Repair and finishing coverage for glass systems",
        "Useful for both home and office interiors",
        "Supports hardware and alignment fixes",
      ],
      problemsSolved: [
        "Sliding frames are not moving smoothly",
        "Glass hardware needs replacement",
        "Partitions or enclosures need professional fitting",
      ],
      tasks: [
        "Sliding Window Repair",
        "Shower Enclosure Fitting",
        "Glass Partition Installation",
        "Aluminium Frame Alignment",
        "Door Closer Installation",
        "Balcony Glass Railing Fix",
        "Office Glass Cabin Setup",
        "Mosquito Mesh Frame Repair",
        "Channel Cleaning and Tuning",
        "Glass Hardware Replacement",
      ],
    },
    {
      slug: "modular-kitchen",
      name: "Modular Kitchen Service",
      tagline: "Shutter, channel, hinge, fitting, and finish-level support for modular kitchens.",
      description:
        "Use modular kitchen specialists for daily-use repair, hardware replacement, and layout-level upgrade support.",
      image: "/services/appliance-repair.png",
      basePrice: 999,
      responseTime: "Kitchen repair slots available across top service cities",
      coverage: "Shutters, drawers, baskets, counters, and fittings",
      offer: "Bundle channel and hinge repair in one visit",
      searchTerms: ["modular kitchen", "hinge", "drawer", "cabinet", "basket"],
      highlights: [
        "Focused on modular-kitchen functionality",
        "Works well for repair-heavy kitchen units",
        "Supports premium finish expectations",
      ],
      problemsSolved: [
        "Kitchen shutters are misaligned",
        "Drawers and channels are failing",
        "Hardware wear is affecting daily cooking flow",
      ],
      tasks: [
        "Kitchen Shutter Alignment",
        "Drawer Channel Repair",
        "Hinge Replacement",
        "Basket System Adjustment",
        "Laminate Edge Touch-Up",
        "Handle and Knob Replacement",
        "Sink Base Cabinet Repair",
        "Countertop Seal Review",
        "Tall Unit Alignment",
        "Soft-Close Upgrade",
      ],
    },
    {
      slug: "curtains-blinds",
      name: "Curtains and Blinds",
      tagline: "Measuring, fitting, rail support, and window-dressing installation.",
      description:
        "Book fitting support for blinds, tracks, curtain rods, blackout setups, and window-finish upgrades.",
      image: "/services/cleaning.png",
      basePrice: 699,
      responseTime: "Scheduled fitting support for homes and offices",
      coverage: "Windows, balconies, glass partitions, bedrooms, and office cabins",
      offer: "Blackout and roller blind installs are trending",
      searchTerms: ["curtains", "blinds", "rod fitting", "roller blind"],
      highlights: [
        "Measurement to fitting support",
        "Good fit for fresh interiors and replacements",
        "Works across residential and office spaces",
      ],
      problemsSolved: [
        "Curtain hardware is loose or broken",
        "New blinds need professional fitting",
        "Window dressing looks unfinished",
      ],
      tasks: [
        "Curtain Rod Installation",
        "Roller Blind Fitting",
        "Roman Blind Installation",
        "Curtain Track Setup",
        "Blackout Curtain Fitting",
        "Vertical Blind Service",
        "Window Measurement Visit",
        "Motorized Blind Setup",
        "Curtain Reinstallation",
        "Office Cabin Blind Fitting",
      ],
    },
    {
      slug: "sofa-upholstery",
      name: "Sofa and Upholstery",
      tagline: "Repair, fabric refresh, cushion work, and seating restoration services.",
      description:
        "Use upholstery teams for sofa refresh work, frame corrections, cushion support, and fabric-related repairs.",
      image: "/services/cleaning.png",
      basePrice: 1499,
      responseTime: "Furniture refresh appointments available on schedule",
      coverage: "Sofas, chairs, headboards, benches, and custom seating units",
      offer: "Cushion-refresh packages are booking quickly",
      searchTerms: ["upholstery", "sofa repair", "cushion", "fabric"],
      highlights: [
        "Repair-led upholstery support",
        "Good for visual refresh and comfort issues",
        "Works with premium seating pieces",
      ],
      problemsSolved: [
        "Sofa comfort has dropped",
        "Fabric wear is visible",
        "Seating support or cushions need work",
      ],
      tasks: [
        "Sofa Cushion Refill",
        "Armrest Repair",
        "Fabric Change Support",
        "Dining Chair Upholstery",
        "Recliner Minor Repair",
        "Headboard Upholstery",
        "Bench Seating Refresh",
        "Foam Replacement",
        "Sofa Frame Tightening",
        "Seat Sagging Repair",
      ],
    },
    {
      slug: "laundry-dry-cleaning",
      name: "Laundry and Dry Cleaning",
      tagline: "Pickup-friendly clothing, linen, and premium garment care support.",
      description:
        "Use managed laundry workflows for everyday garments, premium dry cleaning, and home-linen refresh cycles.",
      image: "/services/cleaning.png",
      basePrice: 399,
      responseTime: "Doorstep pickup support across active neighborhoods",
      coverage: "Garments, linens, blankets, curtains, and occasion wear",
      offer: "Weekly subscription-style pickup runs are active",
      searchTerms: ["laundry", "dry cleaning", "linen wash", "pickup laundry"],
      highlights: [
        "Pickup-friendly routine garment care",
        "Supports everyday and premium wear",
        "Useful for homes, rentals, and working professionals",
      ],
      problemsSolved: [
        "Laundry volume is piling up",
        "Premium wear needs safer cleaning",
        "Linen care is becoming hard to manage at home",
      ],
      tasks: [
        "Everyday Laundry Wash",
        "Premium Dry Cleaning",
        "Blanket and Quilt Cleaning",
        "Curtain Dry Cleaning",
        "Saree Care Service",
        "Blazer and Suit Cleaning",
        "Shoe Cleaning Pickup",
        "Kidswear Bulk Laundry",
        "Linen Ironing Service",
        "Weekly Pickup Subscription",
      ],
    },
    {
      slug: "salon-at-home",
      name: "Salon at Home",
      tagline: "Beauty, grooming, and styling appointments delivered at your doorstep.",
      description:
        "Book trained beauty professionals for haircut, grooming, waxing, and event-ready styling without leaving home.",
      image: "/services/cleaning.png",
      basePrice: 699,
      responseTime: "Home salon appointments available on scheduled slots",
      coverage: "Hair, skin, manicure, pedicure, and occasion-ready grooming",
      offer: "Weekend bridal and grooming bookings are active",
      searchTerms: ["salon", "beauty", "waxing", "pedicure", "hair spa"],
      highlights: [
        "At-home convenience with structured appointment flow",
        "Built for routine and occasion-based grooming",
        "Supports premium home-service expectations",
      ],
      problemsSolved: [
        "You want salon service without travel",
        "An occasion-ready grooming session is needed",
        "Routine self-care is slipping due to time pressure",
      ],
      tasks: [
        "Haircut at Home",
        "Hair Spa Service",
        "Facial Appointment",
        "Waxing Session",
        "Manicure Service",
        "Pedicure Service",
        "Threading and Cleanup",
        "Party Makeup Booking",
        "Bridal Trial Grooming",
        "Head Massage Session",
      ],
    },
    {
      slug: "beauty-and-grooming",
      name: "Beauty and Grooming",
      tagline: "Specialized grooming services for bridal, festive, and premium-care needs.",
      description:
        "Use a beauty-focused service lane for specialized grooming workflows beyond routine salon appointments.",
      image: "/services/cleaning.png",
      basePrice: 899,
      responseTime: "Beauty service coordination available in premium slots",
      coverage: "Skin, hair, bridal prep, men’s grooming, and event styling",
      offer: "Event-grooming bundles are open this month",
      searchTerms: ["beauty", "grooming", "bridal", "makeup", "styling"],
      highlights: [
        "Focused on premium grooming outcomes",
        "Useful for events and milestone moments",
        "Supports detailed pre-event planning",
      ],
      problemsSolved: [
        "You need specialized grooming support",
        "Event styling needs a coordinated booking",
        "Routine salon care is not enough for the occasion",
      ],
      tasks: [
        "Bridal Makeup Session",
        "Engagement Look Styling",
        "Reception Grooming Package",
        "Men's Grooming Session",
        "Pre-Event Skin Prep",
        "Hair Styling for Occasion",
        "Nail Extension Appointment",
        "Eyebrow and Lash Styling",
        "HD Makeup Booking",
        "Festive Grooming Package",
      ],
    },
    {
      slug: "car-detailing",
      name: "Car Detailing",
      tagline: "Interior, exterior, polish, and car-care sessions at your doorstep.",
      description:
        "Book vehicle-care professionals for detailing, polish work, stain removal, and maintenance cleaning.",
      image: "/services/cleaning.png",
      basePrice: 999,
      responseTime: "Doorstep detailing slots available in supported neighborhoods",
      coverage: "Exterior wash, interiors, polish, engine bay, and seat surfaces",
      offer: "Weekend car detailing demand is currently high",
      searchTerms: ["car wash", "detailing", "polish", "car interior cleaning"],
      highlights: [
        "At-home vehicle detailing support",
        "Works for routine upkeep and visual refresh",
        "Useful for family and premium cars alike",
      ],
      problemsSolved: [
        "The car interior feels neglected",
        "Exterior shine and finish need a reset",
        "A vehicle is due for deeper detailing work",
      ],
      tasks: [
        "Exterior Foam Wash",
        "Interior Vacuum and Wipe",
        "Dashboard Detailing",
        "Seat Shampooing",
        "Ceramic Coating Prep",
        "Paint Polish Service",
        "Engine Bay Cleaning",
        "Headlight Restoration",
        "Windshield Watermark Removal",
        "SUV Detailing Package",
      ],
    },
    {
      slug: "bike-service",
      name: "Bike Service at Home",
      tagline: "Routine two-wheeler servicing, checks, and convenience-led repairs at your location.",
      description:
        "Use home bike service appointments for quick maintenance, battery issues, and everyday ride-readiness work.",
      image: "/services/appliance-repair.png",
      basePrice: 699,
      responseTime: "Doorstep two-wheeler support in active service clusters",
      coverage: "Scooters, motorcycles, commuter bikes, and delivery vehicles",
      offer: "Regular commuter bike service slots are open",
      searchTerms: ["bike service", "scooter repair", "two wheeler", "doorstep bike"],
      highlights: [
        "Convenient bike maintenance at home",
        "Useful for routine upkeep and small repairs",
        "Good fit for busy commuters",
      ],
      problemsSolved: [
        "Routine service is overdue",
        "A quick ride-readiness check is needed",
        "Small issues are piling up on a daily-use vehicle",
      ],
      tasks: [
        "General Bike Service",
        "Scooter Service",
        "Battery Check and Replacement",
        "Brake Adjustment",
        "Engine Oil Change",
        "Chain Cleaning and Lubrication",
        "Tyre Air and Condition Review",
        "Delivery Bike Maintenance",
        "Headlight and Indicator Check",
        "Starter Trouble Inspection",
      ],
    },
    {
      slug: "bird-netting",
      name: "Bird Netting and Safety Mesh",
      tagline: "Protect balconies, ducts, and open zones with installation-led mesh services.",
      description:
        "Book bird-netting teams for pigeon control, child-safety mesh, and open-zone protection across residential buildings.",
      image: "/services/cleaning.png",
      basePrice: 999,
      responseTime: "Balcony and facade visits are available in selected zones",
      coverage: "Balconies, shafts, ducts, windows, terraces, and utility areas",
      offer: "Pigeon-control netting requests are active in apartments",
      searchTerms: ["bird netting", "safety mesh", "pigeon net", "balcony mesh"],
      highlights: [
        "Useful for hygiene and safety concerns",
        "Supports apartments and villa balconies",
        "Installation planned around real site conditions",
      ],
      problemsSolved: [
        "Bird movement is affecting balcony hygiene",
        "Open shafts need protective mesh",
        "You want cleaner and safer external openings",
      ],
      tasks: [
        "Balcony Bird Netting",
        "Pigeon Spike Installation",
        "Duct Area Netting",
        "Terrace Safety Mesh",
        "Window Safety Mesh",
        "Utility Area Protection",
        "AC Ledge Netting",
        "Child Safety Balcony Mesh",
        "Facade Bird-Control Visit",
        "Net Repair and Tightening",
      ],
    },
    {
      slug: "bathroom-renovation",
      name: "Bathroom Renovation Support",
      tagline: "Upgrade planning, fixture changes, and wet-area refresh work for bathrooms.",
      description:
        "Use a bathroom-focused service lane for fixture upgrades, repair clusters, and practical wet-area makeovers.",
      image: "/services/plumbing.png",
      basePrice: 1999,
      responseTime: "Inspection-first bathroom upgrade visits",
      coverage: "Fixtures, fittings, tiles, vanity zones, and shower enclosures",
      offer: "Refresh packages for aging bathrooms are trending",
      searchTerms: ["bathroom renovation", "vanity", "fixtures", "wet area"],
      highlights: [
        "Good for upgrade-led bathroom work",
        "Combines repair and finish-level attention",
        "Useful before rental handover or move-in",
      ],
      problemsSolved: [
        "Bathroom fittings feel dated or unreliable",
        "Multiple small issues need one coordinated visit",
        "The wet area needs a cleaner refresh path",
      ],
      tasks: [
        "Fittings Upgrade Visit",
        "Shower Enclosure Replacement",
        "Vanity Unit Installation",
        "Mirror and Storage Setup",
        "Toilet Accessory Fitting",
        "Wet-Area Fixture Refresh",
        "Tile and Fixture Coordination",
        "Bathroom Regrouting Support",
        "Drain and Slope Review",
        "Rental Bathroom Refresh",
      ],
    },
    {
      slug: "wardrobe-furniture-assembly",
      name: "Wardrobe and Furniture Assembly",
      tagline: "Assembly, reassembly, and setup support for modular and standalone furniture.",
      description:
        "Bring in setup specialists for wardrobes, study units, beds, desks, and furniture moves within the home.",
      image: "/services/appliance-repair.png",
      basePrice: 799,
      responseTime: "Assembly support scheduled across serviceable neighborhoods",
      coverage: "Beds, wardrobes, desks, chairs, shelves, and modular units",
      offer: "Multi-item furniture setup bookings are open",
      searchTerms: ["furniture assembly", "wardrobe setup", "bed assembly", "ikea style"],
      highlights: [
        "Useful after shifting or new deliveries",
        "Supports both assembly and reassembly",
        "Designed for tidy, finished room setup",
      ],
      problemsSolved: [
        "New furniture needs assembly",
        "A shift created reinstallation work",
        "Wardrobe or bed setup is too time-consuming alone",
      ],
      tasks: [
        "Wardrobe Assembly",
        "Bed Assembly",
        "Dining Table Setup",
        "Study Desk Installation",
        "Office Chair Assembly",
        "Bookshelf Setup",
        "TV Console Assembly",
        "Chest of Drawers Setup",
        "Baby Cot Assembly",
        "Post-Move Furniture Reassembly",
      ],
    },
    {
      slug: "home-decor-installation",
      name: "Home Decor Installation",
      tagline: "Mirror, artwork, shelf, fixture, and decor fitting support for finished interiors.",
      description:
        "Use a decor-focused service lane for hanging, mounting, alignment, and styling-support tasks around the home.",
      image: "/services/fan-installation.png",
      basePrice: 599,
      responseTime: "Fast decor fitting slots in supported zones",
      coverage: "Walls, mirrors, shelves, planters, lights, and decorative features",
      offer: "New-home decor setup bundles are available",
      searchTerms: ["decor installation", "mirror fitting", "wall art", "mounting"],
      highlights: [
        "Useful after interior handover or move-in",
        "Clean, alignment-led fitting support",
        "Ideal for premium home finishing touches",
      ],
      problemsSolved: [
        "Decor pieces are pending installation",
        "Wall-mounted items need safer fitting",
        "A new home still feels unfinished",
      ],
      tasks: [
        "Wall Art Installation",
        "Mirror Mounting",
        "Floating Shelf Fitting",
        "Planter Hook Setup",
        "Decor Lighting Mounting",
        "Photo Gallery Wall Setup",
        "Bathroom Mirror Installation",
        "Accent Panel Mounting",
        "Clock and Frame Alignment",
        "Entrance Decor Installation",
      ],
    },
    {
      slug: "mattress-curtain-cleaning",
      name: "Mattress and Curtain Cleaning",
      tagline: "Deep fabric cleaning for sleeping and window-dressing surfaces.",
      description:
        "Book fabric-care specialists for mattresses, curtains, drapes, and other hard-to-wash home textiles.",
      image: "/services/cleaning.png",
      basePrice: 799,
      responseTime: "Fabric-cleaning slots available across major neighborhoods",
      coverage: "Mattresses, curtains, drapes, blinds, and soft furnishings",
      offer: "Seasonal deep-cleaning requests are active",
      searchTerms: ["mattress cleaning", "curtain cleaning", "fabric care", "drape cleaning"],
      highlights: [
        "Deep-care support for large home textiles",
        "Good for allergy-sensitive households",
        "Useful before guest stays or seasonal resets",
      ],
      problemsSolved: [
        "Fabric surfaces feel dusty or stale",
        "A deeper hygiene reset is needed",
        "Large textiles are hard to maintain at home",
      ],
      tasks: [
        "Mattress Deep Cleaning",
        "Curtain Shampooing",
        "Blackout Curtain Cleaning",
        "Drape Steam Refresh",
        "Kids Mattress Sanitization",
        "Guest Room Fabric Reset",
        "Office Curtain Cleaning",
        "Blinds Dust Extraction",
        "Headboard Fabric Cleaning",
        "Allergy-Focused Fabric Care",
      ],
    },
    {
      slug: "appliance-installation",
      name: "Appliance Installation",
      tagline: "Fitting and setup support for new home appliances and replacements.",
      description:
        "Book installation specialists for newly delivered appliances, replacement units, and integrated setup needs.",
      image: "/services/appliance-repair.png",
      basePrice: 899,
      responseTime: "New-appliance setup slots available in active service regions",
      coverage: "Kitchen, laundry, cooling, and daily-use home appliances",
      offer: "Bundle two new-appliance installations in one visit",
      searchTerms: ["appliance installation", "new appliance", "setup", "mounting"],
      highlights: [
        "Built for fresh purchases and replacements",
        "Supports testing and handover after setup",
        "Good fit for move-ins and home upgrades",
      ],
      problemsSolved: [
        "A new appliance is pending installation",
        "Replacement units need professional setup",
        "You want a cleaner handover after delivery",
      ],
      tasks: [
        "Washing Machine Installation",
        "Dishwasher Installation",
        "Microwave Setup",
        "Chimney Installation",
        "Geyser Installation",
        "Refrigerator Placement and Setup",
        "RO Purifier Installation",
        "TV Wall Mount Coordination",
        "Water Heater Replacement Setup",
        "Hob and Hood Fitting",
      ],
    },
    {
      slug: "home-inspection",
      name: "Home Inspection",
      tagline: "Pre-move, maintenance, and readiness checks across key household systems.",
      description:
        "Use inspection visits to review condition, risk points, and service needs before move-in, rental handover, or planned maintenance.",
      image: "/services/electrician.png",
      basePrice: 999,
      responseTime: "Inspection appointments available with planned scheduling",
      coverage: "Electrical, plumbing, surfaces, fixtures, and basic safety checks",
      offer: "Move-in inspection demand is active this month",
      searchTerms: ["home inspection", "move-in check", "maintenance audit", "property check"],
      highlights: [
        "Clearer decision-making before repair spend",
        "Useful for tenants, owners, and managed homes",
        "Good foundation for planned service work",
      ],
      problemsSolved: [
        "You want a readiness check before shifting",
        "Rental handover quality needs review",
        "Small issues may be hiding across multiple systems",
      ],
      tasks: [
        "Move-In Inspection",
        "Rental Handover Audit",
        "Pre-Sale Home Check",
        "Electrical Safety Review",
        "Plumbing Health Review",
        "Bathroom Condition Audit",
        "Kitchen Utility Inspection",
        "Balcony and Window Check",
        "Senior-Care Safety Check",
        "Annual Maintenance Review",
      ],
    },
    {
      slug: "senior-care-home-help",
      name: "Senior Care Home Help",
      tagline: "Home-support visits designed around safer, simpler daily living for seniors.",
      description:
        "Use a home-help service lane for safety-focused assistance, small home adjustments, and support visits that make senior living easier.",
      image: "/services/cleaning.png",
      basePrice: 799,
      responseTime: "Scheduled support visits available in selected localities",
      coverage: "Basic home assistance, safety support, errands, and comfort setups",
      offer: "Senior-friendly home-support visits are open",
      searchTerms: ["senior care", "elder support", "home help", "safety visit"],
      highlights: [
        "Comfort- and safety-led support approach",
        "Useful for families coordinating from a distance",
        "Works well with small home-readiness tasks",
      ],
      problemsSolved: [
        "A safer home setup is needed for parents or elders",
        "Small support tasks need reliable coordination",
        "Families want better visibility into comfort needs",
      ],
      tasks: [
        "Home Safety Walkthrough",
        "Elder-Friendly Bathroom Setup",
        "Grab Bar Installation Coordination",
        "Medicine Shelf Setup",
        "Light Home-Help Visit",
        "Errand Support Coordination",
        "Room Accessibility Refresh",
        "Bedside Support Setup",
        "Kitchen Ease-of-Use Review",
        "Monthly Home Comfort Check",
      ],
    },
    {
      slug: "event-setup-help",
      name: "Event Setup Help",
      tagline: "At-home setup assistance for small gatherings, celebrations, and hosted events.",
      description:
        "Bring in temporary setup crews for furniture movement, decor placement, and pre-event home readiness.",
      image: "/services/cleaning.png",
      basePrice: 1199,
      responseTime: "Pre-event booking slots available on scheduled windows",
      coverage: "Living spaces, balconies, dining zones, terraces, and entry areas",
      offer: "Weekend hosting support is currently in high demand",
      searchTerms: ["event setup", "party setup", "home hosting", "celebration prep"],
      highlights: [
        "Useful for compact home events and celebrations",
        "Pairs well with decor and cleaning services",
        "Designed for faster pre-event readiness",
      ],
      problemsSolved: [
        "Hosting prep is becoming hectic",
        "Furniture and decor need quick coordination",
        "The home needs an event-ready setup plan",
      ],
      tasks: [
        "Dining Setup Assistance",
        "Terrace Event Prep",
        "Balloon and Decor Placement",
        "Furniture Rearrangement",
        "Guest Seating Layout",
        "Entry Decor Setup",
        "Lighting Placement Support",
        "Kids Party Setup",
        "Festival Hosting Prep",
        "Post-Event Reset Support",
      ],
    },
    {
      slug: "maid-on-demand",
      name: "Maid on Demand",
      tagline: "Short-notice housekeeping help for busy days, guests, and temporary support needs.",
      description:
        "Use temporary housekeeping support when regular schedules slip or you need cleaner home readiness for a short window.",
      image: "/services/cleaning.png",
      basePrice: 599,
      responseTime: "Subject to slot availability in active service zones",
      coverage: "Basic cleaning, kitchen reset, room support, and guest-prep tasks",
      offer: "Short-notice housekeeping slots are limited",
      searchTerms: ["maid", "housekeeping", "cleaning help", "temporary maid"],
      highlights: [
        "Useful for temporary support requirements",
        "Good fit for guest prep and busy weekdays",
        "Works alongside deep-clean and fabric-care services",
      ],
      problemsSolved: [
        "Regular help is unavailable today",
        "A quick home reset is needed before guests",
        "Small daily chores are piling up",
      ],
      tasks: [
        "Kitchen Reset Visit",
        "Guest Room Cleanup",
        "Living Room Quick Support",
        "Utensil Washing Assistance",
        "Bathroom Quick Clean",
        "Post-Party Home Reset",
        "Balcony Basic Cleanup",
        "Laundry Folding Support",
        "Temporary Weekday Housekeeping",
        "Weekend Maid Support",
      ],
    },
    {
      slug: "home-office-setup",
      name: "Home Office Setup",
      tagline: "Desk, cable, lighting, and productivity-space setup for work-from-home comfort.",
      description:
        "Build a cleaner work-from-home environment with practical setup help for desks, seating, lighting, and accessories.",
      image: "/services/electrician.png",
      basePrice: 899,
      responseTime: "Workspace setup appointments available in serviceable zones",
      coverage: "Desks, chairs, monitor points, cable routes, and lighting setups",
      offer: "Work-from-home setup support is trending in metros",
      searchTerms: ["home office", "desk setup", "workspace", "cable management"],
      highlights: [
        "Designed for practical daily productivity",
        "Blends assembly and electrical-lighting support",
        "Useful for new apartments and room conversions",
      ],
      problemsSolved: [
        "A home office still feels improvised",
        "Cable and lighting clutter is affecting productivity",
        "Desk and seating setup need professional help",
      ],
      tasks: [
        "Desk Assembly",
        "Monitor Mount Setup",
        "Workstation Cable Management",
        "Task Lighting Installation",
        "Ergonomic Chair Setup",
        "Printer and Device Corner Setup",
        "Shelf and Accessory Mounting",
        "Background Wall Prep",
        "Small Office Conversion Setup",
        "WFH Productivity Zone Refresh",
      ],
    },
  ];

  return seeds.map(createGeneratedService);
}

const serviceAliases: Record<string, string> = {
  appliance: "appliance-repair",
  "fan-installing": "fan-installation",
};

export const operatingCities = [
  "Bengaluru",
  "Kolkata",
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
