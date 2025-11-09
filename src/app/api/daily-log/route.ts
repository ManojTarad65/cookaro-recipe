import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET — fetch meals for today
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("eatoai");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const meals = await db
    .collection("dailyLogs")
    .find({
      email,
      date: { $gte: today },
    })
    .sort({ time: 1 })
    .toArray();

  return NextResponse.json(meals);
}

// POST — add new meal
export async function POST(req: Request) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("eatoai");

  await db.collection("dailyLogs").insertOne({
    ...body,
    date: new Date(),
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true });
}

// DELETE — remove meal
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("eatoai");

  await db.collection("dailyLogs").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ success: true });
}
