// app/api/admin/resume-changes/[id]/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/adminSession";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

function pick(data: any, fields: string[]) {
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    if (field in data) out[field] = data[field];
  }
  return out;
}

function parseDate(value: unknown): Date | null {
  if (!value || typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function applyChange(
  targetType: string,
  changeType: string,
  targetId: string | null,
  proposedData: any,
) {
  switch (targetType) {
    case "experience": {
      const fields = pick(proposedData, [
        "title",
        "company",
        "period",
        "description",
      ]);
      if (changeType === "create") {
        const sortOrder = await prisma.experienceEntry.count();
        return prisma.experienceEntry.create({
          data: { ...fields, sortOrder } as any,
        });
      }
      return prisma.experienceEntry.update({
        where: { id: targetId! },
        data: fields,
      });
    }
    case "skill": {
      const fields = pick(proposedData, [
        "category",
        "name",
        "level",
        "icon",
        "status",
      ]);
      if (changeType === "create") {
        const sortOrder = await prisma.skillEntry.count();
        return prisma.skillEntry.create({
          data: { ...fields, sortOrder } as any,
        });
      }
      return prisma.skillEntry.update({
        where: { id: targetId! },
        data: fields,
      });
    }
    case "certification": {
      const fields = pick(proposedData, ["name", "issuer", "status", "url"]);
      if ("issuedDate" in proposedData) {
        (fields as any).issuedDate = parseDate(proposedData.issuedDate);
      }
      if (changeType === "create") {
        const sortOrder = await prisma.certificationEntry.count();
        return prisma.certificationEntry.create({
          data: { ...fields, sortOrder } as any,
        });
      }
      return prisma.certificationEntry.update({
        where: { id: targetId! },
        data: fields,
      });
    }
    default:
      throw new Error(`Unknown targetType: ${targetType}`);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    const { action } = await request.json();

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "action must be 'approve' or 'reject'" },
        { status: 400 },
      );
    }

    const change = await prisma.pendingResumeChange.findUnique({
      where: { id },
    });
    if (!change) {
      return NextResponse.json({ error: "Change not found" }, { status: 404 });
    }
    if (change.status !== "pending") {
      return NextResponse.json(
        { error: `Change already ${change.status}` },
        { status: 409 },
      );
    }

    if (action === "reject") {
      const updated = await prisma.pendingResumeChange.update({
        where: { id },
        data: { status: "rejected", reviewedAt: new Date() },
      });
      return NextResponse.json(updated);
    }

    // Approve: apply to the real table, then mark the change applied.
    await applyChange(
      change.targetType,
      change.changeType,
      change.targetId,
      change.proposedData,
    );
    const updated = await prisma.pendingResumeChange.update({
      where: { id },
      data: { status: "approved", reviewedAt: new Date() },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error applying resume change decision:", error);
    return NextResponse.json(
      { error: "Failed to apply decision" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
