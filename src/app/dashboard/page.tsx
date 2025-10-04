"use client";

import { useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import MealPlanner from "@/components/MealPlanner";
import NutritionAnalyzer from "@/components/NutritionAnalyzer";
import { motion } from "framer-motion";
import CommunityPost from "@/components/CommunityFeed";

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState("Recipes");

  const categories = [
    "Recipes",
    "Meal Planner",
    "Nutrition Analyzer",
    "Community",
  ];

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 dark:bg-gray-900 p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold mb-6">Cookaro</h1>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-left hover:bg-gray-200 dark:hover:bg-gray-800 ${
              activeCategory === cat ? "bg-orange-400 text-white" : ""
            }`}
          >
            {cat}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-scroll">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {activeCategory === "Recipes" && <RecipeCard />}
          {activeCategory === "Meal Planner" && <MealPlanner />}
          {activeCategory === "Nutrition Analyzer" && <NutritionAnalyzer />}
          {activeCategory === "Community" && (
            <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Community Feed</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Users can post recipes, share tips, and like others' meals.
              </p>
            </div>
          )}
        </motion.div>

        {activeCategory === "Community" && (
          <div className="col-span-full flex flex-col gap-4">
            {/* Example Posts */}
            <CommunityPost
              username="Manoj"
              avatar="/avatars/manoj.jpg"
              title="Delicious Vegan Pancakes"
              content="Tried this recipe and it came out perfect! Highly recommend."
              likes={12}
              comments={4}
            />
            <CommunityPost
              username="Surendra"
              avatar="/avatars/surendra.jpg"
              title="Easy 15-min Breakfast"
              content="Quick and healthy breakfast ideas for busy mornings."
              likes={8}
              comments={2}
            />
          </div>
        )}
      </main>
    </div>
  );
}
