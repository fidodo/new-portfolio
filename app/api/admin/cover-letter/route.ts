// app/api/admin/cover-letter/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "../../../lib/adminSession";
import { generateCoverLetter } from "../../../lib/coverLetterAi";
import { fetchJobPostingText } from "../../../lib/fetchJobPosting";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { role, company, jobUrl, jobDescription } = await request.json();
    if (!role || typeof role !== "string" || !role.trim()) {
      return NextResponse.json({ error: "role is required" }, { status: 400 });
    }

    const manualDescription =
      typeof jobDescription === "string" ? jobDescription.trim() : "";
    let combinedDescription = manualDescription;
    let jobUrlWarning: string | undefined;

    if (typeof jobUrl === "string" && jobUrl.trim()) {
      try {
        const fetchedText = await fetchJobPostingText(jobUrl.trim());
        combinedDescription = manualDescription
          ? `${fetchedText}\n\n---\n\nADDITIONAL NOTES FROM THE ADMIN:\n${manualDescription}`
          : fetchedText;
      } catch (error: any) {
        console.error("Job posting fetch failed:", error);
        jobUrlWarning =
          error.message ||
          "Couldn't read that job posting URL — generated from the role/description only.";
      }
    }

    const [experience, skills, certifications] = await Promise.all([
      prisma.experienceEntry.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.skillEntry.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.certificationEntry.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    let letter: string;
    try {
      letter = await generateCoverLetter(
        {
          role: role.trim(),
          company: typeof company === "string" ? company.trim() : "",
          jobDescription: combinedDescription,
        },
        { experience, skills, certifications },
      );
    } catch (error: any) {
      console.error("Cover letter generation failed:", error);
      return NextResponse.json(
        { error: error.message || "Failed to generate cover letter" },
        { status: 502 },
      );
    }

    return NextResponse.json({ letter, jobUrlWarning });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
