"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface Meal {
  _id?: string;
  type: "Breakfast" | "Lunch" | "Snacks" | "Dinner";
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time?: string;
}

export default function DailyLog() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({
    type: "Breakfast",
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  // ✅ Fetch meals for today
  useEffect(() => {
    if (user?.email) fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await axios.get(`/api/daily-log?email=${user.email}`);
      setMeals(res.data);
    } catch (err) {
      toast.error("Unable to fetch meals 😔");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add meal
  const handleAddMeal = async () => {
    if (!newMeal.name?.trim()) {
      toast.error("Please enter a meal name.");
      return;
    }

    try {
      await axios.post("/api/daily-log", {
        email: user.email,
        ...newMeal,
      });

      toast.success(`${newMeal.type} added successfully! 🍽️`);
      setNewMeal({
        type: "Breakfast",
        name: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      });
      fetchMeals();
    } catch {
      toast.error("Error adding meal 😕");
    }
  };

  // ✅ Delete meal
  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await axios.delete(`/api/daily-log?id=${id}`);
      toast.success("Meal deleted successfully 🗑️");
      fetchMeals();
    } catch {
      toast.error("Error deleting meal.");
    }
  };

  // ✅ Calculate total nutrition
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-950 dark:to-gray-900 transition-all duration-500">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* ✅ Page Title */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-orange-700 dark:text-orange-400">
            🍽️ Daily Meal Log
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Track your meals, calories, and macros for a healthier you!
          </p>
        </header>

        {/* ✅ Add Meal Form */}
        <Card className="p-4 border border-orange-200 dark:border-orange-800 shadow-md">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
            Add a Meal
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            <select
              value={newMeal.type}
              onChange={(e) =>
                setNewMeal({ ...newMeal, type: e.target.value as Meal["type"] })
              }
              className="border rounded-md p-2 dark:bg-gray-800 dark:text-white"
              aria-label="Meal Type"
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Snacks</option>
              <option>Dinner</option>
            </select>

            <Input
              placeholder="Meal name"
              value={newMeal.name}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
            />
            <Input
              placeholder="Calories"
              type="number"
              value={newMeal.calories}
              onChange={(e) =>
                setNewMeal({ ...newMeal, calories: parseFloat(e.target.value) })
              }
            />
            <Input
              placeholder="Protein (g)"
              type="number"
              value={newMeal.protein}
              onChange={(e) =>
                setNewMeal({ ...newMeal, protein: parseFloat(e.target.value) })
              }
            />
            <Input
              placeholder="Carbs (g)"
              type="number"
              value={newMeal.carbs}
              onChange={(e) =>
                setNewMeal({ ...newMeal, carbs: parseFloat(e.target.value) })
              }
            />
            <Input
              placeholder="Fats (g)"
              type="number"
              value={newMeal.fat}
              onChange={(e) =>
                setNewMeal({ ...newMeal, fat: parseFloat(e.target.value) })
              }
            />
          </div>

          <Button
            onClick={handleAddMeal}
            className="mt-4 w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Meal
          </Button>
        </Card>

        {/* ✅ Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        ) : meals.length === 0 ? (
          <Card className="p-6 text-center text-gray-500 dark:text-gray-400 border border-orange-100 dark:border-orange-800">
            <p>No meals logged yet. Start by adding one above! 🥗</p>
          </Card>
        ) : (
          <>
            {/* ✅ Daily Summary */}
            <Card className="border border-orange-200 dark:border-orange-800 p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-2 text-orange-700 dark:text-orange-400">
                📊 Daily Summary
              </h2>
              <p>🔥 Calories: {totals.calories} kcal</p>
              <p>💪 Protein: {totals.protein} g</p>
              <p>🍞 Carbs: {totals.carbs} g</p>
              <p>🥑 Fats: {totals.fat} g</p>
            </Card>

            {/* ✅ Meal List */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {meals.map((meal) => (
                <Card
                  key={meal._id}
                  className="border border-orange-100 dark:border-orange-800 shadow-md hover:shadow-lg transition"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                          {meal.type}: {meal.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          🔥 {meal.calories} kcal | 💪 {meal.protein}g | 🍞{" "}
                          {meal.carbs}g | 🥑 {meal.fat}g
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(meal._id)}
                        aria-label={`Delete ${meal.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
}
