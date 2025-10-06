import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const response = await axios.post(
      "https://trackapi.nutritionix.com/v2/natural/nutrients",
      { query },
      {
        headers: {
          "x-app-id": process.env.NUTRITIONIX_APP_ID!,
          "x-app-key": process.env.NUTRITIONIX_APP_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    const item = response.data.foods[0];

    const result = {
      calories: item.nf_calories,
      protein: item.nf_protein,
      fat: item.nf_total_fat,
      carbs: item.nf_total_carbohydrate,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(
      "Nutrition API Error:",
      error?.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Failed to analyze nutrition" },
      { status: 500 }
    );
  }
}
