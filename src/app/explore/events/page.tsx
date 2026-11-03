import type { Metadata } from "next";
import { ExploreBanner } from "@/components/explore/explore-banner";
import { ExploreNext } from "@/components/explore/explore-next";
import { Shot } from "@/components/explore/shot";
import { EarlyAccessButton } from "@/components/site/early-access-button";
import { events } from "@/lib/explore";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Events — CLVRY",
  description: "Where CLVRY gathers: worship with a street sound, art on the walls, the people in the room.",
};

const formats = [
  {
    n: "01",
    name: "Sound",
    title: "Worship on the decks",
    body: "Godly music with a street sound, loud enough to feel in your chest. Praise that doesn't ask you to sit still.",
    images: [events["speaker-cross"], events["at-the-decks"]],
  },
  {
    n: "02",
    name: "Gallery",
    title: "Faith on the walls",
    body: "Art nights in raw rooms: prints, installations, and the garment laid out on the floor before anyone else sees it.",
    images: [events["gallery-night"], events["tee-field"]],
  },
  {
    n: "03",
    name: "Circle",
    title: "Vision-board nights",
    body: "Scissors, magazines and prayer. Making plans with God in the room, and friends either side of you.",
    images: [events["vision-board"]],
  },
];

export default function EventsPage() {
  return (
    <>
      <ExploreBanner
        index="03"
        name="Events"
        line="Where we gather. Worship with a street sound, art on the walls, the people in the room."
        images={Object.values(events)}
      />

      {/* Statement */}
      <section className="px-5 py-20 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">— The gathering</p>
          <p className="reveal mt-8 max-w-4xl font-display text-3xl uppercase leading-tight md:text-6xl">
            Church doesn&apos;t end <span className="text-gold">at the door.</span>
          </p>
          <p className="reveal mt-8 max-w-xl leading-relaxed text-muted-foreground">
            We bring the sound, the art and the people together: worship nights that move like a rave, and
            galleries that feel like a sanctuary. Come as you are and leave lighter.
          </p>
        </div>
      </section>

      {/* Formats */}
      <section className="border-t border-border px-5 py-20 md:px-12 md:py-32">
        <ol className="mx-auto flex max-w-6xl flex-col gap-20 md:gap-32">
          {formats.map((f, i) => (
            <li key={f.n} className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
              <div
                className={cn(
                  "grid gap-3 md:col-span-7",
                  f.images.length > 1 && "grid-cols-[3fr_2fr] items-end",
                  i % 2 && "md:order-2",
                )}
              >
                {f.images.map((image, j) => (
                  <Shot
                    key={image.src}
                    image={image}
                    crop={f.images.length === 1 ? "aspect-[4/5] md:aspect-[5/4]" : j === 0 ? "aspect-[4/5]" : "aspect-[3/4]"}
                    sizes="(min-width: 768px) 35vw, 60vw"
                    className={cn(j === 1 && "mb-10")}
                  />
                ))}
              </div>
              <div className={cn("reveal md:col-span-5", i % 2 && "md:order-1")}>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">
                  {f.n} — {f.name}
                </p>
                <h3 className="mt-4 font-display text-3xl uppercase tracking-[0.04em] md:text-5xl">{f.title}</h3>
                <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* The calendar: nothing announced yet, so it says so and points to the list. */}
      <section className="grid border-t border-border md:grid-cols-12">
        <div className="relative overflow-hidden bg-night md:col-span-5">
          <Shot image={events["jesus-raves"]} crop="aspect-[4/5] md:aspect-auto md:h-full" className="md:h-full" />
        </div>
        <div className="flex flex-col justify-center px-5 py-16 md:col-span-7 md:px-16 md:py-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">— The calendar</p>
          <h2 className="mt-4 font-display text-3xl uppercase md:text-5xl">No dates yet.</h2>
          <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
            The first gathering is being planned now. Subscribers hear first: the city, the date, and how to get
            in.
          </p>

          <ul className="mt-10 border-t border-border font-mono text-[11px] uppercase tracking-[0.2em]">
            {formats.map((f) => (
              <li key={f.n} className="flex items-center gap-4 border-b border-border py-4">
                <span className="text-gold">{f.n}</span>
                <span className="flex-1">{f.name}</span>
                <span className="whitespace-nowrap text-muted-foreground">City TBA</span>
                <span className="whitespace-nowrap text-muted-foreground">Date TBA</span>
              </li>
            ))}
          </ul>

          <EarlyAccessButton className="mt-10 h-12 w-fit px-9">Notify me</EarlyAccessButton>
        </div>
      </section>

      <ExploreNext current="events" />
    </>
  );
}
