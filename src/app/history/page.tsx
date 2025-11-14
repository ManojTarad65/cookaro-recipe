"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Trash2, Search, Loader2, Copy, Star } from "lucide-react";
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
  favorite?: boolean;
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

const ITEMS_PER_PAGE = 10;

const COLORS = ["#34D399", "#60A5FA", "#FBBF24", "#F87171"];

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [chartData, setChartData] = useState<any[]>([]);
  const [macroData, setMacroData] = useState<any[]>([]);

  // =====================================================
  // Fetch history with pagination
  // =====================================================
  const fetchHistory = useCallback(
    async (email: string, reset = false) => {
      try {
        setLoading(true);

        const res = await axios.get(
          `/api/meal-history?email=${email}&page=${
            reset ? 1 : page
          }&limit=${ITEMS_PER_PAGE}`
        );

        const data = res.data;

        if (reset) {
          setHistory(data);
          setFilteredHistory(data);
        } else {
          setHistory((prev) => [...prev, ...data]);
          setFilteredHistory((prev) => [...prev, ...data]);
        }

        setHasMore(data.length === ITEMS_PER_PAGE);
        generateCharts(reset ? data : [...history, ...data]);
      } catch (error) {
        toast.error("Unable to load history.");
      } finally {
        setLoading(false);
      }
    },
    [page, history]
  );

  // Fetch first page on mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    const { email } = JSON.parse(userData);
    fetchHistory(email, true);
  }, []);

  // Load more handler
  const loadMore = () => setPage((prev) => prev + 1);

  useEffect(() => {
    if (page === 1) return;

    const userData = localStorage.getItem("user");
    if (!userData) return;
    const { email } = JSON.parse(userData);

    fetchHistory(email);
  }, [page]);

  // =====================================================
  // Clear All History
  // =====================================================
  const clearAllHistory = async () => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    const { email } = JSON.parse(userData);

    try {
      await axios.delete(`/api/meal-history?all=true&email=${email}`);
      setHistory([]);
      setFilteredHistory([]);
      toast.success("All history deleted!");
    } catch (err) {
      toast.error("Failed to clear history.");
    }
  };

  // =====================================================
  // Toggle Favorite
  // =====================================================
  const toggleFavorite = async (id: string, fav: boolean) => {
    try {
      await axios.patch(`/api/meal-history`, {
        id,
        favorite: !fav,
      });

      const updated = history.map((item) =>
        item._id === id ? { ...item, favorite: !fav } : item
      );

      setHistory(updated);
      setFilteredHistory(updated);
    } catch (err) {
      toast.error("Failed to update favorite");
    }
  };

  // =====================================================
  // Filter by search
  // =====================================================
  useEffect(() => {
    const filtered = history.filter(
      (item) =>
        item.recipe?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.query?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredHistory(filtered);
    generateCharts(filtered);
  }, [searchTerm, history]);

  // =====================================================
  // Charts
  // =====================================================
  const generateCharts = (data: HistoryItem[]) => {
    if (!data || data.length === 0) return;

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

  // =====================================================
  // Delete one
  // =====================================================
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

  // =====================================================
  // Copy
  // =====================================================
  const handleCopy = (item: HistoryItem) => {
    let text = "";

    if (item.recipe) {
      text = `${item.recipe.title}
Ingredients: ${item.recipe.ingredients?.join(", ")}
Instructions: ${item.recipe.instructions?.join(" ")}
`;
    } else if (item.nutrition) {
      text = `${item.query}
Calories: ${item.nutrition.calories} kcal
Protein: ${item.nutrition.protein}g
Carbs: ${item.nutrition.carbs}g
Fat: ${item.nutrition.fat}g
`;
    }

    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // =====================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-6xl mx-auto p-6 space-y-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          🥗 Your Health Dashboard
        </h1>

        {/* ===== CLEAR ALL BUTTON ===== */}
        {history.length > 0 && (
          <div className="text-center">
            <Button
              variant="destructive"
              className="px-6"
              onClick={clearAllHistory}
            >
              Clear All History
            </Button>
          </div>
        )}

        {/* ==== rest of your code stays same (charts + cards) ==== */}

        {/* Only update inside history card: add favorite button */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {filteredHistory.map((item) => (
            <Card
              key={item._id}
              className="hover:shadow-xl transition-all duration-300 border-orange-100"
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
                    {/* ⭐ Favorite */}
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() =>
                        toggleFavorite(item._id!, item.favorite ?? false)
                      }
                    >
                      <Star
                        className={`h-4 w-4 ${
                          item.favorite ? "text-yellow-500 fill-yellow-500" : ""
                        }`}
                      />
                    </Button>

                    {/* 🗑 Delete */}
                    <Button
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDelete(item._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    {/* 📋 Copy */}
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
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

        {/* ===== Pagination Load More ===== */}
        {hasMore && (
          <div className="text-center mt-6">
            <Button onClick={loadMore} className="bg-orange-600">
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
