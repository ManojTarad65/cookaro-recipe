"use client";

import { useState, useEffect } from "react";
import { ChefHat, Utensils, Coffee, Cookie } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [dots, setDots] = useState<
    { left: string; top: string; delay: string; duration: string }[]
  >([]);

  const loadingPhrases = [
    "Heating up the kitchen...",
    "Gathering fresh ingredients...",
    "Mixing the perfect recipe...",
    "Adding a pinch of magic...",
    "Almost ready to serve!",
  ];

  const floatingIcons = [
    { Icon: ChefHat, delay: "0s", x: "10%", y: "20%" },
    { Icon: Utensils, delay: "0.5s", x: "80%", y: "15%" },
    { Icon: Coffee, delay: "1s", x: "20%", y: "70%" },
    { Icon: Cookie, delay: "1.5s", x: "85%", y: "75%" },
  ];

  // ✅ Generate random dots after mount (client-side only)
  useEffect(() => {
    const generated = Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 2}s`,
    }));
    setDots(generated);
  }, []);

  // ✅ Handle loading progress and phrases
  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null;
    let phraseInterval: NodeJS.Timeout | null = null;

    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (progressInterval) clearInterval(progressInterval);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    phraseInterval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % loadingPhrases.length);
    }, 1600);

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (phraseInterval) clearInterval(phraseInterval);
    };
  }, [onComplete, loadingPhrases.length]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center z-50 overflow-hidden">
      {/* Background Dots */}
      <div className="absolute inset-0">
        {dots.map((dot, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: dot.left,
              top: dot.top,
              animationDelay: dot.delay,
              animationDuration: dot.duration,
            }}
          />
        ))}
      </div>

      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, x, y }, index) => (
        <div
          key={index}
          className="absolute text-white/30 animate-bounce"
          style={{
            left: x,
            top: y,
            animationDelay: delay,
            animationDuration: "3s",
          }}
        >
          <Icon size={40} />
        </div>
      ))}

      {/* Main Content */}
      <div className="text-center z-10">
        {/* Logo */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <ChefHat className="w-12 h-12 text-orange-600 animate-bounce" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto">
            <div className="w-full h-full border-4 border-white/30 rounded-full animate-spin border-t-white"></div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-2 animate-pulse">
            EatoAI
          </h1>
          <p className="text-white/90 text-xl animate-fade-in">
            Your AI Health & Recipe Assistant
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto mb-6">
          <div className="bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-white to-yellow-200 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
            </div>
          </div>
          <div className="text-center mt-2">
            <span className="text-white/90 font-medium">{progress}%</span>
          </div>
        </div>

        {/* Loading Phrase */}
        <div className="h-8 flex items-center justify-center">
          <p className="text-white/90 text-lg font-medium animate-pulse transition-all duration-500">
            {loadingPhrases[currentPhrase]}
          </p>
        </div>

        {/* Utensil Animation */}
        <div className="mt-8 flex justify-center gap-4">
          {[Utensils, Coffee, Cookie].map((Icon, index) => (
            <div
              key={index}
              className="text-white/60 animate-bounce"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: "2s",
              }}
            >
              <Icon size={24} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-orange-600/20 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/10 rounded-t-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
