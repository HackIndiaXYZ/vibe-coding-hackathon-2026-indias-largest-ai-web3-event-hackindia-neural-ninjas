import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create Account — TruScan AI",
  description:
    "Join TruScan AI and start protecting yourself from scam calls, phishing SMS, deepfakes, and AI voice clones.",
};

export default function SignUpPage() {
  return (
    <AuthLayout
      heading="Create Your Account"
      description="Join TruScan AI and stay protected online."
      googleLabel="Sign up with Google"
      footerText="Already have an account?"
      footerLinkLabel="Sign in"
      footerLinkHref="/sign-in"
    />
  );
}
