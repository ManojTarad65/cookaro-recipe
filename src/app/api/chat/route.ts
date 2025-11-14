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
You are EatoAI, a friendly AI nutrition coach.
Use simple English. Give practical tips. Use the provided user profile.
If user asks for recipes, provide 2–3 recipes.
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
