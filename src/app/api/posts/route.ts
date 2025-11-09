import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("cookaro"); // ✅ change this if your DB has a different name

    const posts = await db
      .collection("posts")
      .find({})
      .sort({ _id: -1 })
      .toArray();

    // ✅ ensure posts is always an array
    if (!Array.isArray(posts)) {
      throw new Error("Fetched data is not an array");
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("❌ GET /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { title, caption, image } = await req.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("cookaro"); // ✅ ensure same DB name as in your Atlas

    const newPost = {
      title: title.trim(),
      caption: caption?.trim() || "",
      image: image || null,
      createdAt: new Date(),
    };

    const result = await db.collection("posts").insertOne(newPost);

    return NextResponse.json({ ...newPost, _id: result.insertedId });
  } catch (error) {
    console.error("❌ POST /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to upload post", details: String(error) },
      { status: 500 }
    );
  }
}
