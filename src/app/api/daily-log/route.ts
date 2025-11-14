import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "cookaro"; // ✅ keep same DB everywhere
const COLLECTION = "dailyLogs";

// ================================
// GET — Fetch meals for TODAY
// ================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Start of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const meals = await db
      .collection(COLLECTION)
      .find({
        email,
        date: { $gte: startOfToday },
      })
      .sort({ timestamp: -1 }) // newest first
      .toArray();

    return NextResponse.json(meals, { status: 200 });
  } catch (err) {
    console.error("❌ GET daily-log error:", err);
    return NextResponse.json(
      { error: "Failed to load daily logs" },
      { status: 500 }
    );
  }
}

// ================================
// POST — Add a new meal entry
// ================================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, name, type } = body;

    if (!email || !name || !type) {
      return NextResponse.json(
        { error: "email, name, and type are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const entry = {
      ...body,
      date: new Date(), // for filtering by day
      timestamp: new Date().toISOString(), // for UI
      createdAt: new Date(),
    };

    await db.collection(COLLECTION).insertOne(entry);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("❌ POST daily-log error:", err);
    return NextResponse.json({ error: "Failed to add meal" }, { status: 500 });
  }
}

// ================================
// DELETE — Remove ONE meal
// ================================
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("❌ DELETE daily-log error:", err);
    return NextResponse.json(
      { error: "Failed to delete meal" },
      { status: 500 }
    );
  }
}
