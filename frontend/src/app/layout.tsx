import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgriSetu AI - Dynamic Farmer Supply Chain",
  description: "Eliminating information asymmetry and empowering smallholder farmers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-100 min-h-screen text-slate-900`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-y-auto">
            <Header />
            <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}