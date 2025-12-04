"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Header from "@/components/Header";


export default function Home() {
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      const hasVisited = localStorage.getItem("hasVisited");

      if (!hasVisited) {
        setShowLoading(true);
        localStorage.setItem("hasVisited", "true");
      } else {
        setShowLoading(false);
      }
    }
  }, []);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  if (!mounted) return null;

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

function MainWrapper() {
  return (
    <main className="flex flex-col min-h-screen">

      <Header />
      <Hero />
      <Footer />
    </main>
  );
}
