// "use client";

// import Particles from "react-tsparticles";
// import { loadFull } from "tsparticles";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// export default function Hero() {
//   const particlesInit = async (main: any) => {
//     await loadFull(main);
//   };

//   const foodIcons = [
//     "/icons/pizza.png",
//     "/icons/burger.png",
//     "/icons/salad.png",
//     "/icons/icecream.png",
//     "/icons/sushi.png",
//   ];

//   const [floatingIcons, setFloatingIcons] = useState<any[]>([]);

//   useEffect(() => {
//     // Random positions for each icon
//     const icons = foodIcons.map((icon) => ({
//       src: icon,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       speed: 1 + Math.random() * 1.5,
//     }));
//     setFloatingIcons(icons);
//   }, []);

//   return (
//     <section className="relative w-full h-[80vh] flex flex-col justify-center items-center text-center bg-orange-50 dark:bg-gray-900 overflow-hidden">
//       {/* Particles Background */}
//       <Particles
//         id="tsparticles"
//         init={particlesInit}
//         options={{
//           background: { color: { value: "transparent" } },
//           fpsLimit: 60,
//           interactivity: {
//             events: {
//               onClick: { enable: true, mode: "push" },
//               onHover: { enable: true, mode: "repulse" },
//             },
//             modes: { push: { quantity: 4 }, repulse: { distance: 100 } },
//           },
//           particles: {
//             color: { value: "#ff5722" },
//             links: { enable: false },
//             collisions: { enable: true },
//             move: { direction: "top", enable: true, speed: 1, outModes: "out" },
//             number: { density: { enable: true, area: 800 }, value: 50 },
//             opacity: { value: 0.7 },
//             shape: { type: "circle" },
//             size: { value: { min: 5, max: 10 } },
//           },
//         }}
//       />

//       {/* Floating Food Icons */}
//       {floatingIcons.map((icon, i) => (
//         <Image
//           key={i}
//           src={icon.src}
//           alt="food icon"
//           width={50}
//           height={50}
//           className="absolute animate-float"
//           style={{
//             left: `${icon.x}%`,
//             top: `${icon.y}%`,
//             animationDuration: `${3 + icon.speed}s`,
//           }}
//         />
//       ))}

//       {/* Heading */}
//       <h1 className="text-4xl md:text-6xl font-bold text-orange-600 z-10">
//         Welcome to Cookaro
//       </h1>
//       <p className="text-lg md:text-2xl mt-4 text-gray-700 dark:text-gray-200 z-10">
//         Generate recipes & plan your meals with AI
//       </p>

//       {/* CTA Button */}
//       <button className="mt-6 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg z-10">
//         Generate Recipe
//       </button>
//     </section>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChefHat, Sparkles, Clock, Users } from "lucide-react";
import { toast } from "sonner";

const Hero = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleStartCooking = () => {
    if (!user) {
      toast.error("Please login to start cooking!");
      router.push("/login");
      return;
    }
    router.push("/chatbot");
  };

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Recipes",
      description:
        "Get personalized recipes based on your ingredients and preferences",
    },
    {
      icon: Clock,
      title: "Quick & Easy",
      description:
        "Find recipes that match your available time and skill level",
    },
    {
      icon: Users,
      title: "Community Favorites",
      description: "Discover trending recipes loved by our cooking community",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Cook Smarter with
              <span className="text-orange-600 block">
                AI-Generated Recipes
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your available ingredients into delicious meals. Our AI
              chatbot creates personalized recipes just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-3 animate-scale-in"
                onClick={handleStartCooking}
              >
                Start Cooking
                <ChefHat className="ml-2 h-5 w-5" />
              </Button>

              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-3 border-orange-200 hover:bg-orange-50"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose COOKARO?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of cooking with our intelligent recipe
              generation system
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover-scale border-orange-100"
              >
                <CardContent className="p-8 text-center">
                  <feature.icon className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-4 bg-gradient-to-r from-orange-600 to-amber-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Create Amazing Recipes?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of home cooks who are already using AI to enhance
            their culinary adventures
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Hero;
