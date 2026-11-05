import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "TechShowcase — Discover great tech products", template: "%s | TechShowcase" },
  description: "Discover, upvote and discuss the best tech products built by students and makers.",
  openGraph: { type: "website", siteName: "TechShowcase" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
