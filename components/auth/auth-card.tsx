import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import { Shield, Lock } from "lucide-react";

interface AuthCardProps {
  heading: string;
  description: string;
  googleLabel: string;
}

export function AuthCard({ heading, description, googleLabel }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md border-border bg-card shadow-xl rounded-2xl overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-primary" />

      <CardHeader className="px-8 pt-8 pb-4 flex flex-col items-center text-center gap-3">
        {/* Badge */}
        <Badge
          variant="secondary"
          className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-border text-muted-foreground"
        >
          <Lock className="h-3 w-3 text-primary" />
          Secure Authentication
        </Badge>

        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 mt-1">
          <Shield className="h-6 w-6 text-primary" />
        </div>

        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold text-foreground">
            {heading}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-8 pb-8 flex flex-col gap-5">
        <GoogleSignInButton label={googleLabel} />

        <p className="text-center text-xs text-muted-foreground leading-relaxed">
          By continuing you agree to our{" "}
          <a
            href="/terms"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
