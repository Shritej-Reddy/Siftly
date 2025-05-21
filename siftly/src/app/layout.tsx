import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthButton from "@/components/AuthButton";
import { UserProvider } from "@/context/UserContext";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Siftly — Curated Developer Feed",
  description: "One-stop content curation across Dev.to, Medium, Reddit, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <nav className="w-full sticky top-0 z-50 bg-background border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              Siftly
            </Link>
            <AuthButton />
          </nav>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}