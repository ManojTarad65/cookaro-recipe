"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  const [showLoading, setShowLoading] = useState(false);
  const [isLandingComplete, setIsLandingComplete] = useState(false);

  useEffect(() => {
    // ✅ Check if user has already seen the loading screen
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      setShowLoading(true);
      localStorage.setItem("hasVisited", "true"); // mark as visited
    } else {
      setShowLoading(false);
      setIsLandingComplete(true);
    }
  }, []);

  // ✅ Handle loading screen finish
  const handleLoadingComplete = () => {
    setShowLoading(false);
    setIsLandingComplete(true);
  };

  return (
    <>
      {showLoading ? (
        <LoadingScreen onComplete={handleLoadingComplete} />
      ) : (
        <LoginWrapper />
      )}
    </>
  );
}

// ✅ Wrapper to handle login -> main content flow
function LoginWrapper() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Footer />
    </main>
  );
}
