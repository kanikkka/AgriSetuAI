import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KisanLogic AI - PunjabiMandi.AI",
  description: "Realtime Agricultural Market Intelligence & Decision Support Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen text-slate-900 flex`}>
        <LanguageProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
            <main className="flex-1">{children}</main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}