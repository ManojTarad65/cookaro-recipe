"use client";

import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  const foodIcons = [
    "/icons/pizza.png",
    "/icons/burger.png",
    "/icons/salad.png",
    "/icons/icecream.png",
    "/icons/sushi.png",
  ];

  const [floatingIcons, setFloatingIcons] = useState<any[]>([]);

  useEffect(() => {
    // Random positions for each icon
    const icons = foodIcons.map((icon) => ({
      src: icon,
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: 1 + Math.random() * 1.5,
    }));
    setFloatingIcons(icons);
  }, []);

  return (
    <section className="relative w-full h-[80vh] flex flex-col justify-center items-center text-center bg-orange-50 dark:bg-gray-900 overflow-hidden">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: { enable: true, mode: "push" },
              onHover: { enable: true, mode: "repulse" },
            },
            modes: { push: { quantity: 4 }, repulse: { distance: 100 } },
          },
          particles: {
            color: { value: "#ff5722" },
            links: { enable: false },
            collisions: { enable: true },
            move: { direction: "top", enable: true, speed: 1, outModes: "out" },
            number: { density: { enable: true, area: 800 }, value: 50 },
            opacity: { value: 0.7 },
            shape: { type: "circle" },
            size: { value: { min: 5, max: 10 } },
          },
        }}
      />

      {/* Floating Food Icons */}
      {floatingIcons.map((icon, i) => (
        <Image
          key={i}
          src={icon.src}
          alt="food icon"
          width={50}
          height={50}
          className="absolute animate-float"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            animationDuration: `${3 + icon.speed}s`,
          }}
        />
      ))}

      {/* Heading */}
      <h1 className="text-4xl md:text-6xl font-bold text-orange-600 z-10">
        Welcome to Cookaro
      </h1>
      <p className="text-lg md:text-2xl mt-4 text-gray-700 dark:text-gray-200 z-10">
        Generate recipes & plan your meals with AI
      </p>

      {/* CTA Button */}
      <button className="mt-6 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg z-10">
        Generate Recipe
      </button>
    </section>
  );
}
