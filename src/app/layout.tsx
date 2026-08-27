import type { Metadata } from "next";
import "./globals.css";
import { CompareProvider } from "@/lib/compareContext";

export const metadata: Metadata = {
  title: "EV-Garage-Trucks — коммерческий электротранспорт из Китая",
  description:
    "Каталог коммерческого электротранспорта из Китая: грузовики, фургоны и рефрижераторы 1.0–3.5 тонны. Характеристики, цены, растаможка.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-body">
        <CompareProvider>{children}</CompareProvider>
      </body>
    </html>
  );
}
