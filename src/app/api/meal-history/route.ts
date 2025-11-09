import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  const client = await clientPromise;
  const db = client.db("eatoai");

  const meals = await db
    .collection("mealHistory")
    .find({ email })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(meals);
}

export async function POST(request: Request) {
  const body = await request.json();
  const client = await clientPromise;
  const db = client.db("eatoai");

  await db.collection("mealHistory").insertOne({
    ...body,
    createdAt: new Date(),
    timestamp: new Date(),
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const client = await clientPromise;
  const db = client.db("eatoai");

  await db.collection("mealHistory").deleteOne({ _id: new ObjectId(id || "") });

  return NextResponse.json({ success: true });
}
