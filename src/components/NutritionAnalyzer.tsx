"use client";

import { motion } from "framer-motion";

export default function NutritionAnalyzer() {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-start gap-4"
    >
      <h2 className="text-xl font-bold">🥗 AI Nutrition Analyzer</h2>
      <p className="text-gray-600 dark:text-gray-300">
        Analyze the nutritional content of your meals with AI.
      </p>
      <button className="mt-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
        Analyze Meal
      </button>
    </motion.div>
  );
}
