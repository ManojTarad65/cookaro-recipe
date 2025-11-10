import type { Metadata } from "next";
import "./globals.css";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import Header from "@/components/Header";
import { NotificationProvider } from "@/context/NotificationContext";


export const metadata: Metadata = {
  title: "EatoAI",
  description: "EatoAI – Smart AI Health & Recipe Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProviderWrapper>
            <NotificationProvider>
              <Header />
              <main>{children}</main>
            </NotificationProvider>
          </SessionProviderWrapper>
      </body>
    </html>
  );
}

