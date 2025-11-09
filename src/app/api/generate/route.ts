import { NextResponse } from "next/server";
import { generateRecipe } from "@/utils/gemini";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const recipe = await generateRecipe(prompt);

    if (!recipe) {
      return NextResponse.json(
        { error: "Failed to generate recipe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ recipe });
  } catch (err: any) {
    console.error("API route error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
