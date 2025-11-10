"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ChefHat, Loader2, X, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { toast } from "sonner";
import { useNotification } from "@/context/NotificationContext"; // ✅ Notification system

/* ----------------------- Types ----------------------- */
interface Recipe {
  idMeal: string;
  title: string;
  image?: string;
  category?: string;
  area?: string;
  ingredients: string[];
  instructions: string[];
  cookTime?: string;
}

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  recipes?: Recipe[];
}

/* ----------------------- Helpers ----------------------- */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .join(" ")
    .trim();
const { addNotification, onHistoryUpdate } = useNotification();

const buildIngredientsFromMeal = (meal: any): string[] => {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`] ?? "";
    if (ing && ing.trim())
      ingredients.push(`${ing.trim()}${measure ? ` — ${measure.trim()}` : ""}`);
  }
  return ingredients;
};

const splitInstructions = (text?: string): string[] => {
  if (!text) return [];
  return text
    .split(/\r\n|\n{1,}|\.\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
};

/* ----------------------- API Search Functions ----------------------- */
const searchByName = async (q: string, topN = 3): Promise<Recipe[]> => {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
        q
      )}`
    );
    const data = await res.json();
    const meals = data?.meals ?? [];
    return meals.slice(0, topN).map((meal: any) => ({
      idMeal: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
      area: meal.strArea,
      ingredients: buildIngredientsFromMeal(meal),
      instructions: splitInstructions(meal.strInstructions),
      cookTime: "30-45 mins",
    }));
  } catch {
    return [];
  }
};

