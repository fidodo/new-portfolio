import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const results: any = {
    env: {
      DATABASE_URL_exists: !!process.env.DATABASE_URL,
      DATABASE_URL_prefix: process.env.DATABASE_URL?.substring(0, 50),
      hasPooler: process.env.DATABASE_URL?.includes("-pooler"),
      hasSSL: process.env.DATABASE_URL?.includes("sslmode"),
    },
    connection: {},
    tables: {},
  };

  // Try to connect and query
  try {
    const prisma = new PrismaClient();

    // Test connection
    await prisma.$connect();
    results.connection.status = "connected";

    // Check BlogPost table
    try {
      const blogCount = await prisma.blogPost.count();
      results.tables.blogPost = { exists: true, count: blogCount };
    } catch (e: any) {
      results.tables.blogPost = { exists: false, error: e.message };
    }

    // Check ContactMessage table
    try {
      const contactCount = await prisma.contactMessage.count();
      results.tables.contactMessage = { exists: true, count: contactCount };
    } catch (e: any) {
      results.tables.contactMessage = { exists: false, error: e.message };
    }

    await prisma.$disconnect();
  } catch (error: any) {
    results.connection.status = "failed";
    results.connection.error = error.message;
  }

  return NextResponse.json(results);
}
