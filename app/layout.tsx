import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Panpata — Buy, Sell & Rent Property in Bangladesh",
  description:
    "Panpata is Bangladesh's modern real estate marketplace. Find homes, apartments, land and trusted agents in Dhaka and beyond.",
  openGraph: {
    title: "Panpata — Real Estate Marketplace Bangladesh",
    description: "Find homes, apartments, land and trusted agents in Dhaka and beyond.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Panpata",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
