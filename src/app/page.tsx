"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";

import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [isLandingComplete, setIsLandingComplete] = useState(false);

  return (
    <>
      {!isLoadingComplete ? (
        <LoadingScreen onComplete={() => setIsLoadingComplete(true)} />
      ) : !isLandingComplete ? (
        <LoadingScreen onComplete={() => setIsLandingComplete(true)} />
      ) : (
        <LoginWrapper />
      )}  
    </>
  );
}

// ✅ Wrapper to handle login -> main content flow
function LoginWrapper() {
    return  (
      <main className="flex flex-col min-h-screen">

        <Hero />
        <Footer />
      </main>
    )
}
