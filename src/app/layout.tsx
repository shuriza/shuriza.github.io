import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shuriza | Fullstack Web Developer",
  description:
    "Portfolio of Shuriza — Fullstack Web Developer specializing in modern web applications with React, Next.js, Laravel, and more.",
  keywords: ["fullstack", "web developer", "react", "next.js", "laravel", "portfolio"],
  authors: [{ name: "Shuriza" }],
  openGraph: {
    title: "Shuriza | Fullstack Web Developer",
    description: "Building modern web applications",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-slate-200">
        {children}
      </body>
    </html>
  );
}
