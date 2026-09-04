import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shuriza.tech"),
  title: {
    default: "M. Firdaus Suryaningrat | Junior Fullstack Web Developer",
    template: "%s | Shuriza",
  },
  description:
    "Portfolio M. Firdaus Suryaningrat (Shuriza), junior fullstack web developer dari Kediri.",
  keywords: [
    "M. Firdaus Suryaningrat",
    "Shuriza",
    "junior fullstack web developer",
    "React",
    "Next.js",
    "Laravel",
    "portfolio",
  ],
  authors: [{ name: "M. Firdaus Suryaningrat" }],
  openGraph: {
    title: "M. Firdaus Suryaningrat | Junior Fullstack Web Developer",
    description: "Portfolio web developer dari Kediri, Jawa Timur.",
    type: "website",
    url: "/",
    siteName: "Shuriza",
    locale: "id_ID",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
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
