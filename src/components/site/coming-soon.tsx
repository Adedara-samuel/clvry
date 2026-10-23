import { CameraIcon, Disc3Icon, ShirtIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: ShirtIcon,
    kicker: "Drop 001 — Sanctuary",
    title: "The Shop",
    body: "Heavyweight hoodies, boxy tees and wide pants. Plain clothes, built to carry the cross into the street.",
  },
  {
    icon: Disc3Icon,
    kicker: "Vol. 01",
    title: "Circle Sessions",
    body: "Godly music recorded in the round. No stage, no front row, just worship from the people who wear it.",
  },
  {
    icon: CameraIcon,
    kicker: "Chapter one",
    title: "The Lookbook",
    body: "Street portraits of the faithful: the block, the studio, the sanctuary. The story behind the name.",
  },
];

export function ComingSoon() {
  return (
    <section id="coming-soon" className="mx-auto w-full max-w-7xl scroll-mt-20 px-5 py-24 md:px-8 md:py-32">
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="outline" className="border-gold/50 font-mono text-[10px] uppercase tracking-[0.3em] text-gold">
            Coming soon
          </Badge>
          <h2 className="mt-5 max-w-2xl font-display text-3xl uppercase leading-tight md:text-5xl">
            Everything else is on the way.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          We&apos;re building slowly and on purpose. Every part of CLVRY is still being prepared, so join the
          list to hear first when it opens.
        </p>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {features.map(({ icon: Icon, kicker, title, body }) => (
          <Card key={title} className="group relative gap-0 overflow-hidden py-0 ring-0">
            <CardHeader className="p-6 pb-0">
              <div className="flex items-center justify-between">
                <Icon className="size-6 text-gold" strokeWidth={1.25} />
                <Badge className="bg-fire font-mono text-[9px] uppercase tracking-[0.25em] text-paper">Soon</Badge>
              </div>
              <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{kicker}</p>
              <CardTitle className="mt-2 font-display text-2xl uppercase">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <CardDescription className="leading-relaxed">{body}</CardDescription>
            </CardContent>
            <CardFooter className="mt-auto border-t border-border px-6 py-4 font-mono text-[10px] uppercase tracking-[0.3em] text-gold">
              Coming soon
            </CardFooter>
            {/* Wine underline that grows on hover */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-fire transition-transform duration-500 group-hover:scale-x-100"
            />
          </Card>
        ))}
      </div>
    </section>
  );
}
