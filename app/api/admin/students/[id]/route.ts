
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verify admin access
    const key = request.headers.get("x-admin-key");
    const expectedKey = process.env.ADMIN_ACCESS_KEY;

    if (!expectedKey || key !== expectedKey) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // 2. Get student ID
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // 3. Connect to Supabase
    const supabase = getSupabase();

    // 4. Delete from the actual database table
    const { data, error } = await supabase
      .from("pathfinder_leads")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      console.error("Supabase delete error:", error);

      return NextResponse.json(
        {
          error: "Database deletion failed.",
          details:
            process.env.NODE_ENV === "development"
              ? error.message
              : undefined,
        },
        { status: 500 }
      );
    }

    // 5. Verify deletion
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Student not found. No record was deleted." },
        { status: 404 }
      );
    }

    // 6. Return success
    return NextResponse.json({
      success: true,
      message: "Student deleted successfully",
      deletedId: id,
    });

  } catch (error) {
    console.error("Delete API error:", error);

    return NextResponse.json(
      { error: "Unable to delete student." },
      { status: 500 }
    );
  }
}
