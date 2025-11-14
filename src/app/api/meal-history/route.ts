import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// =============================
// GET — Fetch History (with pagination)
// =============================
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 10);
    const skip = (page - 1) * limit;

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("cookaro");

    const total = await db.collection("mealHistory").countDocuments({ email });

    const history = await db
      .collection("mealHistory")
      .find({ email })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      page,
      limit,
      total,
      data: history,
    });
  } catch (error) {
    console.error("❌ GET history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

// =============================
// POST — Save recipe OR nutrition
// =============================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, recipe, query, nutrition } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("cookaro");

    if (recipe) {
      await db.collection("mealHistory").insertOne({
        email,
        type: "recipe",
        recipe,
        query,
        timestamp: new Date().toISOString(),
        favorite: false,
      });

      return NextResponse.json({
        success: true,
        message: "Recipe saved",
      });
    }

    if (nutrition) {
      await db.collection("mealHistory").insertOne({
        email,
        type: "nutrition",
        nutrition,
        query,
        timestamp: new Date().toISOString(),
        favorite: false,
      });

      return NextResponse.json({
        success: true,
        message: "Nutrition saved",
      });
    }

    return NextResponse.json({ error: "Nothing to save" }, { status: 400 });
  } catch (error) {
    console.error("❌ POST history error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

// =============================
// PATCH — Toggle Favorite
// =============================
export async function PATCH(req: Request) {
  try {
    const { id, favorite } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("cookaro");

    await db
      .collection("mealHistory")
      .updateOne({ _id: new ObjectId(id) }, { $set: { favorite } });

    return NextResponse.json({
      success: true,
      message: "Favorite updated",
    });
  } catch (error) {
    console.error("❌ PATCH history error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// =============================
// DELETE — Remove Single OR All History
// =============================
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const all = url.searchParams.get("all");
    const email = url.searchParams.get("email");

    const client = await clientPromise;
    const db = client.db("cookaro");

    //=========== DELETE ALL ===========
    if (all === "true" && email) {
      await db.collection("mealHistory").deleteMany({ email });
      return NextResponse.json({
        success: true,
        message: "All history cleared",
      });
    }

    //=========== DELETE ONE ===========
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await db.collection("mealHistory").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, message: "Entry deleted" });
  } catch (error) {
    console.error("❌ DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
