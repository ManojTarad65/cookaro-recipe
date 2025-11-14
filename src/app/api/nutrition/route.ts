// src/app/api/nutrition/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || query.trim() === "") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // ⭐ Ensure API keys exist
    if (!process.env.NUTRITIONIX_APP_ID || !process.env.NUTRITIONIX_APP_KEY) {
      console.error("❌ Nutritionix API keys are missing");
      return NextResponse.json(
        { error: "Server API keys missing" },
        { status: 500 }
      );
    }

    // ⭐ Call Nutritionix API
    const response = await axios.post(
      "https://trackapi.nutritionix.com/v2/natural/nutrients",
      { query },
      {
        headers: {
          "x-app-id": process.env.NUTRITIONIX_APP_ID,
          "x-app-key": process.env.NUTRITIONIX_APP_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const foods = response?.data?.foods;

    // ⭐ No foods found
    if (!foods || foods.length === 0) {
      return NextResponse.json(
        { error: "No nutrition data found for this food" },
        { status: 404 }
      );
    }

    const item = foods[0];

    const result = {
      calories: Math.round(item.nf_calories || 0),
      protein: Math.round(item.nf_protein || 0),
      fat: Math.round(item.nf_total_fat || 0),
      carbs: Math.round(item.nf_total_carbohydrate || 0),
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error(
      "❌ Nutrition API Error:",
      error?.response?.data || error.message
    );

    return NextResponse.json(
      {
        error: "Failed to analyze nutrition",
        details: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
