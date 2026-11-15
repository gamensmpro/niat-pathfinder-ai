
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // 1. Admin authentication
  const key = request.headers.get("x-admin-key");
  const expectedKey = process.env.ADMIN_ACCESS_KEY;

  if (!expectedKey || !key || key !== expectedKey) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // 2. Connect to Supabase
    const supabase = getSupabase();

    // 3. Fetch leads
    const { data, error } = await supabase
      .from("pathfinder_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }

    const leads = data || [];

    // 4. Calculate metrics
    const total = leads.length;

    const highIntent = leads.filter(
      (x) => x.lead_category === "high-intent"
    ).length;

    const mediumIntent = leads.filter(
      (x) => x.lead_category === "medium-intent"
    ).length;

    const earlyInterest = leads.filter(
      (x) => x.lead_category === "early-interest"
    ).length;

    // 5. City statistics
    const cities: Record<string, number> = {};
    const concerns: Record<string, number> = {};

    leads.forEach((lead) => {
      const city = lead.city || "Unknown";

      cities[city] = (cities[city] || 0) + 1;

      (Array.isArray(lead.interests) ? lead.interests : [])
        .forEach((interest: string) => {
          concerns[interest] = (concerns[interest] || 0) + 1;
        });
    });

    // 6. Return dashboard data
    return NextResponse.json({
      success: true,
      metrics: {
        total,
        highIntent,
        mediumIntent,
        earlyInterest,
        highIntentRate: total
          ? Math.round((highIntent / total) * 100)
          : 0,
        cities,
        interests: concerns
      },
      leads
    });

  } catch (error) {
    console.error("Analytics API error:", error);

    return NextResponse.json(
      {
        error: "Unable to retrieve analytics."
      },
      { status: 500 }
    );
  }
}
