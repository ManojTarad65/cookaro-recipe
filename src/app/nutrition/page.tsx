"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, Apple, Info } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function NutritionAnalyzer() {
  const [query, setQuery] = useState("");
  const [nutrition, setNutrition] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const COLORS = ["#34D399", "#F87171", "#60A5FA", "#FBBF24"];

  // 🧩 Load user profile
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const email = JSON.parse(storedUser).email;
      fetchProfile(email);
    }
  }, []);

  const fetchProfile = async (email: string) => {
    try {
      const res = await axios.get(`/api/profile?email=${email}`);
      const data = res.data;

      if (data) {
        const { age, gender, height, weight, activityLevel } = data;

        const heightM = height / 100;
        const bmr =
          gender === "male"
            ? 10 * weight + 6.25 * height - 5 * age + 5
            : 10 * weight + 6.25 * height - 5 * age - 161;

        const multiplier =
          activityLevel === "low"
            ? 1.2
            : activityLevel === "moderate"
            ? 1.55
            : 1.725;

        const dailyCalories = Math.round(bmr * multiplier);
        setProfile({ ...data, dailyCalories });
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };

  // 🧠 Analyze food query
  const analyzeNutrition = async () => {
    if (!query.trim()) {
      setError("Please enter ingredients or a recipe name 🍳");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.email) {
      setError("Please login to analyze nutrition.");
      return;
    }

    setLoading(true);
    setError("");
    setNutrition(null);

    try {
      const res = await axios.post("/api/nutrition", {
        query,
        email: user.email,
      });

      if (res.data?.nutrition) {
        setNutrition(res.data.nutrition);
      } else {
        setError("Unable to analyze this food right now 😕");
      }
    } catch (err) {
      setError("Unable to analyze this food right now 😕");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getComparison = () => {
    if (!profile || !nutrition) return null;
    const caloriePercent = Math.round(
      (nutrition.calories / profile.dailyCalories) * 100
    );
    const proteinPercent = Math.round(
      (nutrition.protein / ((profile.dailyCalories * 0.25) / 4)) * 100
    );
    return { caloriePercent, proteinPercent };
  };

  const getChartData = () => {
    if (!nutrition) return [];
    return [
      { name: "Calories", value: nutrition.calories },
      { name: "Protein", value: nutrition.protein },
      { name: "Fat", value: nutrition.fat },
      { name: "Carbs", value: nutrition.carbs },
    ];
  };

  const comparison = getComparison();

  return (
    <motion.div
      className="min-h-screen w-full bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-500 flex flex-col items-center justify-start px-6 py-10 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl font-extrabold mb-3 flex items-center justify-center gap-2">
          <Apple className="w-10 h-10" />
          Nutrition Analyzer
        </h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
          Enter your meal or ingredients and let AI analyze its nutrition value
          instantly. 🍎 Compare it with your daily calorie goals to track your
          health better!
        </p>
      </motion.div>

      {/* Input Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl bg-black/20 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20">
        <input
          type="text"
          placeholder="e.g. 1 cup oats, 2 eggs, 1 banana"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />

        <button
          onClick={analyzeNutrition}
          disabled={loading}
          className="px-6 py-3 bg-green-500 hover:bg-green-400 active:scale-95 transition rounded-xl font-semibold flex items-center gap-2 shadow-lg"
        >
          {loading && <Loader2 className="animate-spin w-4 h-4" />}
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          className="text-red-200 mt-4 text-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      {/* Analysis Result */}
      {nutrition && (
        <motion.div
          className="mt-12 bg-black/40 border border-white/20 p-8 rounded-2xl w-full max-w-2xl shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold mb-6 text-green-300 text-center">
            Nutrition Breakdown 🧩
          </h2>

          <div className="grid grid-cols-2 gap-4 text-lg mb-6 text-white/90">
            <p>
              🔥 Calories:{" "}
              <span className="text-green-400 font-semibold">
                {nutrition.calories} kcal
              </span>
            </p>
            <p>
              💪 Protein:{" "}
              <span className="text-green-400 font-semibold">
                {nutrition.protein} g
              </span>
            </p>
            <p>
              🥑 Fat:{" "}
              <span className="text-green-400 font-semibold">
                {nutrition.fat} g
              </span>
            </p>
            <p>
              🍞 Carbs:{" "}
              <span className="text-green-400 font-semibold">
                {nutrition.carbs} g
              </span>
            </p>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={getChartData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label
                >
                  {getChartData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderRadius: "10px",
                    border: "1px solid #10b981",
                    color: "white",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {comparison && (
            <div className="mt-6 text-center">
              <p className="text-green-300 font-medium">
                ✅ This meal covers{" "}
                <span className="font-bold">{comparison.caloriePercent}%</span>{" "}
                of your daily calorie goal.
              </p>
              <p className="text-blue-300 text-sm">
                💪 Provides{" "}
                <span className="font-semibold">
                  {comparison.proteinPercent}%
                </span>{" "}
                of your protein target.
              </p>
            </div>
          )}

          <motion.div
            className="mt-10 p-4 bg-green-900/30 rounded-xl border border-green-600/50 flex gap-3 items-start text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Info className="text-green-300 w-6 h-6 flex-shrink-0 mt-1" />
            <p className="text-green-100 text-sm leading-relaxed">
              Tip: Combine high-protein ingredients like eggs, oats, and Greek
              yogurt with fiber-rich fruits for a balanced and filling
              breakfast.
            </p>
          </motion.div>
        </motion.div>
      )}

      {!nutrition && !loading && !error && (
        <motion.p
          className="text-white/80 mt-12 text-center text-lg max-w-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          🥦 Ready to get started? Type in your meal — like{" "}
          <strong>“2 eggs and 1 banana”</strong> — and let{" "}
          <span className="text-green-300 font-semibold">EatoAI</span> tell you
          exactly what’s in it!
        </motion.p>
      )}
    </motion.div>
  );
}
