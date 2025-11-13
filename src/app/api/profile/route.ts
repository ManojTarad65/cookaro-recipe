import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      console.error("❌ Missing email parameter");
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log("📩 Fetching profile for:", email);

    const client = await clientPromise;
    const db = client.db("cookaro"); // ✅ Confirm this DB name
    const user = await db.collection("profiles").findOne({ email });

    if (!user) {
      console.warn(`⚠️ No user found for ${email}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("✅ User found:", user.email);

    return NextResponse.json(user, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error fetching profile:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, age, gender, height, weight, activityLevel } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("cookaro"); // ✅ Make sure DB name is correct
    const collection = db.collection("profiles");

    // ✅ Check if profile exists
    const existingProfile = await collection.findOne({ email });

    if (existingProfile) {
      // Update profile
      await collection.updateOne(
        { email },
        {
          $set: {
            age,
            gender,
            height,
            weight,
            activityLevel,
            updatedAt: new Date(),
          },
        }
      );

      console.log("✅ Profile updated for:", email);
      return NextResponse.json(
        { message: "Profile updated successfully!" },
        { status: 200 }
      );
    } else {
      // Create new profile
      await collection.insertOne({
        email,
        age,
        gender,
        height,
        weight,
        activityLevel,
        createdAt: new Date(),
      });

      console.log("🆕 Profile created for:", email);
      return NextResponse.json(
        { message: "Profile created successfully!" },
        { status: 201 }
      );
    }
  } catch (err: any) {
    console.error("❌ Error saving profile:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
