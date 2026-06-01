import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Brain, ShieldCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload or Paste Content",
    description:
      "Submit a phone call recording, SMS text, URL, image, or video clip. TruScan AI supports all common formats for instant analysis.",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Analysis",
    description:
      "Our multi-model AI engine scans for voice cloning signatures, scam patterns, phishing indicators, deepfake artifacts, and known threat intelligence.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Get Trust Score & Recommendations",
    description:
      "Receive a detailed trust score, risk breakdown, and clear recommendations — in seconds. Know exactly what to do next.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge
            variant="outline"
            className="mb-4 border-border text-muted-foreground"
          >
            Simple Process
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How TruScan AI Works
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
            Three simple steps to protect yourself from the most sophisticated
            digital threats.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute top-10 left-[calc(50%+2rem)] hidden w-[calc(100%-4rem)] h-px bg-border md:block"
                />
              )}

              <Card className="relative h-full border-border hover:border-primary/30 hover:shadow-md transition-all duration-300">
                <CardContent className="p-6 flex flex-col gap-4">
                  {/* Icon + step */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <span className="text-3xl font-black text-border select-none">
                      {step.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
