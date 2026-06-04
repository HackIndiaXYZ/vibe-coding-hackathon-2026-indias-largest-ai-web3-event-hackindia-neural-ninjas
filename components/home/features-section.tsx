import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  MessageSquare,
  Video,
  ShieldAlert,
  Lightbulb,
} from "lucide-react";

const features = [
  {
    icon: Phone,
    title: "Scam Call Detection",
    description:
      "Real-time analysis of call patterns, caller ID spoofing, and known scam numbers.",
    primary: true,
    span: "",
  },
  {
    icon: MessageSquare,
    title: "SMS Fraud Detection",
    description:
      "Catch phishing SMS and smishing attacks before you click a malicious link.",
    primary: false,
    span: "",
  },
  {
    icon: Video,
    title: "Deepfake Detection",
    description:
      "Advanced forensic analysis to identify manipulated images and videos.",
    primary: false,
    span: "",
  },
  {
    icon: ShieldAlert,
    title: "Risk Scoring System",
    description:
      "AI-powered composite risk scores that quantify threat severity across calls, messages, and media — so you always know how dangerous a situation is.",
    primary: false,
    span: "",
  },
  {
    icon: Lightbulb,
    title: "Recommendation",
    description:
      "Personalised, actionable next steps surfaced after every scan — block, report, or safely ignore with confidence backed by AI reasoning.",
    primary: false,
    span: "",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge
            variant="outline"
            className="mb-4 border-border text-muted-foreground"
          >
            Capabilities
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need To Stay Safe
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
            A comprehensive AI security suite covering every attack vector used
            by modern digital fraudsters.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className={[
                "group relative border-border transition-all duration-300 hover:shadow-md",
                feature.primary
                  ? "border-primary/30 bg-primary/5 hover:border-primary/50 lg:col-span-2"
                  : "hover:border-primary/20",
                feature.span,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {feature.primary && (
                <div className="absolute top-4 right-4">
                  <Badge className="text-[10px]">Primary Feature</Badge>
                </div>
              )}
              <CardContent className="p-6 flex flex-col gap-3">
                <div
                  className={[
                    "flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300",
                    feature.primary
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                  ].join(" ")}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3
                  className={[
                    "font-semibold",
                    feature.primary
                      ? "text-base text-foreground"
                      : "text-sm text-foreground",
                  ].join(" ")}
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
