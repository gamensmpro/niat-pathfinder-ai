
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required." },
        { status: 400 }
      );
    }

    if (
      messages.length > 30 ||
      messages.some(
        (m) =>
          !["user", "assistant"].includes(m.role) ||
          typeof m.content !== "string" ||
          m.content.length > 4000
      )
    ) {
      return NextResponse.json(
        { error: "Invalid chat messages." },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5",
      instructions: `
        You are Pathfinder AI, a friendly student career guidance assistant.

        Help students with:
        - Career guidance
        - Choosing educational streams
        - Technology and AI careers
        - Skills and learning paths
        - College and course guidance
        - Personal development

        Keep answers friendly, clear and practical.
        Ask clarifying questions when necessary.
        Never guarantee jobs, admissions or salaries.
      `,
      input: messages.map((m: {role: string; content: string}) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    return NextResponse.json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error("AI chat error:", error);

    return NextResponse.json(
      { error: "Unable to process your message." },
      { status: 500 }
    );
  }
}
