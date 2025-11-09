import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: {
          text: `You are a master chef AI. Based on this input: "${prompt}", generate a detailed recipe including:
1️⃣ Recipe Title
2️⃣ Ingredients List
3️⃣ Step-by-step Instructions
Keep it simple, structured, and in plain text.`,
        },
        temperature: 0.7,
        maxOutputTokens: 500,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ Gemini API returned error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const recipeText =
      data?.candidates?.[0]?.output ||
      data?.outputText ||
      "Sorry, I couldn't generate a recipe.";

    return NextResponse.json({ recipe: recipeText });
  } catch (error) {
    console.error("❌ Gemini API request failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch from Gemini" },
      { status: 500 }
    );
  }
}
