import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M. Firdaus Suryaningrat | Fullstack Web Developer",
  description:
    "Portfolio M. Firdaus Suryaningrat (Shuriza), fullstack web developer dari Kediri yang membangun aplikasi web modern dengan React, Next.js, dan Laravel.",
  keywords: [
    "M. Firdaus Suryaningrat",
    "Shuriza",
    "fullstack web developer",
    "React",
    "Next.js",
    "Laravel",
    "portfolio",
  ],
  authors: [{ name: "M. Firdaus Suryaningrat" }],
  openGraph: {
    title: "M. Firdaus Suryaningrat | Fullstack Web Developer",
    description: "Membangun aplikasi web modern dari Kediri, Jawa Timur.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-slate-200">
        {children}
      </body>
    </html>
  );
}
