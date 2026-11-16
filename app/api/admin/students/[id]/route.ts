
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isAdmin(request: NextRequest) {
  const key = request.headers.get("x-admin-key");
  const expectedKey = process.env.ADMIN_ACCESS_KEY;

  return Boolean(expectedKey && key === expectedKey);
}

// UPDATE STUDENT
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required." },
        { status: 400 }
      );
    }

    const student = await request.json();

    if (
      !student.studentName?.trim() ||
      !student.email?.trim() ||
      student.consent !== true ||
      !Array.isArray(student.interests)
    ) {
      return NextResponse.json(
        {
          error: "Valid name, email, interests and consent are required."
        },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("pathfinder_leads")
      .update({
        student_name: student.studentName.trim(),
        email: student.email.trim(),
        phone: student.phone?.trim() || null,
        city: student.city?.trim() || null,
        stream: student.stream || null,
        interests: student.interests,
        experience: student.experience || null,
        favorite_subject: student.favoriteSubject || null,
        career_goal: student.careerGoal || null,
        language: student.language || "English",
        guardian_consent: student.guardianConsent === true,
        consent: student.consent,
      })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Update student Supabase error:", error);

      return NextResponse.json(
        {
          error: "Unable to update student.",
          details:
            process.env.NODE_ENV === "development"
              ? error.message
              : undefined,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student updated successfully.",
      student: data,
    });

  } catch (error) {
    console.error("Update student error:", error);

    return NextResponse.json(
      { error: "Unable to update student." },
      { status: 500 }
    );
  }
}

// DELETE STUDENT
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("pathfinder_leads")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      console.error("Delete student Supabase error:", error);

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

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student deleted successfully.",
      deletedId: id,
    });

  } catch (error) {
    console.error("Delete student error:", error);

    return NextResponse.json(
      { error: "Unable to delete student." },
      { status: 500 }
    );
  }
}
