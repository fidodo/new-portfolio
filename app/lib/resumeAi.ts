// app/lib/resumeAi.ts
// Structured-output generation for the AI resume updater: given the current
// Experience/Skill/Certification rows and admin-pasted free text, ask an LLM
// to propose changes as JSON. Unlike the chat route's failover, there is no
// silent local fallback here — if both providers fail or the output doesn't
// validate, the caller gets an error rather than a guess, since this feeds a
// human-in-the-loop approval queue, not a live answer.
import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export type TargetType = "experience" | "skill" | "certification";
export type ChangeType = "create" | "update";

export interface ProposedChange {
  targetType: TargetType;
  targetId: string | null;
  changeType: ChangeType;
  proposedData: Record<string, unknown>;
  previousData: Record<string, unknown> | null;
}

interface CurrentResumeData {
  experience: { id: string; title: string; company: string; period: string; description: string }[];
  skills: { id: string; category: string; name: string; level: string; icon: string; status: string | null }[];
  certifications: { id: string; name: string; issuer: string; status: string; issuedDate: Date | null; url: string | null }[];
}

const TARGET_TYPES: TargetType[] = ["experience", "skill", "certification"];
const CHANGE_TYPES: ChangeType[] = ["create", "update"];

const REQUIRED_FIELDS: Record<TargetType, string[]> = {
  experience: ["title", "company", "period", "description"],
  skill: ["category", "name", "level", "icon"],
  certification: ["name", "issuer", "status"],
};

function buildPrompt(sourceText: string, current: CurrentResumeData): string {
  return `You help keep a software engineer's portfolio site accurate. You are given the CURRENT resume data already on the site, and NEW information the person just pasted (e.g. a LinkedIn export snippet, a new role, a new certification, a notable post).

Propose only changes that are clearly supported by the NEW information. Never invent facts, dates, companies, or metrics that aren't present in the input. If nothing in the input warrants a change, return an empty "changes" array.

Respond with ONLY a JSON object of this exact shape, no prose, no markdown fences:
{
  "changes": [
    {
      "targetType": "experience" | "skill" | "certification",
      "targetId": "<id of the existing row to update, or null if this is a new entry>",
      "changeType": "create" | "update",
      "proposedData": { ...fields for that type, see below... },
      "previousData": { ...the current fields of that row if updating, or null if creating... }
    }
  ]
}

Fields per targetType.proposedData:
- experience: { "title": string, "company": string, "period": string, "description": string }
- skill: { "category": string, "name": string, "level": "Beginner" | "Intermediate" | "Advanced", "icon": a Heroicons 24-outline component name like "CodeBracketIcon" (use "SparklesIcon" if unsure), "status": string | null }
- certification: { "name": string, "issuer": string, "status": string, "issuedDate": "YYYY-MM-DD" | null, "url": string | null }

CURRENT RESUME DATA:
${JSON.stringify(current)}

NEW INFORMATION PASTED BY THE USER:
"""
${sourceText}
"""`;
}

function extractJson(raw: string): unknown {
  const trimmed = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  return JSON.parse(trimmed);
}

function validateChanges(parsed: unknown): ProposedChange[] {
  if (!parsed || typeof parsed !== "object" || !Array.isArray((parsed as any).changes)) {
    throw new Error("Model output was not a { changes: [...] } object");
  }

  const valid: ProposedChange[] = [];
  for (const item of (parsed as any).changes) {
    if (!item || typeof item !== "object") continue;
    const { targetType, targetId, changeType, proposedData, previousData } = item;

    if (!TARGET_TYPES.includes(targetType)) continue;
    if (!CHANGE_TYPES.includes(changeType)) continue;
    if (changeType === "update" && typeof targetId !== "string") continue;
    if (!proposedData || typeof proposedData !== "object") continue;

    const missingRequired = REQUIRED_FIELDS[targetType as TargetType].some(
      (field) => !(field in proposedData) || proposedData[field] === "",
    );
    if (missingRequired) continue;

    valid.push({
      targetType,
      targetId: typeof targetId === "string" ? targetId : null,
      changeType,
      proposedData,
      previousData: previousData && typeof previousData === "object" ? previousData : null,
    });
  }
  return valid;
}

export async function generateProposedChanges(
  sourceText: string,
  current: CurrentResumeData,
): Promise<ProposedChange[]> {
  const prompt = buildPrompt(sourceText, current);

  try {
    console.log("📝 Resume updater: attempting Gemini...");
    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        temperature: 0.2,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    });
    const text = response.text?.trim();
    if (!text) throw new Error("Empty response");
    const changes = validateChanges(extractJson(text));
    console.log(`✅ Gemini produced ${changes.length} valid change(s)`);
    return changes;
  } catch (error: any) {
    console.log(`❌ Gemini failed: ${error.message || "Unknown error"}`);
  }

  try {
    console.log("📝 Resume updater: attempting Groq (fallback)...");
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_completion_tokens: 2048,
      response_format: { type: "json_object" },
    });
    const text = response.choices[0].message.content?.trim();
    if (!text) throw new Error("Empty response");
    const changes = validateChanges(extractJson(text));
    console.log(`✅ Groq produced ${changes.length} valid change(s)`);
    return changes;
  } catch (error: any) {
    console.log(`❌ Groq failed: ${error.message || "Unknown error"}`);
  }

  // Deliberately no local fallback: a wrong guess here would feed bad data
  // into a human review queue, so the caller surfaces an error instead.
  throw new Error(
    "Could not generate proposed resume changes — both Gemini and Groq failed or returned invalid output.",
  );
}
