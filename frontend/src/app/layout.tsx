import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppLayoutClient from "./layout-client";

export const metadata: Metadata = {
  title: "AgriSetu AI - APMC Mandi Intelligence",
  description: "Spatial Arbitrage, AI Grain Quality & Farmer Coalition Platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AgriSetu AI",
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        <AppLayoutClient>{children}</AppLayoutClient>
      </body>
    </html>
  );
}