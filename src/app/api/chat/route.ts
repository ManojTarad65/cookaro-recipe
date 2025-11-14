import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, userProfile } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.error("❌ Missing GEMINI_API_KEY in .env.local");
      return NextResponse.json(
        { error: "Missing Gemini API key" },
        { status: 500 }
      );
    }

    // Gemini endpoint
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    // 🧠 Build a personalized system prompt using user profile
    const profileText = userProfile
      ? `
User Profile:
- Age: ${userProfile.age || "Not provided"}
- Gender: ${userProfile.gender || "Not provided"}
- Height: ${userProfile.height || "Not provided"} cm
- Weight: ${userProfile.weight || "Not provided"} kg
- Activity Level: ${userProfile.activityLevel || "Not provided"}
- Daily Calories Goal: ${userProfile.dailyCalories || "Unknown"}
`
      : "User profile is missing.";

    const SYSTEM_PROMPT = `
You are **EatoAI**, a friendly AI nutrition expert.

Your job:
- Give clear, helpful answers about food, recipes, calories, dieting, fitness & nutrition.
- Use simple English.
- Give direct guidance.
- If the user asks for a meal idea, give 2–4 suggestions.
- If the user asks for nutrition advice, include calories/protein if possible.

Here is the user's profile. Use it to personalize advice:
${profileText}
`;

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT + "\nUser: " + message }],
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("⚠️ Gemini Error:", data.error);
      return NextResponse.json({
        reply: `⚠️ Gemini API Error: ${data.error.message}`,
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("💥 Chat API Error:", error);
    return NextResponse.json({
      reply: "Server error. Please try again later.",
    });
  }
}
