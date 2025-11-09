import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

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

    // ✅ Correct endpoint for Gemini 2.5 Flash model
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are EatoAI, a friendly AI health assistant. 
Answer the user clearly and helpfully about food, fitness, or health.
User message: ${message}`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("⚠️ Gemini API Error:", data.error);
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
