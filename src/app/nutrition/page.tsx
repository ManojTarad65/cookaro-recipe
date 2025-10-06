"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const COLORS = ["#34D399", "#F87171", "#60A5FA", "#FBBF24"]; // Tailwind green, red, blue, yellow

  const analyzeNutrition = async () => {
    if (!query.trim()) {
      setError("Please enter an ingredient or recipe.");
      return;
    }
    setLoading(true);
    setError("");
    setNutrition(null);

    try {
      const res = await axios.post("/api/nutrition", { query });
      setNutrition(res.data);
    } catch (err) {
      setError("Unable to analyze. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  return (
    <motion.div
      className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col items-center justify-center px-6 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Title */}
      <motion.h1
        className="text-5xl font-extrabold mb-10 text-green-400 text-center drop-shadow-[0_0_10px_#10b981]"
        initial={{ y: -30 }}
        animate={{ y: 0 }}
      >
        🥗 Nutrition Analyzer
      </motion.h1>

      {/* Input Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl bg-gray-800/70 p-4 rounded-2xl shadow-xl border border-green-800">
        <input
          type="text"
          placeholder="Enter ingredients or recipe e.g. 2 eggs and 1 banana"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded-xl text-gray-200 bg-gray-900/60 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />

        <button
          onClick={analyzeNutrition}
          disabled={loading}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 active:scale-95 transition rounded-xl font-semibold flex items-center gap-2 shadow-lg"
        >
          {loading && <Loader2 className="animate-spin w-4 h-4" />}
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}

      {/* Nutrition Result */}
      {nutrition && (
        <motion.div
          className="mt-10 bg-gray-900/70 border border-green-700 p-8 rounded-2xl w-full max-w-xl shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2 className="text-3xl font-semibold mb-5 text-green-300 text-center">
            Nutrition Breakdown
          </h2>

          <div className="grid grid-cols-2 gap-4 text-lg mb-6">
            <p>
              🔥 Calories:{" "}
              <span className="text-green-400">{nutrition.calories} kcal</span>
            </p>
            <p>
              💪 Protein:{" "}
              <span className="text-green-400">{nutrition.protein} g</span>
            </p>
            <p>
              🥑 Fat: <span className="text-green-400">{nutrition.fat} g</span>
            </p>
            <p>
              🍞 Carbs:{" "}
              <span className="text-green-400">{nutrition.carbs} g</span>
            </p>
          </div>

          {/* Chart */}
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
                  }}
                  labelStyle={{ color: "#10b981" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