const searchByIngredients = async (
  ingredients: string[],
  topN = 3
): Promise<Recipe[]> => {
  try {
    const normalized = ingredients.map((i) => normalize(i));
    const matchCounts: Record<string, number> = {};
    const mealMeta: Record<string, { strMeal: string; strMealThumb: string }> =
      {};

    await Promise.all(
      normalized.map(async (ing) => {
        if (!ing) return;
        try {
          const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
              ing
            )}`
          );
          const data = await res.json();
          const meals = data?.meals ?? [];
          meals.forEach((m: any) => {
            const id = m.idMeal;
            matchCounts[id] = (matchCounts[id] || 0) + 1;
            if (!mealMeta[id])
              mealMeta[id] = {
                strMeal: m.strMeal,
                strMealThumb: m.strMealThumb,
              };
          });
        } catch {}
      })
    );

    if (Object.keys(matchCounts).length === 0) return [];

    const sortedIds = Object.entries(matchCounts)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, topN * 3);

    const details = (
      await Promise.all(
        sortedIds.map(async ({ id }) => {
          try {
            const res = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
            );
            const data = await res.json();
            return data?.meals?.[0] ?? null;
          } catch {
            return null;
          }
        })
      )
    ).filter(Boolean);

    const results: { recipe: Recipe; matchCount: number }[] = details.map(
      (meal: any) => {
        const mealIngredients = Array.from({ length: 20 }, (_, i) =>
          (meal[`strIngredient${i + 1}`] || "").toLowerCase().trim()
        ).filter(Boolean);
        const matchCount = normalized.filter((ing) =>
          mealIngredients.some((m) => m.includes(ing) || ing.includes(m))
        ).length;
        return {
          recipe: {
            idMeal: meal.idMeal,
            title: meal.strMeal,
            image: meal.strMealThumb,
            category: meal.strCategory,
            area: meal.strArea,
            ingredients: buildIngredientsFromMeal(meal),
            instructions: splitInstructions(meal.strInstructions),
            cookTime: "30-45 mins",
          },
          matchCount,
        };
      }
    );

    results.sort((a, b) => b.matchCount - a.matchCount);
    return results.slice(0, topN).map((r) => r.recipe);
  } catch {
    return [];
  }
};

const searchByCategory = async (
  category: string,
  topN = 3
): Promise<Recipe[]> => {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
        category
      )}`
    );
    const meals = res ? (await res.json())?.meals ?? [] : [];
    const details = (
      await Promise.all(
        meals.slice(0, topN * 2).map(async (m: any) => {
          try {
            const r = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${m.idMeal}`
            );
            const d = await r.json();
            return d?.meals?.[0] ?? null;
          } catch {
            return null;
          }
        })
      )
    ).filter(Boolean);
    return details.slice(0, topN).map((meal: any) => ({
      idMeal: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
      area: meal.strArea,
      ingredients: buildIngredientsFromMeal(meal),
      instructions: splitInstructions(meal.strInstructions),
      cookTime: "30-45 mins",
    }));
  } catch {
    return [];
  }
};

/* ----------------------- Component ----------------------- */
export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content:
        "👋 Hey! Enter ingredients, dish names or categories (comma separated) and I'll find recipes for you.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { addNotification } = useNotification(); // ✅ Notification hook

  const suggestions = [
    "Vegetarian",
    "Vegan",
    "Seafood",
    "Chicken",
    "Beef",
    "Dessert",
    "Pasta",
    "Tomato",
    "Potato",
    "Cheese",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const categoryMap: Record<string, string> = {
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    seafood: "Seafood",
    chicken: "Chicken",
    beef: "Beef",
    dessert: "Dessert",
    pasta: "Pasta",
  };

  /* ✅ Updated: Save to MongoDB and LocalStorage */
  const saveToHistory = async (recipe: Recipe, userInput: string) => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const { email } = JSON.parse(userData);
      if (!email) return;

      // ✅ Save recipe to MongoDB
      await fetch("/api/meal-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          type: "recipe",
          query: userInput,
          recipe: {
            title: recipe.title,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            image: recipe.image,
            category: recipe.category,
            area: recipe.area,
            cookTime: recipe.cookTime,
          },
        }),
      });

      addNotification(`Recipe "${recipe.title}" saved to your history 🍽️`);
      toast.success("Recipe saved to history!");
      onHistoryUpdate(); // ✅ Trigger global update event

      // ✅ Also store locally for offline
      const storedHistory = localStorage.getItem("recipeHistory");
      const history = storedHistory ? JSON.parse(storedHistory) : [];
      const newItem = {
        id: `${Date.now()}`,
        title: recipe.title,
        timestamp: new Date().toISOString(),
        userInput,
        recipe,
      };
      localStorage.setItem(
        "recipeHistory",
        JSON.stringify([newItem, ...history])
      );
    } catch (error) {
      console.error("Error saving history:", error);
    }
  };

  const handleSend = useCallback(async () => {
    const raw = inputValue.trim();
    if (!raw) return;

    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-u`, type: "user", content: raw },
    ]);
    setInputValue("");
    setIsLoading(true);

    const queries = raw
      .split(",")
      .map((q) => q.trim())
      .filter(Boolean);

    for (const query of queries) {
      let recipes: Recipe[] = [];
      const lower = query.toLowerCase();

      let matchedCategory = "";
      for (const key of Object.keys(categoryMap))
        if (lower.includes(key)) matchedCategory = categoryMap[key];

      if (matchedCategory) recipes = await searchByCategory(matchedCategory, 3);
      if (recipes.length === 0) {
        const tokens = query.split(/\s+/).filter(Boolean);
        if (tokens.length >= 1)
          recipes = await searchByIngredients(tokens.slice(0, 5), 3);
      }
      if (recipes.length === 0) recipes = await searchByName(query, 3);

      if (recipes.length > 0) {
        addNotification(`Found ${recipes.length} recipes for "${query}" 🍲`);
        for (const recipe of recipes) await saveToHistory(recipe, query);
      } else {
        addNotification(`No recipes found for "${query}" ❌`);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-b`,
          type: "bot",
          content: recipes.length
            ? `Top ${recipes.length} recipes for "${query}"`
            : `No recipes found for "${query}" 😢`,
          recipes,
        },
      ]);
    }

    setIsLoading(false);
  }, [inputValue]);

  const handleCopy = (recipe: Recipe) => {
    const text = `Recipe: ${
      recipe.title
    }\n\nIngredients:\n${recipe.ingredients.join(
      "\n"
    )}\n\nInstructions:\n${recipe.instructions.join("\n")}`;
    navigator.clipboard.writeText(text);
    toast.success("Recipe copied!");
    addNotification(`You copied the recipe "${recipe.title}" 📋`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col h-[90vh]">
      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 mb-2">
        {suggestions.map((s) => (
          <Badge
            key={s}
            className="cursor-pointer hover:bg-green-200"
            onClick={() =>
              setInputValue((prev) => (prev ? prev + ", " + s : s))
            }
          >
            {s}
          </Badge>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              } mb-3`}
            >
              <Card className="max-w-[75%] p-3">
                <CardContent>
                  {msg.type === "bot" && (
                    <ChefHat className="w-5 h-5 mb-1 text-green-600" />
                  )}
                  <p>{msg.content}</p>
                  {msg.recipes &&
                    msg.recipes.map((r) => (
                      <div
                        key={r.idMeal}
                        className="mt-2 border rounded-lg p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 justify-between"
                      >
                        <div
                          className="flex items-center gap-2"
                          onClick={() => setSelectedRecipe(r)}
                        >
                          {r.image && (
                            <Image
                              src={r.image}
                              alt={r.title}
                              width={50}
                              height={50}
                              className="rounded-md object-cover"
                            />
                          )}
                          <div>
                            <p className="font-semibold">{r.title}</p>
                            <p className="text-sm text-gray-500">
                              {r.category}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleCopy(r)}
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </Button>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Type ingredients, dishes or categories..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Recipe Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-start z-50 p-4 overflow-auto"
            onClick={() => setSelectedRecipe(null)}
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              exit={{ y: -50 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 overflow-y-auto max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setSelectedRecipe(null)}
              >
                <X />
              </Button>
              <h2 className="text-2xl font-bold mb-2">
                {selectedRecipe.title}
              </h2>
              {selectedRecipe.image && (
                <Image
                  src={selectedRecipe.image}
                  alt={selectedRecipe.title}
                  width={350}
                  height={200}
                  className="rounded-lg object-cover mb-4 w-full"
                />
              )}
              <div className="flex gap-3 mb-4">
                {selectedRecipe.category && (
                  <Badge>{selectedRecipe.category}</Badge>
                )}
                {selectedRecipe.area && <Badge>{selectedRecipe.area}</Badge>}
                {selectedRecipe.cookTime && (
                  <Badge>{selectedRecipe.cookTime}</Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mb-4 flex items-center gap-1"
                onClick={() => handleCopy(selectedRecipe)}
              >
                <Copy className="w-4 h-4" />
                Copy Recipe
              </Button>
              <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
              <ul className="list-disc list-inside mb-4">
                {selectedRecipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside">
                {selectedRecipe.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ol>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
