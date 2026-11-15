
import { NextResponse } from "next/server";
import { z } from "zod";
import { openai } from "@/lib/openai";

export const runtime = "nodejs";

const schema = z.object({
  studentName: z.string().trim().min(1).max(60),
  stream: z.string().max(30),
  interests: z.array(z.string().max(60)).min(1).max(5),
  experience: z.string().max(60),
  favoriteSubject: z.string().max(60),
  careerGoal: z.string().max(100),
  language: z.enum([
    "English", "Telugu", "Hindi",
    "Tamil", "Kannada", "Malayalam"
  ])
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI service is not configured" },
        { status: 503 }
      );
    }

    const parsed = schema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please provide valid assessment details." },
        { status: 400 }
      );
    }

    const student = parsed.data;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are PathFinder AI, a responsible career discovery assistant
for Indian Class 12 students.

Generate practical career exploration guidance based on the
student's interests, academic stream and experience.

Return valid JSON with exactly these fields:
{
  "introduction": "string",
  "careerPaths": [
    {
      "title": "string",
      "description": "string",
      "skills": ["string"],
      "suitability": "string"
    }
  ],
  "recommendedSkills": ["string"],
  "beginnerProject": "string",
  "projectDescription": "string",
  "roadmap": [
    {
      "period": "Month 1",
      "goal": "string",
      "activities": ["string"]
    }
  ],
  "nextSteps": ["string"],
  "realityCheck": "string"
}

Rules:
- Return 3 relevant career paths.
- Return 5 recommended skills.
- Return 3 roadmap stages covering 90 days.
- Keep projects achievable for beginners.
- Translate the entire response into the requested language.
- Be encouraging but realistic.
- Never guarantee employment, salary, admission or placement.
- Do not claim that NIAT guarantees any particular outcome.
- Explain that recommendations are exploratory, not an aptitude test.
- Do not assume that every career is suitable for every stream.
- Mention prerequisites where relevant.
- Do not fabricate NIAT student achievements or statistics.
`
        },
        {
          role: "user",
          content: JSON.stringify({
            student: student.studentName,
            academicStream: student.stream,
            interests: student.interests,
            experience: student.experience,
            favoriteSubject: student.favoriteSubject,
            careerGoal: student.careerGoal,
            responseLanguage: student.language
          })
        }
      ]
    });

    const content =
      response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Empty AI response");
    }

    const report = JSON.parse(content);

    return NextResponse.json({
      success: true,
      report
    });

  } catch (error) {
    console.error("Career generation error:", error);

    return NextResponse.json(
      { error: "Unable to generate your report. Please try again." },
      { status: 500 }
    );
  }
}
