export type CareerRole = {
  slug: string;
  title: string;
  team: string;
  location: string;
  employmentType: string;
  summary: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
};

export const careerRoles: CareerRole[] = [
  {
    slug: "city-operations-manager",
    title: "City Operations Manager",
    team: "Operations",
    location: "Bengaluru",
    employmentType: "Full-time",
    summary: "Own daily service delivery, city quality, and escalation control.",
    overview:
      "Lead the city-level operations rhythm across bookings, assignment quality, service recovery, and team coordination.",
    responsibilities: [
      "Drive booking completion and on-time assignment metrics",
      "Coordinate city capacity with support and field teams",
      "Review escalations and quality issues daily",
    ],
    requirements: [
      "3+ years in ops, fulfillment, or marketplace execution",
      "Strong ownership across high-volume service environments",
      "Comfort with dashboards, scheduling, and customer-impact decisions",
    ],
    perks: [
      "High-ownership role in a growing service brand",
      "Fast promotion track for strong operators",
      "Cross-functional exposure with leadership teams",
    ],
  },
  {
    slug: "customer-success-lead",
    title: "Customer Success Lead",
    team: "Support",
    location: "Mumbai",
    employmentType: "Full-time",
    summary: "Run premium customer recovery and save-at-risk accounts.",
    overview:
      "This role focuses on service recovery, customer retention, and turning poor experiences into long-term trust.",
    responsibilities: [
      "Manage high-priority customer escalations",
      "Own save workflows for premium customers",
      "Improve customer feedback recovery playbooks",
    ],
    requirements: [
      "2+ years in customer success or escalations",
      "Strong written and spoken communication",
      "Able to coordinate across support, ops, and finance",
    ],
    perks: [
      "Direct impact on brand trust and retention",
      "Structured leadership coaching",
      "Hybrid work rhythm after ramp-up",
    ],
  },
  {
    slug: "growth-marketing-specialist",
    title: "Growth Marketing Specialist",
    team: "Growth",
    location: "Delhi NCR",
    employmentType: "Full-time",
    summary: "Scale demand across service categories, offers, and city rollouts.",
    overview:
      "Work on landing page performance, campaign launches, category positioning, and customer acquisition efficiency.",
    responsibilities: [
      "Plan and launch city- and category-level campaigns",
      "Improve conversion on the service discovery journey",
      "Coordinate offer-led growth across high-demand categories",
    ],
    requirements: [
      "2+ years in performance or growth marketing",
      "Experience with consumer funnels and conversion optimization",
      "Comfort with premium consumer brand positioning",
    ],
    perks: [
      "Fast experimentation environment",
      "Category ownership opportunities",
      "Strong collaboration with design and product",
    ],
  },
];

export function getCareerRoleBySlug(slug: string) {
  return careerRoles.find((role) => role.slug === slug);
}
