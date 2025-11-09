"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  LogOut,
  History,
  HeartPulse,
  Calculator,
} from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [health, setHealth] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
  });
  const [stats, setStats] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Fetch user and health data
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchProfile(parsedUser.email);
    } else {
      router.push("/login");
    }
  }, [router]);

  // Fetch profile from MongoDB
  const fetchProfile = async (email: string) => {
    try {
      const res = await fetch(`/api/profile?email=${email}`);
      const data = await res.json();
      if (data) {
        setHealth(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Save health info
  const handleHealthSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, ...health }),
      });

      if (res.ok) {
        toast.success("Health details saved successfully!");
        calculateStats(health);

        // ✅ Save health + calculated stats to localStorage
        localStorage.setItem("profile", JSON.stringify({ ...health, stats }));
      } else {
        toast.error("Failed to save details.");
      }
    } catch (err) {
      toast.error("Error saving data.");
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate BMI, BMR, Calories, Macros
  const calculateStats = (data: any) => {
    const { age, gender, height, weight, activityLevel } = data;
    if (!age || !height || !weight || !activityLevel) return;

    const heightM = parseFloat(height) / 100;
    const bmi = (parseFloat(weight) / (heightM * heightM)).toFixed(1);

    // BMR Calculation
    let bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const activityMap: any = {
      low: 1.2,
      moderate: 1.55,
      high: 1.725,
    };

    const dailyCalories = Math.round(bmr * (activityMap[activityLevel] || 1.2));

    // Macro Distribution
    const proteinCals = dailyCalories * 0.25;
    const carbCals = dailyCalories * 0.5;
    const fatCals = dailyCalories * 0.25;

    const calculatedStats = {
      bmi,
      bmr: Math.round(bmr),
      dailyCalories,
      protein: Math.round(proteinCals / 4),
      carbs: Math.round(carbCals / 4),
      fats: Math.round(fatCals / 9),
    };

    setStats(calculatedStats);

    // ✅ Also store stats to localStorage for reuse
    localStorage.setItem(
      "profile",
      JSON.stringify({ ...data, ...calculatedStats })
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("recipeHistory");
    localStorage.removeItem("profile");
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 text-lg font-medium text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-5xl mx-auto py-20 px-4 space-y-8">
        {/* Health Info Form */}
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-orange-600" />
              Health Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleHealthSave}
              className="grid md:grid-cols-2 gap-4"
            >
              {["age", "gender", "height", "weight", "activityLevel"].map(
                (field) => (
                  <div key={field}>
                    <Label className="capitalize">{field}</Label>
                    <Input
                      name={field}
                      placeholder={`Enter your ${field}`}
                      value={health[field as keyof typeof health] || ""}
                      onChange={(e) =>
                        setHealth({ ...health, [field]: e.target.value })
                      }
                      required
                    />
                  </div>
                )
              )}

              <div className="md:col-span-2 mt-3">
                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Health Info"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Smart Stats Card */}
        {stats && (
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-orange-600" />
                Your Smart Health Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6 text-gray-700">
              <div>
                <h4 className="font-semibold">BMI</h4>
                <p>{stats.bmi}</p>
              </div>
              <div>
                <h4 className="font-semibold">BMR</h4>
                <p>{stats.bmr} kcal/day</p>
              </div>
              <div>
                <h4 className="font-semibold">Calories Needed</h4>
                <p>{stats.dailyCalories} kcal/day</p>
              </div>
              <div>
                <h4 className="font-semibold">Protein</h4>
                <p>{stats.protein} g/day</p>
              </div>
              <div>
                <h4 className="font-semibold">Carbs</h4>
                <p>{stats.carbs} g/day</p>
              </div>
              <div>
                <h4 className="font-semibold">Fats</h4>
                <p>{stats.fats} g/day</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Basic Profile Info */}
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  value={user.email}
                  className="pl-10 bg-gray-50"
                  disabled
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Link href="/history" className="flex-1">
                <Button variant="outline" className="w-full">
                  <History className="h-4 w-4 mr-2" />
                  Recipe History
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="flex-1"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
