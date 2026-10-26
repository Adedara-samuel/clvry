# CLVRY

**Bring Christ to the street.**

CLVRY is a faith-led streetwear brand that will also release Godly music with a street sound. This repository holds the brand's landing page. Right now the live page is deliberately minimal: a scripture ticker, the hero with a glass-prism **Get early access** button and the social handles, and an early-access popup. Other sections (header, marquee, coming-soon cards, sign-up band, footer) are built but commented out in [`src/app/page.tsx`](src/app/page.tsx), and the Shop, Story and music player are parked until launch (see [Parked sections](#parked-sections)).

Developed by [Sapok](https://sapoktech.vercel.app).

---

## Contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Brand system](#brand-system)
- [Theming (light / dark)](#theming-light--dark)
- [Hero](#hero)
- [Scripture ticker](#scripture-ticker)
- [Early access and socials](#early-access-and-socials)
- [Data layer](#data-layer)
- [API routes](#api-routes)
- [Parked sections](#parked-sections)
- [Newsletter sign-up emails](#newsletter-sign-up-emails)
- [UI components (shadcn/ui)](#ui-components-shadcnui)
- [Next.js 16 notes](#nextjs-16-notes)
- [Conventions](#conventions)
- [Deployment](#deployment)
- [Roadmap / TODO](#roadmap--todo)

---

## Tech stack

| Concern         | Tool                                                                        |
| --------------- | --------------------------------------------------------------------------- |
| Framework       | [Next.js 16](https://nextjs.org) (App Router, Turbopack, Cache Components)  |
| Language        | TypeScript                                                                  |
| Styling         | Tailwind CSS v4 (CSS-first config in `globals.css`)                         |
| UI components   | [shadcn/ui](https://ui.shadcn.com) (`base-nova` style, built on Base UI)    |
| Server state    | [TanStack Query v5](https://tanstack.com/query)                             |
| Client state    | [Zustand v5](https://zustand.docs.pmnd.rs)                                  |
| Validation      | [Zod v4](https://zod.dev)                                                   |
| Icons           | lucide-react                                                                |
| Toasts          | sonner (via shadcn)                                                         |
| Fonts           | `next/font/google`: Cinzel (display), Geist (body), Geist Mono (labels)     |

## Getting started

Requirements: **Node.js 20+** (developed on Node 24) and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> The hero's opening sequence plays on every page load (~4.5s). The early-access popup opens 5.5 seconds after load.

## Scripts

| Command         | What it does                         |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server (Turbopack)     |
| `npm run build` | Production build                     |
| `npm run start` | Serve the production build           |
| `npm run lint`  | ESLint (`eslint-config-next`)        |
| `npx tsc --noEmit` | Type-check only                   |

## Project structure

```
assets/brand/            Original logo JPGs (source files, not served)
public/brand/            Transparent PNG logos used by the site (see Brand system)
src/
  app/
    layout.tsx           Root layout: fonts, <head> init script, Providers, Toaster
    page.tsx             The landing page (and how to re-enable parked sections)
    providers.tsx        TanStack QueryClientProvider + Devtools
    globals.css          Tailwind v4 theme: brand tokens, shadcn tokens, light/dark, animations
    icon.png             Favicon (gold cross on black)
    api/
      subscribe/route.ts POST: email sign-up (Zod-validated, rate-limited, emails the team)
      products/route.ts  GET: placeholder catalog (parked Shop)
      tracks/route.ts    GET: placeholder tracklist (parked Circle Sessions)
  components/
    brand/logo.tsx       <CrossMark />, <HeartLogo />, <Wordmark />
    site/                Page sections
      scripture-ticker.tsx Top bar: scrolling Luke 23:32, Gal 6:14, Heb 12:2 (NKJV) on wine
      header.tsx           Sticky header, mobile Sheet menu, theme toggle
      hero.tsx             Hero: classic open, iris reveals the video, mark dissolves (see Hero)
      hero-stage.tsx       Plays the hero video once, pauses it off-screen / in hidden tabs
      early-access-button.tsx  Glass-prism "Get early access" button → opens the popup
      socials.tsx          Instagram / X links (@clvrywrld), from lib/socials.ts
      social-icon.tsx      Inline Instagram / X glyphs
      newsletter-form.tsx  Shared sign-up form (`wine` band style / `plain` popup style)
      newsletter-popup.tsx Minimal early-access popup, opens 5.5s after load
      marquee.tsx          Scrolling wine/gold ticker
      coming-soon.tsx      "Everything else is on the way" feature cards
      newsletter.tsx       Email sign-up (Zod + TanStack mutation + toast)
      footer.tsx           Footer, wordmark, "Developed by Sapok"
      theme-toggle.tsx     Sun/moon button
      shop.tsx             (parked) Drop 001 product grid
      garment.tsx          (parked) SVG garment silhouettes for the shop
      story.tsx            (parked) "Carried from the hill" brand story
      circle-sessions.tsx  (parked) Spinning record + tracklist
    ui/                  shadcn/ui components (generated, safe to edit)
  emails/
    new-subscriber.ts    Branded HTML + text notification email
    assets.ts            Generated gold logos (base64) embedded in emails
  lib/
    mailer.ts            Nodemailer transport + env validation (server only)
    schemas.ts           Zod schemas + inferred types
    queries.ts           TanStack Query hooks (useProducts, useTracks, useSubscribe)
    query-keys.ts        Shared query keys
    prefetch.ts          Server-side prefetch for parked sections ("use cache")
    catalog.ts           Placeholder products & tracks
    socials.ts           Social handles and URLs (single source of truth)
    utils.ts             cn() helper (clsx + tailwind-merge)
  store/
    theme.ts             Zustand theme store (persisted) + theme <head> snippet
    ui.ts                Zustand UI store: mobile menu, music player state
    bag.ts               Zustand bag store (parked Shop)
```

## Brand system

### Colors

From the **CLVRY Brand Bible**: Primary Wine `#780008` (garments/graphics), Deep Antique Gold `#8C6A24` (logos, typography, embroidery), Black `#0A0A0A`, Cream `#F2EBDD`. Defined as CSS variables in [`src/app/globals.css`](src/app/globals.css) and exposed as Tailwind colors.

| Token       | Tailwind class        | Value      | Notes                                              |
| ----------- | --------------------- | ---------- | -------------------------------------------------- |
| `night`     | `bg-night` / `text-night`   | `#0A0A0A` | Brand Black                                   |
| `paper`     | `bg-paper` / `text-paper`   | `#F2EBDD` | Brand Cream                                   |
| `wine`      | `bg-wine`             | `#780008`  | Brand Primary Wine (ticker, sign-up band, scrollbar) |
| `antique`   | `text-antique`        | `#8C6A24`  | Brand Deep Antique Gold, exact (logos, gold on cream) |
| `goldenrod` | `text-goldenrod`      | `#C9A45C`  | Antique gold lifted for legibility as **text on black or wine** |
| `gold`      | `text-gold`           | theme-aware | `goldenrod` in dark, exact `antique` in light       |
| `fire`      | `bg-fire`             | `#B22222`  | Small accents only (not in the brand bible)         |
| `ink`       | `bg-ink`              | theme-aware | Page background (night ↔ paper)                   |
| `bone`      | `text-bone`           | theme-aware | Page text (paper ↔ night)                         |

**Rule of thumb:** on surfaces whose color never changes (the wine sign-up band, the fire announcement bar, text over the hero video) use the fixed tokens `paper`, `night` and `goldenrod`. Everywhere else, use shadcn's semantic classes (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border` …) or `text-gold`, so both themes work.

The corner radius is `0` on purpose (`--radius: 0rem`). Sharp edges suit streetwear, so every shadcn component inherits square corners.

### Typography

- **Wordmark "CLVRY"**: always rendered from the original artwork (`<Wordmark />`), never typed, so it is identical to the brand file.
- **Display / headings**: Cinzel (`font-display`, also shadcn's `font-heading`), the closest open font to the wordmark's flared Roman capitals.
- **Body**: Geist (`font-sans`).
- **Labels / kickers**: Geist Mono (`font-mono`), uppercase with wide tracking.

### Logos

| Component        | File                       | Artwork                                   |
| ---------------- | -------------------------- | ----------------------------------------- |
| `<CrossMark />`  | `public/brand/mark.png`    | Winged crucifix on the hill               |
| `<HeartLogo />`  | `public/brand/heart.png`   | CLVRY lettering in the heart (header)     |
| `<Wordmark />`   | `public/brand/wordmark.png`| CLVRY serif wordmark (hero, footer)       |
| `<Emblem />` (`brand/emblem.tsx`) | `public/brand/emblem-ring.png` + `emblem-c.png` | Cross through the oval with the C inside (currently unused) |

The emblem is cut from `public/brand/clvry-c-logo.jpeg` into two masks on the same 329×482 canvas: the oval and cross, and the C on its own (isolated as the connected shape inside the oval) so it can spin. Its pivot, `origin-[45.9%_65.8%]`, is the C's measured centre. If the logo file changes, regenerate both PNGs the same way and re-measure the pivot.

The PNGs are the original black-on-white JPGs (kept in `assets/brand/`) converted so that darkness becomes alpha. The components use them as **CSS masks** filled with `currentColor`, so you set a logo's color with a text class:

```tsx
<CrossMark className="w-40 text-goldenrod" label="CLVRY winged cross" />
<HeartLogo className="w-24 text-foreground" />
```

Pass `label` when the logo carries meaning (it becomes `role="img"` + `aria-label`). Leave it off for decorative uses and it is hidden from screen readers.

To replace a logo, export a new black-on-white image and regenerate the transparent PNG. Any tool that maps darkness to alpha works; the original conversion used `sharp` (thresholded greyscale → alpha channel, trimmed to content). Then update the `ratio` in `logo.tsx` if the aspect ratio changed.

## Theming (light / dark)

- The resolved theme is stored on `<html data-theme="light|dark">`.
- A tiny inline script in `<head>` (`themeInitScript` in [`src/store/theme.ts`](src/store/theme.ts)) sets it **before first paint**, so the page never flashes the wrong theme. It reads the user's saved choice, falling back to the OS preference.
- The choice is saved by a Zustand store using the `persist` middleware (`localStorage` key `clvry-theme`).
- Tailwind's `dark:` variant is remapped to `[data-theme="dark"]` in `globals.css`, so `dark:` utilities follow the toggle rather than the OS.
- `ThemeToggle` swaps its sun/moon icons with CSS (`dark:hidden` / `dark:block`), which keeps server and client markup identical (no hydration mismatch).
- Without JS, a `prefers-color-scheme` media query fallback still applies the right palette.

To change a color in one theme only, edit the `:root` block (dark default) or the `:root[data-theme="light"]` block. Keep the no-JS fallback block in sync with the light block.

## Hero

[`hero.tsx`](src/components/site/hero.tsx) plays a short opening sequence on every page load:

1. The classic hero: cream (or black) with the wine glow, the winged cross and the wordmark.
2. At 0.6s an iris opens from the cross and reveals the video underneath.
3. At 2.8s the mark and wordmark dissolve, and their space closes so the button and socials glide up to the centre.
4. The video plays **once** and freezes on its final frame ("Welcome to CLVRY WRLD"). "Christ Above All" then rises in at the top left.

How it works:

- The sequence is **pure CSS**. The timings are the `.hero-cover`, `.hero-brand*` and `.hero-in` rules in `globals.css`, and each element's `--d` delay in `hero.tsx`.
- The video files are in `public/videos/`: `clvry-hero.webm` and `clvry-hero.mp4` for desktop, and a 720p `clvry-hero-mobile.mp4` for screens under 768px. All are made from `public/brand/clvry_hero_intro.mp4` with the audio stripped and `+faststart`. `public/images/clvry-hero-poster.jpg` is its final frame.
- [`hero-stage.tsx`](src/components/site/hero-stage.tsx) pauses the video when the hero is off-screen or the tab is hidden, and never restarts it once it has ended.
- A radial "pool" of cream (light) or near-black (dark) behind the text keeps it legible over the footage, and it cross-fades when the theme changes.
- `prefers-reduced-motion` users skip straight to the end state: the poster as a still, with no animation.

### Scrollbar

Styled to the brand in `globals.css`: a thin wine thumb on the page background, turning antique gold on hover (`scrollbar-color` for Firefox, `::-webkit-scrollbar` for Chrome, Edge and Safari).

## Scripture ticker

[`scripture-ticker.tsx`](src/components/site/scripture-ticker.tsx) is the wine bar at the top of the page. It scrolls Luke 23:32, Galatians 6:14 and Hebrews 12:2 (NKJV) continuously and pauses on hover. Screen readers get the verses once as a list, and the moving copy is hidden from them. To change the verses, edit the `verses` array. Keep the NKJV copyright notice in the file comment when quoting NKJV.

## Early access and socials

- **Get early access** ([`early-access-button.tsx`](src/components/site/early-access-button.tsx)) is the hero's main button. It has the glass-prism look (`.btn-prism` in `globals.css`): a frosted translucent body, a slowly rotating iridescent edge, and a light sheen that sweeps across on hover. Clicking it opens the early-access popup.
- **Social handles** live in [`src/lib/socials.ts`](src/lib/socials.ts) (Instagram and X, both `@clvrywrld`) and render via `<Socials />` in the hero and the popup. Add or change a network there.

## Data layer

The stack's three state/validation libraries each have one job:

- **Zod** ([`lib/schemas.ts`](src/lib/schemas.ts)) is the single source of truth for data shapes. Types are inferred from the schemas (`z.infer`). The same `subscribeSchema` validates the form on the client **and** the request on the server.
- **TanStack Query** ([`lib/queries.ts`](src/lib/queries.ts)) handles everything fetched from the server. Responses are parsed through Zod before reaching components. `useSubscribe` is a mutation that powers the sign-up form. The Query Devtools appear in development (bottom-left button).
- **Zustand** ([`store/`](src/store)) holds client-only UI state: the theme, the mobile menu, the music player, and the shopping bag.

## API routes

| Route            | Method | Body                 | Response                                       |
| ---------------- | ------ | -------------------- | ---------------------------------------------- |
| `/api/subscribe` | POST   | `{ "email": string }` | `200 { ok: true }`, or `400`/`429`/`500` `{ ok: false, error }`. Emails the sign-up to `CONTACT_TO_EMAIL` |
| `/api/products`  | GET    | none                 | `Product[]` (placeholder, parked Shop)         |
| `/api/tracks`    | GET    | none                 | `Track[]` (placeholder, parked Circle Sessions)|

`/api/subscribe` also returns `429` after 5 attempts from one IP in 10 minutes, and `500` if the email can't be sent.

## Newsletter sign-up emails

The sign-up form (`newsletter-form.tsx`) appears in two places:

- the wine **"The list"** section on the page (`#notify`, currently commented out), and
- a minimal **"Get early access" popup** (`newsletter-popup.tsx`, shadcn Dialog, theme-aware, with one underlined email field). It opens automatically **5.5 seconds after load**, once the hero's opening sequence has played (`POPUP_DELAY_MS`), unless the visitor already signed up or closed it during this page load (that state lives in the Zustand UI store, in memory only, so a refresh resets it). It also opens any time someone clicks **Get early access**.

Every sign-up on the website sends a branded notification email to the inbox in `CONTACT_TO_EMAIL`.

**Flow:** form (`newsletter.tsx`) → `useSubscribe` mutation → `POST /api/subscribe` → Zod validation → rate-limit check → `sendNotification()` ([`src/lib/mailer.ts`](src/lib/mailer.ts), Nodemailer over SMTP) → toast on the page.

**The email** ([`src/emails/new-subscriber.ts`](src/emails/new-subscriber.ts)):

- Sender name **"CLVRY Website"**, subject `[CLVRY Website] New newsletter sign-up: <email>`, and a "From the website · Newsletter" badge, so it's always clear where it came from.
- Brand-bible colors: a black header with the antique-gold CLVRY wordmark and a wine stripe, then a details card (email, time in UTC, source, page) and a "Write to subscriber" button. It closes with the winged cross, "Bring Christ to the street", and a "Developed by Sapok" footer.
- `Reply-To` is set to the subscriber, so hitting reply writes to them directly.
- Built with tables and inline styles (what Gmail, Outlook and Apple Mail reliably render), responsive below 620px, with a plain-text version included.
- The logos are embedded as inline (CID) attachments from [`src/emails/assets.ts`](src/emails/assets.ts), so they show even before the site is deployed. That file is generated: gold-tinted, base64 copies of `public/brand/wordmark.png` and `mark.png`. If the logos change, regenerate it the same way (alpha channel of the PNG joined onto a solid `#8C6A24` image with `sharp`).
- All user-supplied values are HTML-escaped before going into the template.

### Environment variables

Copy [`.env.example`](.env.example) to `.env.local` (git-ignored) and fill it in:

| Variable           | Example              | Purpose                                                    |
| ------------------ | -------------------- | ---------------------------------------------------------- |
| `SMTP_HOST`        | `smtp.gmail.com`     | SMTP server                                                |
| `SMTP_PORT`        | `465`                | `465` = TLS (used here); `587` = STARTTLS                  |
| `SMTP_USER`        | `sender@gmail.com`   | Account that sends the notifications                       |
| `SMTP_PASS`        | 16-char app password | For Gmail, an **App Password**, not the account password   |
| `CONTACT_TO_EMAIL` | `inbox@example.com`  | Where every sign-up notification is delivered              |

The variables are validated with Zod on the first send. If any are missing, the API returns `500` and the server log names the missing ones; the build itself doesn't need them. On Vercel, add the same five variables under **Project → Settings → Environment Variables**.

> Sign-ups are delivered by email only and not stored in a database. To build a mailing list
> you can send campaigns to, add a provider (Resend, Mailchimp, ConvertKit…) or a database
> write next to `sendNotification()` in the route.

## Parked sections

The Shop, Story and Circle Sessions sections are fully built but commented out of the page while everything is "coming soon". The step-by-step instructions to switch them back on are in the comment at the top of [`src/app/page.tsx`](src/app/page.tsx). In short:

1. Import `Shop`, `Story`, `CircleSessions`, `HydrationBoundary`, `Suspense` and `getLandingState`.
2. Make `Home` async and wrap the page in `<HydrationBoundary state={await getLandingState()}>`.
3. Render the three sections in place of `<ComingSoon />`. Wrap `Shop` and `CircleSessions` in `<Suspense>` (see [Next.js 16 notes](#nextjs-16-notes)).
4. Point the header nav links back at `#shop`, `#story` and `#circle`, and restore the bag count in the header (`useBag`).

Product images are placeholders: `garment.tsx` draws SVG silhouettes. Swap these for real photography (`next/image`) when it's ready, and replace `lib/catalog.ts` with a real commerce/CMS source.

## UI components (shadcn/ui)

- Configuration: [`components.json`](components.json). The style is `base-nova`, which builds on **Base UI** (`@base-ui/react`), not Radix. Polymorphism uses the `render` prop instead of `asChild`:

  ```tsx
  <SheetTrigger render={<Button variant="ghost" size="icon" />}>…</SheetTrigger>
  ```

- To style a link as a button, use `buttonVariants`:

  ```tsx
  <a href="#notify" className={cn(buttonVariants({ variant: "outline" }), "h-12 px-8")}>…</a>
  ```

- Add components with `npx shadcn@latest add <name>`. Afterwards:
  - Check that the new file imports `cn` from `@/lib/utils`. The CLI has been seen writing `from "cn"` and adding an unrelated npm package called `cn`. If that happens, fix the import and run `npm uninstall cn`.
  - The generated `sonner.tsx` imports `next-themes`. This project uses its own Zustand theme store instead (already patched), so don't reinstall `next-themes`.
  - If the CLI rewrites `globals.css`, re-check the brand tokens, the `dark` custom variant, and `--font-sans` (the CLI once wrote a self-referencing `--font-sans: var(--font-sans)`).

## Next.js 16 notes

This project uses Next.js 16 with **Cache Components** (`cacheComponents: true` in `next.config.ts`). Its docs ship inside the package at `node_modules/next/dist/docs/`, and they are the reference for this version.

Things that bit during setup:

- **No `Date.now()` during prerender.** TanStack's `dehydrate()` and `useQuery()` read the clock. So server prefetching lives in a `"use cache"` function (`lib/prefetch.ts`), and any client component that calls `useQuery` must be wrapped in `<Suspense>`.
- **Don't export non-component values from `"use client"` files** and import them into server components; they arrive as client references, not values. That's why `themeInitScript` lives in `store/theme.ts`, not in a component file.
- Tailwind v4 no longer gives buttons a pointer cursor. A base rule in `globals.css` restores `cursor: pointer` for every clickable element (`a[href]`, enabled buttons, `[role=button]`, `label[for]`, …) and `not-allowed` for disabled ones.

## Conventions

- **Path alias:** `@/` maps to `src/`.
- **Class names:** compose with `cn()` from `@/lib/utils`.
- **Sections** live in `components/site/`, one per file, and are server components unless they need state or effects.
- **Comments** explain _why_, not _what_.
- **Accessibility:** decorative brand marks are `aria-hidden`, meaningful ones get a `label`; form errors use `role="alert"` and `aria-describedby`; all motion respects `prefers-reduced-motion`.

## Deployment

The site is a standard Next.js app and deploys as-is to [Vercel](https://vercel.com):

1. Push the repository to GitHub.
2. Import it in Vercel (framework preset: Next.js, no extra settings).
3. Add the five SMTP variables from [Environment variables](#environment-variables), or sign-ups will fail with a `500`.

Other Node hosts work with `npm run build && npm run start`.
## Roadmap / TODO

- [x] Email every newsletter sign-up to the team inbox
- [ ] Store subscribers in a mailing-list provider (for sending campaigns)
- [ ] Real product photography and a commerce backend for the Shop
- [ ] Audio hosting/streaming for Circle Sessions (the player UI exists; it has no audio source yet)
- [ ] Lookbook content
- [ ] Social links in the footer once accounts are live
- [ ] Open Graph image for link previews (`src/app/opengraph-image.png`)

---

© CLVRY. All glory to God. Developed by [Sapok](https://sapoktech.vercel.app).
