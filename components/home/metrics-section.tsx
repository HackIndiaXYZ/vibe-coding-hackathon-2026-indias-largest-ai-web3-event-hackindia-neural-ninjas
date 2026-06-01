import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Zap, Target, Activity } from "lucide-react";

const stats = [
  {
    icon: TrendingDown,
    value: "40%",
    label: "Less Fraud Risk",
    description: "Average fraud risk reduction for TruScan AI users",
  },
  {
    icon: Zap,
    value: "3x",
    label: "Faster Detection",
    description: "Compared to traditional manual review processes",
  },
  {
    icon: Target,
    value: "99.2%",
    label: "Accuracy",
    description: "Verified across 10M+ real-world threat samples",
  },
  {
    icon: Activity,
    value: "10M+",
    label: "Threat Signals Processed",
    description: "And growing every day with new threat intelligence",
  },
];

export function MetricsSection() {
  return (
    <section className="bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge
            variant="outline"
            className="mb-4 border-border text-muted-foreground"
          >
            By The Numbers
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted Security Intelligence
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
            Real results from real deployments across security teams, enterprises,
            and individual users worldwide.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="group border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-4xl font-black tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    {stat.label}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
