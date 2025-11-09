import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  const client = await clientPromise;
  const db = client.db("eatoai");
  const data = await db.collection("profiles").findOne({ email });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const client = await clientPromise;
  const db = client.db("eatoai");

  await db
    .collection("profiles")
    .updateOne({ email: body.email }, { $set: body }, { upsert: true });

  return NextResponse.json({ success: true });
}
