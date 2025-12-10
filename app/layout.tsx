import { Navbar } from "@/components/layout/Navbar";
import type { Metadata } from "next";
import { Outfit, Syne, Righteous } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const righteous = Righteous({ weight: "400", subsets: ["latin"], variable: "--font-righteous" });

export const metadata: Metadata = {
  title: "VidyaSetu | Campus to Career Bridge",
  description: "Your comprehensive placement preparation platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${syne.variable} ${righteous.variable} font-sans antialiased bg-[#02040a] text-slate-100 overflow-x-hidden`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
