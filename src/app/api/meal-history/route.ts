// src/app/api/meal-history/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");

  if (!email)
    return NextResponse.json({ error: "Missing email" }, { status: 400 });

  try {
    const client = await clientPromise;
    const db = client.db("cookaro");
    const history = await db
      .collection("mealHistory")
      .find({ email })
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json(history);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, recipe, query } = body;

    if (!email || !recipe)
      return NextResponse.json(
        { error: "Missing email or recipe" },
        { status: 400 }
      );

    const client = await clientPromise;
    const db = client.db("cookaro");

    const item = {
      email,
      type: "recipe",
      timestamp: new Date().toISOString(),
      query,
      recipe,
    };

    await db.collection("mealHistory").insertOne(item);

    return NextResponse.json({ success: true, message: "Recipe saved" });
  } catch (error) {
    console.error("Save history error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    const client = await clientPromise;
    const db = client.db("cookaro");
    const { ObjectId } = await import("mongodb");

    await db.collection("mealHistory").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
