
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const key = req.headers.get("x-admin-key");

    if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const student = await req.json();

    if (
      !student.studentName?.trim() ||
      !student.email?.trim() ||
      student.consent !== true ||
      !Array.isArray(student.interests)
    ) {
      return NextResponse.json(
        { error: "Valid name, email, interests and consent are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("students")
      .insert({
        student_name: student.studentName.trim(),
        email: student.email.trim(),
        phone: student.phone || null,
        city: student.city || null,
        stream: student.stream,
        interests: student.interests,
        experience: student.experience,
        favorite_subject: student.favoriteSubject || null,
        career_goal: student.careerGoal || null,
        language: student.language,
        guardian_consent: student.guardianConsent,
        consent: student.consent,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Student added successfully",
      student: data,
    }, { status: 201 });

  } catch (error) {
    console.error("Add student error:", error);

    return NextResponse.json(
      { error: "Unable to add student to Supabase." },
      { status: 500 }
    );
  }
}
