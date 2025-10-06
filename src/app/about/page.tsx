"use client";

import { ChefHat, Sparkles, Users, Target, Lightbulb, History } from "lucide-react";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const About = () => {
  const values = [
    {
      icon: Sparkles,
      title: "Innovation",
      description:
        "We leverage cutting-edge AI technology to transform how people cook and discover recipes.",
    },
    {
      icon: History,
      title: "Save History",
      description:
        "Saving your recipe history for easy access and you can use it in the future, if you want to.",
    },
    {
      icon: Target,
      title: "Simplicity",
      description:
        "Making cooking accessible to everyone, regardless of skill level or available ingredients.",
    },
    {
      icon: Lightbulb,
      title: "Creativity",
      description:
        "Inspiring culinary creativity by suggesting unique combinations and cooking techniques.",
    },
  ];

  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-white">
      {/* 🔹 Background Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          particles: {
            number: { value: 40 },
            color: { value: "#f97316" },
            opacity: { value: 0.3 },
            size: { value: 3 },
            move: { enable: true, speed: 1.2, direction: "none", random: true },
          },
        }}
        className="absolute inset-0 z-0"
      />

      {/* 🔸 Hero Section */}
      <motion.section
        className="relative z-10 py-20 px-4 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <ChefHat className="h-16 w-16 text-orange-600 mx-auto mb-6 drop-shadow-lg" />
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          About COOKARO
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          We're on a mission to revolutionize home cooking with the power of
          artificial intelligence, making delicious meals accessible to
          everyone.
        </p>
      </motion.section>

      {/* 🔸 Story Section */}
      <motion.section
        className="py-20 px-4 bg-white relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 mb-6">
              COOKARO was born from a simple observation: too many people
              struggle with the question "What should I cook?" every day. With
              busy schedules and limited ingredients at home, meal planning
              becomes a daily challenge.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Our team of food enthusiasts and AI experts came together to
              create an intelligent solution that understands your preferences,
              dietary restrictions, and available ingredients to suggest
              personalized recipes.
            </p>
            <p className="text-lg text-gray-600">
              Today, COOKARO helps thousands of home cooks discover new flavors
              and create memorable meals with confidence.
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-8 h-96 flex items-center justify-center shadow-lg">
              <div className="text-center">
                <ChefHat className="h-24 w-24 text-orange-600 mx-auto mb-4" />
                <p className="text-2xl font-semibold text-gray-800">
                  "Cooking made intelligent"
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 🔸 Values Section */}
      <motion.section
        className="py-20 px-4 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at COOKARO
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Card className="border-orange-100 shadow-md hover:shadow-orange-200 transition-all duration-300 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <value.icon className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 🔸 Stats Section */}
      <motion.section
        className="py-20 px-4 bg-white relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            ["100+", "Recipes Generated"],
            ["50+", "Happy Cooks"],
            ["95%", "Satisfaction Rate"],
          ].map(([stat, label], i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {stat}
              </div>
              <div className="text-xl text-gray-600">{label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 🔸 CTA Section */}
      <motion.section
        className="py-20 px-4 bg-gradient-to-r from-orange-600 to-amber-600 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Cooking?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community and start creating amazing recipes with AI today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/recipe">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-3 hover:scale-105 transition-all cursor-pointer"
              >
                Try COOKARO Now
              </Button>
            </Link>
         
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
