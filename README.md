# CLVRY

**Bring Christ to the street.**

CLVRY is a faith-led streetwear brand that also hosts _Circle Sessions_: Godly music recorded in the round. This repository holds the brand's landing page. Right now the site is a **coming-soon page**: the hero, the brand story banner, a "coming soon" overview of every feature, and an email sign-up. The Shop, Story and Circle Sessions sections are built but parked until launch (see [Parked sections](#parked-sections)).

Developed by [Sapok](https://sapoktech.vercel.app).

---

## Contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Brand system](#brand-system)
- [Theming (light / dark)](#theming-light--dark)
- [Intro loading screen](#intro-loading-screen)
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

> The intro screen plays once per browser session. To see it again, open a new tab/window
> or clear `sessionStorage` key `clvry-intro` in DevTools.

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
    layout.tsx           Root layout: fonts, <head> init script, Intro, Providers, Toaster
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
      intro.tsx            Loading screen: "Bring Christ to the street"
      header.tsx           Sticky header, mobile Sheet menu, theme toggle
      hero.tsx             Hero with mark + wordmark
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
    intro.ts             Intro session key + <head> snippet
    utils.ts             cn() helper (clsx + tailwind-merge)
  store/
    theme.ts             Zustand theme store (persisted) + theme <head> snippet
    ui.ts                Zustand UI store: mobile menu, music player state
    bag.ts               Zustand bag store (parked Shop)
```

## Brand system

### Colors

Defined as CSS variables in [`src/app/globals.css`](src/app/globals.css) and exposed as Tailwind colors.

| Token       | Tailwind class        | Value      | Notes                                              |
| ----------- | --------------------- | ---------- | -------------------------------------------------- |
| `night`     | `bg-night` / `text-night`   | `#0b0a0a` | Fixed black                                   |
| `paper`     | `bg-paper` / `text-paper`   | `#f4efe6` | Fixed off-white (from the wordmark artwork)   |
| `wine`      | `bg-wine`             | `#5e0b1a`  | Brand wine                                         |
| `fire`      | `bg-fire`             | `#b22222`  | Brand firebrick red                                |
| `goldenrod` | `text-goldenrod`      | `#daa520`  | Fixed gold, for use **on wine/fire surfaces**      |
| `gold`      | `text-gold`           | theme-aware | `#daa520` in dark, deeper `#a87a0c` in light for legibility on paper |
| `ink`       | `bg-ink`              | theme-aware | Page background (night ↔ paper)                   |
| `bone`      | `text-bone`           | theme-aware | Page text (paper ↔ night)                         |

**Rule of thumb:** on surfaces whose color never changes (the wine sign-up band, the fire announcement bar, the intro) use the fixed tokens `paper`, `night` and `goldenrod`. Everywhere else, use shadcn's semantic classes (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border` …) or `text-gold`, so both themes work.

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

## Intro loading screen

[`src/components/site/intro.tsx`](src/components/site/intro.tsx) shows the "Bring Christ to the street" sequence:

1. The winged cross is raised from the hill (clip-path reveal).
2. "Bring Christ" / "to the street" rise in.
3. A road line with moving center dashes fills in fire red ("from the hill · to the block").
4. The screen slides up and away (~3s total).

How it works:

- The animation is **pure CSS** (`.intro*` rules in `globals.css`) and the overlay is server-rendered, so it covers the page before React hydrates.
- Page scroll is locked while it plays. When the exit animation ends, JS sets `data-intro="seen"` on `<html>` (unlocking scroll) and stores `clvry-intro` in `sessionStorage`. A 4.5s timeout does the same as a safety net.
- On later loads in the same session, the `<head>` snippet (`introInitScript` in [`src/lib/intro.ts`](src/lib/intro.ts)) sets `data-intro="seen"` immediately, so the intro never paints.
- `prefers-reduced-motion` users get a short static version.

To change timing, edit the `animation` delays in the `.intro*` CSS and the inline `animationDelay` values in `intro.tsx`. Keep the safety-net timeout longer than the whole sequence.

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

- the wine **"The list"** section on the page (`#notify`), and
- a **popup** (`newsletter-popup.tsx`, shadcn Dialog) that opens **2 minutes** after the page loads (`POPUP_DELAY_MS`). It doesn't open if the visitor already signed up. Once closed, it stays closed until the page is refreshed: that state lives in the Zustand UI store (memory only, deliberately not persisted).

Every sign-up on the website sends a branded notification email to the inbox in `CONTACT_TO_EMAIL`.

**Flow:** form (`newsletter.tsx`) → `useSubscribe` mutation → `POST /api/subscribe` → Zod validation → rate-limit check → `sendNotification()` ([`src/lib/mailer.ts`](src/lib/mailer.ts), Nodemailer over SMTP) → toast on the page.

**The email** ([`src/emails/new-subscriber.ts`](src/emails/new-subscriber.ts)):

- Sender name **"CLVRY Website"**, subject `[CLVRY Website] New newsletter sign-up: <email>`, and a "From the website · Newsletter" badge, so it's always clear where it came from.
- Black header with the gold CLVRY wordmark and a fire-red stripe, then a details card (email, time in UTC, source, page) and a "Write to subscriber" button. It closes with the winged cross, "Bring Christ to the street", and a "Developed by Sapok" footer.
- `Reply-To` is set to the subscriber, so hitting reply writes to them directly.
- Built with tables and inline styles (what Gmail, Outlook and Apple Mail reliably render), responsive below 620px, with a plain-text version included.
- The logos are embedded as inline (CID) attachments from [`src/emails/assets.ts`](src/emails/assets.ts), so they show even before the site is deployed. That file is generated: gold-tinted, base64 copies of `public/brand/wordmark.png` and `mark.png`. If the logos change, regenerate it the same way (alpha channel of the PNG joined onto a solid `#daa520` image with `sharp`).
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
- **Don't export non-component values from `"use client"` files** and import them into server components; they arrive as client references, not values. That's why `introInitScript` lives in `lib/intro.ts`, not in `intro.tsx`.
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
