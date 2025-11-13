import type { Metadata } from "next";
import "./globals.css";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "EatoAI",
  description: "EatoAI – Smart Health Assistant | Recipe Generator & Meal Planner",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Add favicon & meta for SEO */}
        <link rel="icon" href="favicon.ico" />
        <meta name="theme-color" content="#ff6b00" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* ✅ Session Provider ensures auth context is available globally */}
        <SessionProviderWrapper>
          <Header />
          <main className="flex flex-col flex-1">{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
