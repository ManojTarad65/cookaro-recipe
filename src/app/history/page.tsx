
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Search, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface HistoryItem {
  _id?: string;
  type?: "recipe" | "nutrition";
  timestamp: string;
  query?: string;
  recipe?: {
    title?: string;
    ingredients?: string[];
    instructions?: string[];
  };
  nutrition?: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
}

const COLORS = ["#34D399", "#60A5FA", "#FBBF24", "#F87171"];

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [chartData, setChartData] = useState<any[]>([]);
  const [macroData, setMacroData] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    const { email } = JSON.parse(userData);
    fetchHistory(email);
  }, []);

  const fetchHistory = async (email: string) => {
    try {
      const res = await axios.get(`/api/meal-history?email=${email}`);
      const data = res.data;
      setHistory(data);
      setFilteredHistory(data);
      generateCharts(data);
    } catch (error) {
      toast.error("Unable to load history.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Filter by search term
  useEffect(() => {
    const filtered = history.filter(
      (item) =>
        item.recipe?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.query?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHistory(filtered);
    generateCharts(filtered);
  }, [searchTerm, history]);

  // 📊 Generate Chart Data
  const generateCharts = (data: HistoryItem[]) => {
    if (!data || data.length === 0) return;

    // Calories trend per day
    const caloriesByDay: Record<string, number> = {};
    let totalProtein = 0,
      totalCarbs = 0,
      totalFat = 0;

    data.forEach((item) => {
      if (item.nutrition) {
        const date = new Date(item.timestamp).toLocaleDateString();
        caloriesByDay[date] =
          (caloriesByDay[date] || 0) + item.nutrition.calories;
        totalProtein += item.nutrition.protein;
        totalCarbs += item.nutrition.carbs;
        totalFat += item.nutrition.fat;
      }
    });

    const lineData = Object.entries(caloriesByDay).map(([date, calories]) => ({
      date,
      calories,
    }));

    const macroTotals = [
      { name: "Protein", value: Math.round(totalProtein) },
      { name: "Carbs", value: Math.round(totalCarbs) },
      { name: "Fat", value: Math.round(totalFat) },
    ];

    setChartData(lineData);
    setMacroData(macroTotals);
  };

  // 🗑 Delete
  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await axios.delete(`/api/meal-history?id=${id}`);
      const updated = history.filter((item) => item._id !== id);
      setHistory(updated);
      setFilteredHistory(updated);
      toast.success("Deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete item.");
    }
  };

  // 📋 Copy
  const handleCopy = (item: HistoryItem) => {
    let text = "";
    if (item.recipe) {
      text = `
${item.recipe.title}
Ingredients: ${item.recipe.ingredients?.join(", ")}
Instructions: ${item.recipe.instructions?.join(" ")}
      `;
    } else if (item.nutrition) {
      text = `
${item.query}
Calories: ${item.nutrition.calories} kcal
Protein: ${item.nutrition.protein}g
Carbs: ${item.nutrition.carbs}g
Fat: ${item.nutrition.fat}g
      `;
    }

    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-6xl mx-auto p-6 space-y-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          🥗 Your Health Dashboard
        </h1>
        {/* 🔥 Progress Summary Section */}
        {history.length > 0 && (
          <Card className="mb-10 shadow-md border border-orange-100">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">
                📊 Today's Progress Summary
              </h2>

              {/* Fetch user's profile data */}
              {(() => {
                const userData = localStorage.getItem("user");
                if (!userData) return null;
                const email = JSON.parse(userData).email;
                const todayMeals = history.filter((item) => {
                  const date = new Date(item.timestamp).toLocaleDateString();
                  const today = new Date().toLocaleDateString();
                  return date === today && item.nutrition;
                });

                if (todayMeals.length === 0)
                  return (
                    <p className="text-center text-gray-500">
                      No meals logged today yet.
                    </p>
                  );

                const totalCalories = todayMeals.reduce(
                  (sum, m) => sum + (m.nutrition?.calories || 0),
                  0
                );
                const totalProtein = todayMeals.reduce(
                  (sum, m) => sum + (m.nutrition?.protein || 0),
                  0
                );
                const totalCarbs = todayMeals.reduce(
                  (sum, m) => sum + (m.nutrition?.carbs || 0),
                  0
                );
                const totalFat = todayMeals.reduce(
                  (sum, m) => sum + (m.nutrition?.fat || 0),
                  0
                );

                // Fetch profile data from localStorage cache
                const profileData = JSON.parse(
                  localStorage.getItem("profile") || "{}"
                );
                const goalCalories = profileData.dailyCalories || 2000;
                const goalProtein = (goalCalories * 0.25) / 4;
                const goalCarbs = (goalCalories * 0.5) / 4;
                const goalFat = (goalCalories * 0.25) / 9;

                const caloriePercent = Math.min(
                  (totalCalories / goalCalories) * 100,
                  100
                ).toFixed(0);
                const proteinPercent = Math.min(
                  (totalProtein / goalProtein) * 100,
                  100
                ).toFixed(0);
                const carbsPercent = Math.min(
                  (totalCarbs / goalCarbs) * 100,
                  100
                ).toFixed(0);
                const fatPercent = Math.min(
                  (totalFat / goalFat) * 100,
                  100
                ).toFixed(0);

                return (
                  <div className="space-y-6">
                    {/* Calories */}
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-1">
                        🔥 Calories: {totalCalories} / {goalCalories} kcal
                      </p>
                      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            totalCalories > goalCalories
                              ? "bg-red-500"
                              : "bg-orange-500"
                          } transition-all duration-500`}
                          style={{ width: `${caloriePercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Protein */}
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-1">
                        💪 Protein: {totalProtein}g / {Math.round(goalProtein)}g
                      </p>
                      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all duration-500"
                          style={{ width: `${proteinPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Carbs */}
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-1">
                        🍞 Carbs: {totalCarbs}g / {Math.round(goalCarbs)}g
                      </p>
                      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${carbsPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Fats */}
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-1">
                        🥑 Fats: {totalFat}g / {Math.round(goalFat)}g
                      </p>
                      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 transition-all duration-500"
                          style={{ width: `${fatPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Motivation message */}
                    <div className="text-center mt-4">
                      {totalCalories < goalCalories * 0.9 ? (
                        <p className="text-green-600 font-semibold">
                          ✅ You're doing great! Keep fueling your body 💪
                        </p>
                      ) : totalCalories > goalCalories ? (
                        <p className="text-red-500 font-semibold">
                          ⚠️ You’ve gone over your calorie goal today. Balance
                          it tomorrow!
                        </p>
                      ) : (
                        <p className="text-orange-500 font-semibold">
                          💡 Almost there — just a bit more to reach your daily
                          goal!
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search your meals or recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-8 w-8 text-orange-600" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <p className="text-center text-gray-600">
            No history available yet. Analyze your first meal to get insights!
          </p>
        ) : (
          <>
            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Calories Trend */}
              <Card className="shadow-lg border border-orange-100">
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold mb-3 text-gray-800">
                    🔥 Calories Trend
                  </h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="calories"
                        stroke="#F97316"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Macro Pie Chart */}
              <Card className="shadow-lg border border-orange-100">
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold mb-3 text-gray-800">
                    🍞 Macro Composition
                  </h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={macroData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label
                      >
                        {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* History Cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-10">
              {filteredHistory.map((item) => (
                <Card
                  key={item._id}
                  className="hover:shadow-lg transition-all duration-300 border-orange-100"
                >
                  <CardContent>
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {item.recipe?.title || item.query || "Untitled Entry"}
                        </h2>
                        <p className="text-sm text-gray-500 mb-2">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>

                        {item.nutrition && (
                          <div className="text-gray-700 text-sm mt-2">
                            <p>🔥 Calories: {item.nutrition.calories} kcal</p>
                            <p>💪 Protein: {item.nutrition.protein} g</p>
                            <p>🥑 Fat: {item.nutrition.fat} g</p>
                            <p>🍞 Carbs: {item.nutrition.carbs} g</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant="destructive"
                          className="h-8 w-8 p-0 flex items-center justify-center"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          className="h-8 w-8 p-0 flex items-center justify-center"
                          onClick={() => handleCopy(item)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
