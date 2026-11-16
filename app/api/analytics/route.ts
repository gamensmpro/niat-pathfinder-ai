
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // 1. Verify admin access
    const key = request.headers.get("x-admin-key");
    const expectedKey = process.env.ADMIN_ACCESS_KEY;

    if (!expectedKey || !key || key !== expectedKey) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // 2. Verify Supabase configuration
    if (
      !process.env.SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        { error: "Supabase is not configured." },
        { status: 503 }
      );
    }

    // 3. Fetch leads
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("pathfinder_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("Supabase analytics error:", error);

      return NextResponse.json(
        {
          error: "Unable to retrieve student leads.",
          details:
            process.env.NODE_ENV === "development"
              ? error.message
              : undefined
        },
        { status: 500 }
      );
    }

    const leads = data || [];

    // 4. Calculate lead metrics
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

    const highIntentRate = total > 0
      ? Math.round((highIntent / total) * 100)
      : 0;

    // 5. Calculate city analytics
    const cities: Record<string, number> = {};

    // 6. Calculate interest analytics
    const interests: Record<string, number> = {};

    leads.forEach((lead) => {
      const city = lead.city?.trim() || "Unknown";

      cities[city] = (cities[city] || 0) + 1;

      const studentInterests = Array.isArray(lead.interests)
        ? lead.interests
        : [];

      studentInterests.forEach((interest: string) => {
        const name = interest.trim();

        if (name) {
          interests[name] = (interests[name] || 0) + 1;
        }
      });
    });

    // 7. Return dashboard data
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
          cities
        },

        leads
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate"
        }
      }
    );

  } catch (error: unknown) {
    console.error("Analytics API error:", error);

    return NextResponse.json(
      {
        error: "Unable to retrieve analytics.",
        details:
          process.env.NODE_ENV === "development" &&
          error instanceof Error
            ? error.message
            : undefined
      },
      { status: 500 }
    );
  }
}
