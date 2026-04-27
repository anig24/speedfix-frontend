import {
  BellRing,
  ClipboardList,
  Headset,
  LifeBuoy,
  PhoneCall,
  ShieldAlert,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AgentQueueConfig = {
  slug: string;
  title: string;
  description: string;
  queueType: string;
  icon: LucideIcon;
  summaryStats: string[];
};

export const agentQueues: AgentQueueConfig[] = [
  {
    slug: "call-queue",
    title: "Call Queue",
    description:
      "Daily outbound and inbound calling desk for booking follow-up, slot confirmation, and issue clarification.",
    queueType: "CALL_QUEUE",
    icon: PhoneCall,
    summaryStats: ["Fresh calls", "Today's callback list", "Warm customer queue"],
  },
  {
    slug: "customer-desk",
    title: "Customer Desk",
    description:
      "Manage customers who need status help, booking guidance, or post-booking clarity without using the corporate manager portal.",
    queueType: "CUSTOMER_DESK",
    icon: Users,
    summaryStats: ["Open customer cases", "Booking-linked support", "Live follow-up context"],
  },
  {
    slug: "follow-ups",
    title: "Follow-ups",
    description:
      "Track promised callbacks, revisit communication, payment reminders, and service-completion follow-ups.",
    queueType: "FOLLOW_UP",
    icon: ClipboardList,
    summaryStats: ["Callbacks due", "Pending promises", "Daily close loop queue"],
  },
  {
    slug: "escalations",
    title: "Escalations",
    description:
      "Handle unhappy customers, failed service experiences, and cases that must be raised to operations or leadership.",
    queueType: "ESCALATION",
    icon: ShieldAlert,
    summaryStats: ["Critical issues", "Manager handoff", "Recovery tasks"],
  },
];

export const agentQuickLinks = [
  { label: "Call Queue", href: "/agent/call-queue", icon: PhoneCall },
  { label: "Customer Desk", href: "/agent/customer-desk", icon: Headset },
  { label: "Follow-ups", href: "/agent/follow-ups", icon: ClipboardList },
  { label: "Escalations", href: "/agent/escalations", icon: LifeBuoy },
  { label: "Alerts", href: "/agent/escalations", icon: BellRing },
];

export function getAgentQueueBySlug(slug: string) {
  return agentQueues.find((queue) => queue.slug === slug);
}
