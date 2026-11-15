
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

const schema = z.object({
  studentName: z.string().trim().min(1).max(60),
  email: z.string().email().max(150),
  phone: z.string().max(20).optional(),
  city: z.string().trim().min(1).max(80),
  stream: z.string().max(30),
  interests: z.array(z.string()).min(1).max(5),
  experience: z.string(),
  favoriteSubject: z.string(),
  careerGoal: z.string(),
  language: z.string(),
  consent: z.literal(true),
  guardianConsent: z.boolean(),
  report: z.record(z.string(), z.unknown()).optional()
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Valid details and consent are required." },
        { status: 400 }
      );
    }

    const lead = parsed.data;

    const score =
      (lead.interests.length >= 2 ? 20 : 10) +
      (lead.careerGoal ? 20 : 0) +
      (lead.city ? 10 : 0) +
      (lead.phone ? 15 : 0) +
      (lead.email ? 15 : 0) +
      (lead.report ? 20 : 0);

    const category =
      score >= 80 ? "high-intent" :
      score >= 50 ? "medium-intent" :
      "early-interest";

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("pathfinder_leads")
      .insert({
        student_name: lead.studentName,
        email: lead.email,
        phone: lead.phone || null,
        city: lead.city,
        stream: lead.stream,
        interests: lead.interests,
        experience: lead.experience,
        favorite_subject: lead.favoriteSubject,
        career_goal: lead.careerGoal,
        language: lead.language,
        consent: lead.consent,
        guardian_consent: lead.guardianConsent,
        lead_score: score,
        lead_category: category,
        report: lead.report || null
      })
      .select("id, lead_score, lead_category")
      .single();

    if (error) {
      throw error;
    }

    // Send the lead to n8n after successful database insertion.
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        await fetch(process.env.N8N_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            event: "new_pathfinder_lead",
            lead_id: data.id,
            student_name: lead.studentName,
            email: lead.email,
            phone: lead.phone || null,
            city: lead.city,
            interests: lead.interests,
            career_goal: lead.careerGoal,
            language: lead.language,
            lead_score: score,
            lead_category: category
          }),
          signal: AbortSignal.timeout(8000)
        });
      } catch (automationError) {
        console.error("n8n notification failed:", automationError);
      }
    }

    return NextResponse.json({
      success: true,
      leadId: data.id,
      score,
      category
    });

  } catch (error) {
    console.error("Lead submission error:", error);

    return NextResponse.json(
      { error: "Unable to save your enquiry." },
      { status: 500 }
    );
  }
}
