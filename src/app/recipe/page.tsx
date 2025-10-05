
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, ChefHat, User, Loader2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import Header from "@/components/Header";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  recipe?: Recipe;
}

interface Recipe {
  title: string;
  cookTime: string;
  image?: string;
  ingredients: string[];
  instructions: string[];
}

const Chatbot = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      toast.error("Please login to access the recipe generator!");
      router.push("/recipe");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "👋 Hey there, I’m your AI cooking partner! Tell me what ingredients you have or what kind of meal you’d like, and I’ll cook up the perfect recipe for you 🍳",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const recipes: Record<string, Recipe> = {
    chicken: {
      title: "Herb-Crusted Chicken Breast",
      cookTime: "30 minutes",
      image: "/images/chicken.jpg",
      ingredients: [
        "2 chicken breasts",
        "2 tbsp olive oil",
        "1 tsp dried rosemary",
        "1 lemon (juiced)",
      ],
      instructions: [
        "Preheat oven to 375°F (190°C)",
        "Rub chicken with olive oil, herbs, and lemon juice",
        "Bake for 20–25 mins until golden and cooked through",
      ],
    },
    pasta: {
      title: "Creamy Garlic Parmesan Pasta",
      cookTime: "20 minutes",
      image: "/images/pasta.jpg",
      ingredients: [
        "1 lb pasta",
        "1 cup heavy cream",
        "1 cup Parmesan cheese",
        "4 cloves garlic",
      ],
      instructions: [
        "Cook pasta until al dente",
        "Sauté garlic in butter, then add cream and cheese",
        "Toss pasta in sauce until creamy and delicious",
      ],
    },
  };

  const generateRecipe = (userInput: string) => {
    if (userInput.toLowerCase().includes("chicken")) return recipes.chicken;
    if (userInput.toLowerCase().includes("pasta")) return recipes.pasta;
    return recipes.chicken;
  };

  const saveRecipeToHistory = (recipe: Recipe, userInput: string) => {
    const recipeWithId = {
      id: Date.now().toString(),
      ...recipe,
      timestamp: new Date().toISOString(),
      userInput,
    };
    const history = JSON.parse(localStorage.getItem("recipeHistory") || "[]");
    history.unshift(recipeWithId);
    if (history.length > 50) history.splice(50);
    localStorage.setItem("recipeHistory", JSON.stringify(history));
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const recipe = generateRecipe(currentInput);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: `Here’s your recipe for **${recipe.title}** 🍽️`,
        timestamp: new Date(),
        recipe,
      };
      setMessages((prev) => [...prev, botMessage]);
      saveRecipeToHistory(recipe, currentInput);
      toast.success("✨ Recipe saved to your history!");
      setIsLoading(false);
    }, 1000);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-50">
      <Header/>
      <div className="max-w-4xl mx-auto p-4">
        <Card className="overflow-hidden border-none shadow-xl backdrop-blur-md bg-white/70">
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white p-6">
            <div className="flex items-center gap-3">
              <ChefHat className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Cookaro Recipe Chatbot</h1>
            </div>
            <p className="text-sm opacity-90 mt-1">
              Discover delicious recipes instantly 🍽️
            </p>
          </div>

          <div className="h-[420px] overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.type === "bot" && (
                    <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
                      <ChefHat className="h-4 w-4 text-orange-600" />
                    </div>
                  )}

                  <div className="max-w-[80%] space-y-2">
                    <Card
                      className={`p-3 ${
                        msg.type === "user"
                          ? "bg-orange-600 text-white rounded-br-none shadow-md"
                          : "bg-white/70 backdrop-blur-sm border border-orange-100 shadow-md"
                      }`}
                    >
                      <CardContent className="p-2">
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </CardContent>
                    </Card>

                    {/* Recipe Preview Card */}
                    {msg.recipe && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Card className="overflow-hidden border-orange-200 shadow-md hover:shadow-lg transition">
                          <img
                            src={msg.recipe.image}
                            alt={msg.recipe.title}
                            className="w-full h-40 object-cover"
                          />
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold text-orange-700">
                                {msg.recipe.title}
                              </h3>
                              <div className="flex items-center gap-1 text-orange-600 text-sm">
                                <Clock className="w-4 h-4" />{" "}
                                {msg.recipe.cookTime}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="mt-3 bg-orange-600 hover:bg-orange-700 transition"
                            >
                              View Full Recipe
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </div>

                  {msg.type === "user" && (
                    <div className="w-9 h-9 bg-orange-200 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-orange-800" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <div className="flex items-center gap-2 text-orange-600">
                <Loader2 className="animate-spin h-4 w-4" />
                <p>Cooking up something tasty...</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-6 py-4 border-t bg-orange-50/70 flex flex-wrap gap-2">
            {[
              "I have chicken",
              "Quick pasta",
              "Healthy meal",
              "Vegetarian dish",
            ].map((text, i) => (
              <Badge
                key={i}
                onClick={() => setInputValue(text)}
                className="cursor-pointer border-orange-300 hover:bg-orange-100 transition"
              >
                {text}
              </Badge>
            ))}
          </div>

          <div className="p-4 border-t bg-white/60 backdrop-blur-sm">
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your ingredients or meal idea..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="bg-orange-600 hover:bg-orange-700 transition"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chatbot;
