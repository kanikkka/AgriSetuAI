import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KisanLogic.AI - APMC Intelligence Platform",
  description: "AI-powered Mandi Arbitrage & Price Forecasting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}