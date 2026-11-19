// app/api/admin/resume-changes/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "../../../lib/adminSession";
import { generateProposedChanges } from "../../../lib/resumeAi";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const status = new URL(request.url).searchParams.get("status");
    const changes = await prisma.pendingResumeChange.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(changes);
  } catch (error) {
    console.error("Error fetching pending resume changes:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending changes" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { sourceText } = await request.json();
    if (!sourceText || typeof sourceText !== "string" || !sourceText.trim()) {
      return NextResponse.json(
        { error: "sourceText is required" },
        { status: 400 },
      );
    }

    const [experience, skills, certifications] = await Promise.all([
      prisma.experienceEntry.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.skillEntry.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.certificationEntry.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    let proposals;
    try {
      proposals = await generateProposedChanges(sourceText, {
        experience,
        skills,
        certifications,
      });
    } catch (error: any) {
      console.error("Resume change generation failed:", error);
      return NextResponse.json(
        { error: error.message || "Failed to generate proposed changes" },
        { status: 502 },
      );
    }

    if (proposals.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const sourceNote =
      sourceText.trim().slice(0, 200) + (sourceText.length > 200 ? "…" : "");

    const created = await prisma.$transaction(
      proposals.map((p) =>
        prisma.pendingResumeChange.create({
          data: {
            targetType: p.targetType,
            targetId: p.targetId,
            changeType: p.changeType,
            proposedData: p.proposedData as any,
            previousData: p.previousData as any,
            sourceNote,
          },
        }),
      ),
    );

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating pending resume changes:", error);
    return NextResponse.json(
      { error: "Failed to generate proposed changes" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
