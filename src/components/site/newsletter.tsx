import { NewsletterForm } from "./newsletter-form";

export function Newsletter() {
  return (
    <section id="notify" className="scroll-mt-16 bg-wine px-5 py-24 text-center text-paper">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-goldenrod">The list</p>
      <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl uppercase md:text-4xl">
        First to the drop. First in the circle.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm text-paper/70">
        The shop, Circle Sessions and the lookbook are coming soon. Leave your email and we&apos;ll tell you
        the moment they open.
      </p>
      <NewsletterForm />
    </section>
  );
}
