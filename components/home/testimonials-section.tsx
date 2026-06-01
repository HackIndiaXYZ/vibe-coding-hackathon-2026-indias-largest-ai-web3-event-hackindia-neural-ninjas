import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Head of Security",
    company: "FinServ India",
    initials: "PS",
    rating: 5,
    quote:
      "TruScan AI reduced our fraud incidents by 43% in the first quarter. The voice clone detection caught attacks our previous system completely missed.",
  },
  {
    name: "Rahul Mehta",
    role: "CISO",
    company: "TechNova Solutions",
    initials: "RM",
    rating: 5,
    quote:
      "We evaluated six vendors and TruScan AI was the only one with real-time deepfake detection under 2 seconds. Our team trusts it for enterprise-level threat analysis.",
  },
  {
    name: "Aisha Khan",
    role: "Cybersecurity Analyst",
    company: "SecureGrid",
    initials: "AK",
    rating: 5,
    quote:
      "The SMS fraud detection alone has saved our customers millions. The threat intelligence dashboard gives a complete picture of emerging attack patterns.",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4 border-border text-muted-foreground">
            Customer Stories
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted By Security Teams
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
            Security professionals at leading organizations rely on TruScan AI every day.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="group border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <CardContent className="p-6 flex flex-col gap-5 flex-1">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.role} · {t.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
