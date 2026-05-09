import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fortunate Hub – Dine, Train & Unwind",
  description:
    "Fortunate Hub is your all-in-one destination for great food, world-class fitness, and a relaxing lounge experience — all under one roof.",
  keywords: ["Fortunate Hub", "restaurant", "gym", "lounge", "dining", "fitness"],
  openGraph: {
    title: "Fortunate Hub",
    description: "Dine, Train & Unwind — all under one roof.",
    type: "website",
  },
};

import Navbar from "./components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-['Inter'] bg-[#0f0a06]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
