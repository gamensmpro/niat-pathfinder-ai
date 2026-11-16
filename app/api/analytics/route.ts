
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const key = request.headers.get("x-admin-key");
  const expectedKey = process.env.ADMIN_ACCESS_KEY;

  if (!expectedKey || !key || key !== expectedKey) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    if (
      !process.env.SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        { error: "Supabase is not configured." },
        { status: 503 }
      );
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("pathfinder_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("Supabase query error:", error);

      return NextResponse.json(
        {
          error: "Unable to retrieve leads from database.",
          details:
            process.env.NODE_ENV === "development"
              ? error.message
              : undefined,
        },
        { status: 500 }
      );
    }

    const leads = data || [];
    const total = leads.length;

    const highIntent = leads.filter(
      (lead) => lead.lead_category === "high-intent"
    ).length;

    const mediumIntent = leads.filter(
      (lead) => lead.lead_category === "medium-intent"
    ).length;

    const earlyInterest = leads.filter(
      (lead) => lead.lead_category === "early-interest"
    ).length;

    const highIntentRate = total
      ? Math.round((highIntent / total) * 100)
      : 0;

    const cities: Record<string, number> = {};
    const interests: Record<string, number> = {};

    leads.forEach((lead) => {
      const city = lead.city || "Unknown";

      cities[city] = (cities[city] || 0) + 1;

      const studentInterests = Array.isArray(lead.interests)
        ? lead.interests
        : [];

      studentInterests.forEach((interest: string) => {
        interests[interest] = (interests[interest] || 0) + 1;
      });
    });

    return NextResponse.json(
      {
        success: true,

        metrics: {
          total,
          highIntent,
          highIntentRate,
          mediumIntent,
          earlyInterest,
          interests,
          cities,
        },

        leads,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );

  } catch (error) {
    console.error("Analytics API error:", error);

    return NextResponse.json(
      {
        error: "Unable to retrieve analytics.",
        details:
          process.env.NODE_ENV === "development" &&
          error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
