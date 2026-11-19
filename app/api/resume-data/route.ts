// app/api/resume-data/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET() {
  try {
    const [experience, skillRows, certifications] = await Promise.all([
      prisma.experienceEntry.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.skillEntry.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.certificationEntry.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    const skills: Record<string, typeof skillRows> = {};
    for (const skill of skillRows) {
      (skills[skill.category] ??= []).push(skill);
    }

    return NextResponse.json({ experience, skills, certifications });
  } catch (error) {
    console.error("Error fetching resume data:", error);
    return NextResponse.json(
      { experience: [], skills: {}, certifications: [] },
      { status: 200 },
    );
  }
}
