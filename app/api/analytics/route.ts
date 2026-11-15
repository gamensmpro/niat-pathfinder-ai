
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const key = request.headers.get("x-admin-key");

const expectedKey = process.env.ADMIN_ACCESS_KEY;

if (!expectedKey || !key || key !== expectedKey) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("pathfinder_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) throw error;

    const leads = data || [];

    const total = leads.length;
    const highIntent = leads.filter(
      x => x.lead_category === "high-intent"
    ).length;

    const cities: Record<string, number> = {};
    const concerns: Record<string, number> = {};

    leads.forEach(lead => {
      cities[lead.city] = (cities[lead.city] || 0) + 1;

      lead.interests?.forEach((interest: string) => {
        concerns[interest] = (concerns[interest] || 0) + 1;
      });
    });

    return NextResponse.json({
      success: true,
      metrics: {
        total,
        highIntent,
        mediumIntent: leads.filter(
          x => x.lead_category === "medium-intent"
        ).length,
        earlyInterest: leads.filter(
          x => x.lead_category === "early-interest"
        ).length,
        highIntentRate: total
          ? Math.round(highIntent / total * 100)
          : 0,
        cities,
        interests: concerns
      },
      leads
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to retrieve analytics." },
      { status: 500 }
    );
  }
}
