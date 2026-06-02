import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign In — TruScan AI",
  description:
    "Sign in to TruScan AI to access AI-powered scam detection, deepfake analysis, and real-time threat protection.",
};

export default function SignInPage() {
  return (
    <AuthLayout
      heading="Welcome Back"
      description="Continue with your Google account to access TruScan AI."
      googleLabel="Continue with Google"
      footerText="Don't have an account?"
      footerLinkLabel="Create one"
      footerLinkHref="/sign-up"
    />
  );
}
