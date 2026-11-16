
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Verify admin access
    const key = req.headers.get("x-admin-key");
    const expectedKey = process.env.ADMIN_ACCESS_KEY;

    if (!expectedKey || key !== expectedKey) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const student = await req.json();

    // Validate required fields
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

    // Insert into the same table used by analytics
    const { data, error } = await supabase
      .from("pathfinder_leads")
      .insert({
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
      .select()
      .single();

    if (error) {
      console.error("Add student Supabase error:", error);

      return NextResponse.json(
        {
          error: "Unable to add student.",
          details:
            process.env.NODE_ENV === "development"
              ? error.message
              : undefined,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Student added successfully",
        student: data,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Add student error:", error);

    return NextResponse.json(
      { error: "Unable to add student to Supabase." },
      { status: 500 }
    );
  }
}
