"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Search, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";

interface RecipeHistoryItem {
  id: string;
  title?: string;
  timestamp: string;
  userInput: string;
  recipe?: {
    title?: string;
    ingredients?: string[];
    instructions?: string[];
  };
}

const HistoryPage = () => {
  const [history, setHistory] = useState<RecipeHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHistory, setFilteredHistory] = useState<RecipeHistoryItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedHistory = localStorage.getItem("recipeHistory");
    if (storedHistory) {
      const parsed = JSON.parse(storedHistory);
      setHistory(parsed);
      setFilteredHistory(parsed);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const filtered = history.filter(
      (item) =>
        item.recipe?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.userInput?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHistory(filtered);
  }, [searchTerm, history]);

  const handleDelete = (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    setFilteredHistory(updatedHistory);
    localStorage.setItem("recipeHistory", JSON.stringify(updatedHistory));
    toast.success("Recipe removed from history!");
  };

  const handleCopy = (item: RecipeHistoryItem) => {
    if (!item.recipe) return;
    const text = `
${item.recipe.title || "Recipe"} 
Ingredients: ${item.recipe.ingredients?.join(", ")}
Instructions: ${item.recipe.instructions?.join(" ")}
    `;
    navigator.clipboard.writeText(text);
    toast.success("Recipe copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          Your Recipe History
        </h1>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search by recipe or ingredient..."
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
            No recipes found in your history.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredHistory.map((item, idx) => (
              <Card
                key={`${item.id}-${idx}`}
                className="hover:shadow-lg transition-all duration-300 border-orange-100"
              >
                <CardContent>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {item.recipe?.title || "Untitled Recipe"}
                      </h2>
                      <p className="text-sm text-gray-500 mb-2">
                        Requested:{" "}
                        <span className="text-gray-700">{item.userInput}</span>
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        Time: {new Date(item.timestamp).toLocaleString()}
                      </p>

                      <div className="text-gray-600 text-sm">
                        <strong>Ingredients:</strong>
                        <ul className="list-disc ml-5">
                          {item.recipe?.ingredients?.map((ing, idx) => (
                            <li key={idx}>{ing}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-gray-600 text-sm mt-2">
                        <strong>Instructions:</strong>
                        <ol className="list-decimal ml-5">
                          {item.recipe?.instructions?.map((inst, idx) => (
                            <li key={idx}>{inst}</li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="destructive"
                        className="h-8 w-8 p-0 flex items-center justify-center"
                        onClick={() => handleDelete(item.id)}
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
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
