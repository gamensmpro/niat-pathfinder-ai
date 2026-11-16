
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI service is not configured." },
        { status: 503 }
      );
    }

    const { messages } = await request.json();

    if (
      !Array.isArray(messages) ||
      messages.length === 0 ||
      messages.length > 30 ||
      messages.some(
        (item) =>
          !["user", "assistant"].includes(item.role) ||
          typeof item.content !== "string" ||
          item.content.length > 4000
      )
    ) {
      return NextResponse.json(
        { error: "Invalid chat messages." },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are NIAT Pathfinder AI, an education information assistant.

Help students and parents understand:
- NIAT programs
- Admissions
- Curriculum
- Career opportunities
- Student development
- Parent concerns

Be friendly, professional and concise.

Never invent:
- Admission guarantees
- Placement percentages
- Salary packages
- Fees or scholarships
- University affiliations
- Program guarantees

If information is unavailable, say so honestly and recommend speaking with an authorized NIAT counsellor.

Do not claim to be a human counsellor.
          `
        },
        ...messages.map((item: {
          role: "user" | "assistant";
          content: string;
        }) => ({
          role: item.role,
          content: item.content
        }))
      ],
      temperature: 0.5,
      max_tokens: 500
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });

  
} catch (error: unknown) {
  console.error("AI chat error:", error);

  const message =
    error instanceof Error
      ? error.message
      : "Unknown AI service error";

  return NextResponse.json(
    {
      error: "AI chat request failed.",
      details:
        process.env.NODE_ENV === "development"
          ? message
          : undefined
    },
    { status: 500 }
  );
}
}
