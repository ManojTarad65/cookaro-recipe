"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [isLandingComplete, setIsLandingComplete] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    // ✅ Prevent hydration mismatch during SSR
    setMounted(true);

    if (typeof window !== "undefined") {
      const hasVisited = localStorage.getItem("hasVisited");

      if (!hasVisited) {
        setShowLoading(true);
        localStorage.setItem("hasVisited", "true"); // Mark as visited
      } else {
        setShowLoading(false);
        setIsLandingComplete(true);
      }
    }
  }, []);

  // ✅ Handle loading screen finish
  const handleLoadingComplete = () => {
    setShowLoading(false);
    setIsLandingComplete(true);
  };

  if (!mounted) return null; // Avoid SSR hydration issues

  return (
    <>
      {showLoading ? (
        <LoadingScreen onComplete={handleLoadingComplete} />
      ) : (
        <MainWrapper />
      )}
    </>
  );
}

// ✅ Wrapper to handle login -> main content flow
function MainWrapper() {
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <Hero />
      <Footer />
    </main>
  );
}
