import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const users = await db.collection("users").find({}).toArray();
  return NextResponse.json(users);
}
