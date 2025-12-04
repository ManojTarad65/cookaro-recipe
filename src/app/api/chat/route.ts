import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, userProfile } = await req.json();

    if (!message) {
      return NextResponse.json({ reply: "Message cannot be empty." });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ reply: "Server error: API key missing." });
    }

    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const profileText = userProfile
      ? `User Profile:
Age: ${userProfile.age}
Gender: ${userProfile.gender}
Height: ${userProfile.height}
Weight: ${userProfile.weight}
Activity Level: ${userProfile.activityLevel}
Daily Calories Goal: ${userProfile.dailyCalories}`
      : "No profile saved.";

    const SYSTEM_PROMPT = `
You are EatoAI, a friendly and expert AI nutrition coach.
Your goal is to help users eat healthy and cook delicious meals.

GUIDELINES:
1. **Structure is Key**: When asked for a recipe, ALWAYS use the following format:
   ### 🍽️ [Recipe Name]
   **⏱️ Prep time:** [Time] | **🍳 Cook time:** [Time] | **🔥 Calories:** [Approx]

   ### 🛒 Ingredients:
   * [Ingredient 1]
   * [Ingredient 2]
   ...

   ### 👩‍🍳 Instructions:
   1. **[Step Name]:** [Detailed instruction]
   2. **[Step Name]:** [Detailed instruction]
   ...

   ### 🥗 Nutrition (per serving):
   * **Protein:** [g]
   * **Carbs:** [g]
   * **Fats:** [g]

2. **Be Friendly**: Use emojis and an encouraging tone.
3. **Personalize**: Use the provided User Profile to adjust portion sizes or ingredients if needed.
4. **Formatting**: Use Markdown. Use **bold** for emphasis. Use lists for readability.
`;

    // --- Retry Logic ---
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;

      try {
        const response = await fetch(GEMINI_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${SYSTEM_PROMPT}\n\n${profileText}\n\nUser: ${message}`,
                  },
                ],
              },
            ],
          }),
        });

        const data = await response.json();

        if (data.error) {
          const msg = data.error.message.toLowerCase();
          if (msg.includes("overloaded") || msg.includes("busy")) {
            // Retry
            await new Promise((res) => setTimeout(res, attempts * 500));
            continue;
          }
          return NextResponse.json({ reply: "AI Error. Try again later." });
        }

        const reply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "I couldn't generate a response.";

        return NextResponse.json({ reply });
      } catch (error) {
        await new Promise((res) => setTimeout(res, attempts * 400));
      }
    }

    return NextResponse.json({
      reply:
        "⚠️ AI is overloaded right now. Please wait a moment and try again.",
    });
  } catch (err) {
    return NextResponse.json({
      reply: "Server error. Please try again.",
    });
  }
}
