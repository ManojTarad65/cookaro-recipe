"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white font-sans overflow-hidden">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-screen text-center px-6 relative">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          🍳 Cookaro Recipe Generator
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-xl text-lg text-gray-300 mb-8"
        >
          Enter ingredients you have, and let AI cook up delicious recipes just
          for you!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Link
            href="/recipe"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/40"
          >
            Generate Recipe
          </Link>
        </motion.div>

        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a,_transparent_70%)]"></div>
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
            className="absolute inset-0 bg-[linear-gradient(45deg,#1e3a8a,#9333ea,#f43f5e)] opacity-10"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 text-center px-6 bg-gray-950/40 backdrop-blur-sm">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-6 text-blue-400"
        >
          About Cookaro
        </motion.h2>
        <p className="max-w-2xl mx-auto text-gray-300 text-lg leading-relaxed">
          Cookaro is your personal AI-powered recipe assistant. Whether you have
          a few ingredients or a full pantry, our smart system helps you
          discover creative meal ideas instantly.
        </p>
      </section>

      {/* Contact Section */}
      <section className="py-20 text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-6 text-pink-400"
        >
          Contact Us
        </motion.h2>
        <p className="max-w-2xl mx-auto text-gray-300 text-lg leading-relaxed mb-8">
          Have questions or feedback? Reach out to our team — we’d love to hear
          from you!
        </p>
        <Link
          href="/contact"
          className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-pink-500/40"
        >
          Contact Page
        </Link>
      </section>

      {/* Dashboard Section */}
      <section className="py-16 text-center bg-gray-950/60">
        <h2 className="text-3xl font-semibold mb-4 text-green-400">
          View Your Dashboard
        </h2>
        <p className="text-gray-300 mb-6">
          Track your saved recipes, preferences, and explore personalized AI
          recommendations.
        </p>
        <Link
          href="/dashboard"
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-green-500/40"
        >
          Go to Dashboard
        </Link>
      </section>
    </div>
  );
}
