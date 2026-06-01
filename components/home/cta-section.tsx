import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";

export function CtaSection() {
  return (
    <section className="bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Card className="border-primary/20 bg-primary/5 shadow-lg">
          <CardContent className="p-10 sm:p-14 text-center flex flex-col items-center gap-7">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ready To Protect Yourself?
              </h2>
              <p className="text-base text-muted-foreground max-w-lg mx-auto">
                Start scanning suspicious content instantly. No credit card
                required — get your first trust analysis in under 30 seconds.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" className="group gap-2 rounded-lg font-semibold">
                Start Free Scan
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 rounded-lg font-semibold"
              >
                <Calendar className="h-4 w-4" />
                Book Demo
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Free tier available · No setup required · Enterprise plans available
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
