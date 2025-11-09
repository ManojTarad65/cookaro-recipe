// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { Loader2 } from "lucide-react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// export default function NutritionAnalyzer() {
//   const [query, setQuery] = useState("");
//   const [nutrition, setNutrition] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const COLORS = ["#34D399", "#F87171", "#60A5FA", "#FBBF24"]; // Tailwind green, red, blue, yellow

//   const analyzeNutrition = async () => {
//     if (!query.trim()) {
//       setError("Please enter an ingredient or recipe.");
//       return;
//     }
//     setLoading(true);
//     setError("");
//     setNutrition(null);

//     try {
//       const res = await axios.post("/api/nutrition", { query });
//       setNutrition(res.data);
//     } catch (err) {
//       setError("Unable to analyze. Please try again later.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getChartData = () => {
//     if (!nutrition) return [];
//     return [
//       { name: "Calories", value: nutrition.calories },
//       { name: "Protein", value: nutrition.protein },
//       { name: "Fat", value: nutrition.fat },
//       { name: "Carbs", value: nutrition.carbs },
//     ];
//   };

//   return (
//     <motion.div
//       className="min-h-screen w-full bg-orange-600 text-[#FFFFFF] flex flex-col items-center justify-center px-6 py-10"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//     >
//       {/* Title */}
//       <motion.h1
//         className="text-5xl font-extrabold mb-10  text-[#FFFFFF] text-center "
//         initial={{ y: -30 }}
//         animate={{ y: 0 }}
//       >
//         🥗 Nutrition Analyzer
//       </motion.h1>

//       {/* Input Section */}
//       <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl bg-[#2B1E1E] p-4 rounded-2xl shadow-xl border border-[#3C2A2A]">
//         <input
//           type="text"
//           placeholder="Enter ingredients or recipe e.g. 2 eggs and 1 banana"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="w-full p-3 rounded-xl text-[#FFFFFF] bg-gray-900/60 placeholder-[#A0A0A0] border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
//         />

//         <button
//           onClick={analyzeNutrition}
//           disabled={loading}
//           className="px-6 py-3 bg-[#00C853] hover:bg-[#00E676] active:scale-95 transition rounded-xl font-semibold flex items-center gap-2 shadow-lg cursor-pointer"
//         >
//           {loading && <Loader2 className="animate-spin w-4 h-4" />}
//           {loading ? "Analyzing..." : "Analyze"}
//         </button>
//       </div>

//       {/* Error Message */}
//       {error && <p className="text-[#FFFFFF] mt-4 text-sm">{error}</p>}

//       {/* Nutrition Result */}
//       {nutrition && (
//         <motion.div
//           className="mt-10 bg-gray-900/70 border border-green-700 p-8 rounded-2xl w-full max-w-xl shadow-2xl"
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//         >
//           <h2 className="text-3xl font-semibold mb-5 text-green-300 text-center">
//             Nutrition Breakdown
//           </h2>

//           <div className="grid grid-cols-2 gap-4 text-lg mb-6">
//             <p>
//               🔥 Calories:{" "}
//               <span className="text-green-400">{nutrition.calories} kcal</span>
//             </p>
//             <p>
//               💪 Protein:{" "}
//               <span className="text-green-400">{nutrition.protein} g</span>
//             </p>
//             <p>
//               🥑 Fat: <span className="text-green-400">{nutrition.fat} g</span>
//             </p>
//             <p>
//               🍞 Carbs:{" "}
//               <span className="text-green-400">{nutrition.carbs} g</span>
//             </p>
//           </div>

//           {/* Chart */}
//           <div className="w-full h-64">
//             <ResponsiveContainer>
//               <PieChart>
//                 <Pie
//                   data={getChartData()}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={90}
//                   dataKey="value"
//                   label
//                 >
//                   {getChartData().map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "#1f2937",
//                     borderRadius: "10px",
//                     border: "1px solid #10b981",
//                   }}
//                   labelStyle={{ color: "#10b981" }}
//                 />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </motion.div>
//       )}
//     </motion.div>
//   );
// }







"use client";

import { useState, useEffect } from "react";
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
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const COLORS = ["#34D399", "#F87171", "#60A5FA", "#FBBF24"];

  // 🧩 Step 1: Load user profile & calculate daily goal
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

  // 🧩 Step 2: Analyze food
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

  // 🧩 Step 3: Compare meal vs daily goal
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

  const comparison = getComparison();

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
      className="min-h-screen w-full bg-orange-600 text-[#FFFFFF] flex flex-col items-center justify-center px-6 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Title */}
      <motion.h1
        className="text-5xl font-extrabold mb-10 text-[#FFFFFF] text-center"
        initial={{ y: -30 }}
        animate={{ y: 0 }}
      >
        🥗 Nutrition Analyzer
      </motion.h1>

      {/* Input Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl bg-[#2B1E1E] p-4 rounded-2xl shadow-xl border border-[#3C2A2A]">
        <input
          type="text"
          placeholder="Enter ingredients or recipe e.g. 2 eggs and 1 banana"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded-xl text-[#FFFFFF] bg-gray-900/60 placeholder-[#A0A0A0] border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
        />

        <button
          onClick={analyzeNutrition}
          disabled={loading}
          className="px-6 py-3 bg-[#00C853] hover:bg-[#00E676] active:scale-95 transition rounded-xl font-semibold flex items-center gap-2 shadow-lg cursor-pointer"
        >
          {loading && <Loader2 className="animate-spin w-4 h-4" />}
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {/* Show error */}
      {error && <p className="text-[#FFFFFF] mt-4 text-sm">{error}</p>}

      {/* Results */}
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

          {/* Smart Insights */}
          {comparison && (
            <div className="mt-6 text-center">
              <p className="text-green-300 font-medium">
                ✅ This meal covers {comparison.caloriePercent}% of your daily
                calorie goal.
              </p>
              <p className="text-blue-300 text-sm">
                💪 It provides {comparison.proteinPercent}% of your daily
                protein target.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
