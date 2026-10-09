// scripts/ingest-data.ts
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import {
  EMBEDDING_MODEL,
  EMBEDDING_DIMENSIONS,
} from "../app/lib/embeddingConfig";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

// DATABASE_URL/DIRECT_URL live in .env, other secrets (GEMINI_API_KEY, etc.)
// live in .env.local - load both since this script runs outside Next.js,
// which would otherwise load them automatically.
dotenv.config({ path: path.join(projectRoot, ".env") });
dotenv.config({ path: path.join(projectRoot, ".env.local") });

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in .env");
  process.exit(1);
}

console.log("✅ Environment variables loaded successfully");

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const prisma = new PrismaClient();

/**
 * Step 1: Read the data file
 * Why: We need raw text to process into chunks
 */
function readDataFile(): string {
  const filePath = path.join(process.cwd(), "data", "portfolio-data.txt");
  return fs.readFileSync(filePath, "utf-8");
}

/**
 * Step 2: Split text into chunks
 * Why: AI models have token limits and work better with focused context
 *
 * Parameters:
 * - text: The full text to split
 * - maxChunkSize: Maximum characters per chunk (500-1000 is optimal)
 *
 * Why 800 characters?
 * - Small enough to fit within model context limits
 * - Large enough to maintain meaningful context
 * - Allows about 200 tokens, which is efficient for embedding
 */
function chunkText(text: string, maxChunkSize: number = 800): string[] {
  const chunks: string[] = [];

  // Split by paragraphs first (preserves structure)
  const paragraphs = text.split("\n\n").filter((p) => p.trim().length > 0);

  let currentChunk = "";

  for (const paragraph of paragraphs) {
    // If adding this paragraph exceeds max size, save current chunk
    if (
      currentChunk.length + paragraph.length > maxChunkSize &&
      currentChunk.length > 0
    ) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }

    // If paragraph itself is too long, split it
    if (paragraph.length > maxChunkSize) {
      // Split by sentences
      const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
      for (const sentence of sentences) {
        if (
          currentChunk.length + sentence.length > maxChunkSize &&
          currentChunk.length > 0
        ) {
          chunks.push(currentChunk.trim());
          currentChunk = "";
        }
        currentChunk += sentence + " ";
      }
    } else {
      currentChunk += paragraph + "\n\n";
    }
  }

  // Add the last chunk if it exists
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Step 3: Generate embeddings for chunks
 * Why: Embeddings capture semantic meaning, enabling semantic search
 *
 * outputDimensionality is pinned to EMBEDDING_DIMENSIONS so every vector
 * matches the vector(1536) column, regardless of the model's native size.
 */
async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];

  // Process in batches to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    console.log(
      `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}`,
    );

    const response = await gemini.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: batch,
      config: {
        outputDimensionality: EMBEDDING_DIMENSIONS,
        taskType: "RETRIEVAL_DOCUMENT",
      },
    });

    const batchEmbeddings = (response.embeddings ?? []).map((item) => {
      if (!item.values) throw new Error("Embedding response missing values");
      return item.values;
    });
    embeddings.push(...batchEmbeddings);
  }

  return embeddings;
}

/**
 * Step 4: Replace the stored chunks with the freshly embedded ones
 * Why: Chunk boundaries shift whenever the source text changes, so there's
 * no stable key to upsert against - clearing and re-inserting keeps the
 * table consistent with portfolio-data.txt on every ingest run.
 *
 * The embedding column is Unsupported("vector(1536)") in schema.prisma
 * (Prisma Client has no native vector type), so inserts go through
 * $executeRaw with an explicit ::vector cast.
 */
async function saveChunks(texts: string[], embeddings: number[][]) {
  await prisma.$transaction(async (tx) => {
    await tx.portfolioChunk.deleteMany({});

    for (let i = 0; i < texts.length; i++) {
      const id = crypto.randomUUID();
      const vectorLiteral = `[${embeddings[i].join(",")}]`;
      await tx.$executeRaw`
        INSERT INTO "PortfolioChunk" (id, content, embedding, "createdAt", "updatedAt")
        VALUES (${id}, ${texts[i]}, ${vectorLiteral}::vector, now(), now())
      `;
    }
  });
}

/**
 * Main ingestion function
 * Why: Orchestrates the entire process from reading to saving
 */
async function ingestData() {
  console.log("🚀 Starting data ingestion...");

  // Step 1: Read data
  console.log("📖 Reading data file...");
  const rawText = readDataFile();

  // Step 2: Create chunks
  console.log("✂️ Chunking text...");
  const chunks = chunkText(rawText);
  console.log(`📊 Created ${chunks.length} chunks`);

  // Step 3: Generate embeddings
  console.log("🧠 Generating embeddings...");
  const embeddings = await generateEmbeddings(chunks);

  // Step 4: Save to the database
  console.log("💾 Replacing PortfolioChunk rows in the database...");
  await saveChunks(chunks, embeddings);

  console.log(`✅ Ingestion complete! Saved ${chunks.length} chunks to PortfolioChunk`);
}

// Run the ingestion
ingestData()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
