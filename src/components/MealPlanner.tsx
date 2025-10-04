"use client";

import { motion } from "framer-motion";

export default function MealPlanner() {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-start gap-4"
    >
      <h2 className="text-xl font-bold">📅 Meal Planner</h2>
      <p className="text-gray-600 dark:text-gray-300">
        Plan your meals for the week easily.
      </p>
      <button className="mt-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
        Plan Meals
      </button>
    </motion.div>
  );
}
