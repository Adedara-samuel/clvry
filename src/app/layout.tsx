import type { Metadata } from "next";
import { Cinzel, Geist, Geist_Mono } from "next/font/google";
import { Intro } from "@/components/site/intro";
import { introInitScript } from "@/lib/intro";
import { Toaster } from "@/components/ui/sonner";
import { themeInitScript } from "@/store/theme";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Closest open match to the CLVRY wordmark's flared Roman capitals.
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CLVRY — Wear the Word",
  description:
    "CLVRY is streetwear carried from the cross. Clothing, and Circle Sessions — music made for worship.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // data-theme is set by the init script before React hydrates.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} h-full antialiased`}
    >
      <head>
        {/* Static, first-party strings — no user input reaches these. */}
        <script dangerouslySetInnerHTML={{ __html: `${themeInitScript};${introInitScript}` }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Intro />
        <Providers>
          {children}
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
