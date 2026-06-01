import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Phone,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Zap,
  TrendingUp,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-20 pb-16 lg:pt-28 lg:pb-24">
      {/* Subtle background pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[400px] w-[500px] rounded-full bg-muted/60 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left side */}
          <div className="flex flex-col gap-7">
            <div>
              <Badge
                variant="outline"
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium border-primary/30 text-primary bg-primary/5"
              >
                <Zap className="h-3 w-3" />
                AI-Powered Trust Detection
              </Badge>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
              Detect Scam Calls,{" "}
              <span className="text-primary">Fake SMS</span> &{" "}
              <br className="hidden sm:block" />
              Deepfakes Instantly
            </h1>

            <p className="text-base text-muted-foreground sm:text-lg leading-relaxed max-w-lg">
              TruScan AI uses advanced machine learning to protect you from
              scam calls, phishing attacks, AI voice clones, and deepfakes —
              in real time, before it costs you.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" className="group gap-2 rounded-lg font-semibold">
                Start Free Scan
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-lg font-semibold"
              >
                Learn More
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { icon: TrendingUp, label: "10M+ Threats Analyzed" },
                { icon: CheckCircle, label: "99.2% Accuracy" },
                { icon: Zap, label: "Real-Time Detection" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-medium text-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side — Dashboard preview */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="w-full max-w-md space-y-3">
              {/* Incoming call card */}
              <Card className="shadow-md border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                        <Phone className="h-5 w-5 text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Incoming Call
                        </p>
                        <p className="text-xs text-muted-foreground">
                          +91 98XXX XXXXX
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="destructive"
                      className="text-xs animate-pulse"
                    >
                      Scam Detected
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Score card */}
              <Card className="shadow-md border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        Trust Score
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs border-destructive/40 text-destructive">
                      HIGH RISK
                    </Badge>
                  </div>

                  {/* Score bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-bold text-destructive">12 / 100</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-destructive transition-all duration-1000"
                        style={{ width: "12%" }}
                      />
                    </div>
                  </div>

                  {/* Voice authenticity */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        Voice Authenticity
                      </span>
                      <span className="text-xs font-semibold text-destructive">
                        AI Clone Detected
                      </span>
                    </div>
                    {/* Waveform bars */}
                    <div className="flex items-end gap-0.5 h-8">
                      {[40, 70, 55, 85, 45, 90, 60, 75, 50, 80, 65, 88, 42, 70, 55].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-sm bg-destructive/40"
                            style={{ height: `${h}%` }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alert card */}
              <Card className="border-destructive/20 bg-destructive/5 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        ⚠ Scam Alert Triggered
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Caller voice is AI-generated. Multiple fraud patterns
                        identified. Do not share any personal information.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 hidden lg:block">
                <div className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-ping" />
                  Live Scanning
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
