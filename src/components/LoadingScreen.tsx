"use client";

import { useState } from "react";
import Landing from "./Landing"; // your animated loader file
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? (
        <Landing onComplete={() => setIsLoading(false)} />
      ) : (
        <main className="flex flex-col">
          <Hero />
          <Footer />
        </main>
      )}
    </>
  );
}
