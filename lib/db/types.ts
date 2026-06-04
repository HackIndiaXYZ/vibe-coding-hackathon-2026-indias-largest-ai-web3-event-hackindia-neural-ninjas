/**
 * lib/db/types.ts
 * Shared TypeScript types for TruScan AI database rows.
 */

export type Plan = "free" | "pro" | "enterprise";
export type ScanType = "voice" | "message" | "call";
export type RiskLevel = "Low" | "Medium" | "High";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  credits: number;
  plan: Plan;
  created_at: string;
  updated_at: string;
}

export interface Scan {
  id: string;
  user_id: string;
  scan_type: ScanType;
  input_summary: string | null;
  result: Record<string, unknown>;
  confidence_score: number | null;
  risk_level: RiskLevel | null;
  is_threat: boolean;
  credits_used: number;
  created_at: string;
}

// ── Credit costs per scan type ─────────────────────────────
export const SCAN_CREDITS: Record<ScanType, number> = {
  voice:   5,
  message: 2,
  call:    10,
};

// ── Plan configuration ─────────────────────────────────────
export interface PlanConfig {
  id: Plan;
  name: string;
  price: string;
  priceNum: number; // monthly price in INR
  credits: number;
  features: string[];
  badge?: string;
  popular?: boolean;
}

export const PLANS: PlanConfig[] = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    priceNum: 0,
    credits: 100,
    features: [
      "100 Credits",
      "Voice / SMS / Call scans",
      "7-day scan history",
      "Standard processing",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹499/mo",
    priceNum: 499,
    credits: 1000,
    popular: true,
    badge: "Most Popular",
    features: [
      "1,000 Credits / month",
      "Priority processing",
      "Advanced reports",
      "30-day scan history",
      "Email alerts",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "₹1,999/mo",
    priceNum: 1999,
    credits: 999999,
    badge: "Best Value",
    features: [
      "Unlimited Credits",
      "Team analytics",
      "API access",
      "Custom reports",
      "Dedicated support",
      "SLA guarantee",
    ],
  },
];

export const PLAN_CREDITS: Record<Plan, number> = {
  free:       100,
  pro:        1000,
  enterprise: 999999,
};

export const SCAN_TYPE_LABELS: Record<ScanType, string> = {
  voice:   "Voice Scan",
  message: "SMS / Message Scan",
  call:    "Fraud Call Analysis",
};
