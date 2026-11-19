// app/lib/coverLetterAi.ts
// Drafts a cover letter for a specific role from the site's own
// experience/skills/certifications data. Plain-text output (not structured
// JSON like resumeAi.ts) since nothing here is written back to the DB or
// site — the admin reads, edits, and copies it themselves.
import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface CurrentResumeData {
  experience: { title: string; company: string; period: string; description: string }[];
  skills: { category: string; name: string; level: string }[];
  certifications: { name: string; issuer: string; status: string }[];
}

export interface CoverLetterRequest {
  role: string;
  company: string;
  jobDescription: string;
}

function buildPrompt(request: CoverLetterRequest, current: CurrentResumeData): string {
  return `You write a cover letter for Ayokunle Ogunfidodo, a full-stack developer, based ONLY on the background facts given below. Never invent employers, dates, metrics, or skills that aren't present in the facts.

ROLE APPLYING FOR: ${request.role}
${request.company ? `COMPANY: ${request.company}` : ""}
${request.jobDescription ? `JOB DESCRIPTION / POSTING:\n${request.jobDescription}` : ""}

BACKGROUND FACTS (experience):
${current.experience.map((e) => `- ${e.title} at ${e.company} (${e.period}): ${e.description}`).join("\n")}

BACKGROUND FACTS (skills):
${current.skills.map((s) => `- ${s.name} (${s.category}, ${s.level})`).join("\n")}

BACKGROUND FACTS (certifications):
${current.certifications.map((c) => `- ${c.name} — ${c.issuer} (${c.status})`).join("\n")}

Write a concise, specific cover letter (3-4 short paragraphs, no more than ~350 words) that connects his actual experience to this specific role${request.company ? ` at ${request.company}` : ""}. Open by naming the role. Close with a brief call to action. Plain prose only — no markdown, no placeholder brackets like "[Hiring Manager]", no headers or bullet lists. Sign off with "Ayokunle Ogunfidodo".`;
}

export async function generateCoverLetter(
  request: CoverLetterRequest,
  current: CurrentResumeData,
): Promise<string> {
  const prompt = buildPrompt(request, current);

  try {
    console.log("📝 Cover letter: attempting Gemini...");
    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: { temperature: 0.4, maxOutputTokens: 1024 },
    });
    const text = response.text?.trim();
    if (!text) throw new Error("Empty response");
    console.log("✅ Gemini produced a cover letter draft");
    return text;
  } catch (error: any) {
    console.log(`❌ Gemini failed: ${error.message || "Unknown error"}`);
  }

  try {
    console.log("📝 Cover letter: attempting Groq (fallback)...");
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_completion_tokens: 1024,
    });
    const text = response.choices[0].message.content?.trim();
    if (!text) throw new Error("Empty response");
    console.log("✅ Groq produced a cover letter draft");
    return text;
  } catch (error: any) {
    console.log(`❌ Groq failed: ${error.message || "Unknown error"}`);
  }

  throw new Error(
    "Could not generate a cover letter draft — both Gemini and Groq failed or returned empty output.",
  );
}
