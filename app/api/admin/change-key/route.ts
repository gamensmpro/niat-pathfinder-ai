
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { currentKey, newKey } = await request.json();

    const configuredKey = process.env.ADMIN_ACCESS_KEY;

    if (!configuredKey) {
      return NextResponse.json(
        { error: "Admin authentication is not configured." },
        { status: 503 }
      );
    }

    if (!currentKey || !newKey) {
      return NextResponse.json(
        { error: "Both keys are required." },
        { status: 400 }
      );
    }

    if (currentKey !== configuredKey) {
      return NextResponse.json(
        { error: "Current admin key is incorrect." },
        { status: 401 }
      );
    }

    if (
      typeof newKey !== "string" ||
      newKey.length < 16 ||
      newKey.length > 128
    ) {
      return NextResponse.json(
        { error: "New key must be between 16 and 128 characters." },
        { status: 400 }
      );
    }

    if (newKey === currentKey) {
      return NextResponse.json(
        { error: "New key must be different." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const adminKeyHash = await bcrypt.hash(newKey, 12);

    const { error } = await supabase
      .from("admin_settings")
      .upsert({
        id: 1,
        admin_key_hash: adminKeyHash,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "New admin key saved. Update ADMIN_ACCESS_KEY in your deployment environment before using it."
    });

  } catch (error) {
    console.error("Admin key update error:", error);

    return NextResponse.json(
      { error: "Unable to update admin key." },
      { status: 500 }
    );
  }
}
