// scripts/ingest-data.ts
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables - EXPLICITLY from project root
const envPath = path.join(__dirname, "..", ".env.local");
console.log(`📁 Looking for .env.local at: ${envPath}`);

// Check if file exists
if (!fs.existsSync(envPath)) {
  console.error("❌ .env.local file not found!");
  console.error("Please create .env.local in the project root with:");
  console.error("OPENAI_API_KEY=your_api_key_here");
  process.exit(1);
}

// Load the environment variables
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("❌ Error loading .env.local:", result.error);
  process.exit(1);
}

// Verify the API key is loaded
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY not found in .env.local");
  console.error("Please add: OPENAI_API_KEY=your_api_key_here");
  process.exit(1);
}

console.log("✅ Environment variables loaded successfully");
console.log(
  `🔑 API Key found: ${process.env.OPENAI_API_KEY.substring(0, 10)}...`,
);

// Load environment variables
dotenv.config({ path: ".env.local" });

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define types for our data structure
interface Chunk {
  id: string;
  text: string;
  embedding: number[];
}

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
 * We use text-embedding-ada-002 because:
 * - Cost-effective: ~$0.0001 per 1000 tokens
 * - Fast: Low latency
 * - Good quality: 1536-dimensional vectors capture nuance well
 * - Easy to use: Standard embedding model for most use cases
 */
async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];

  // Process in batches to avoid rate limits
  const batchSize = 20;
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    console.log(
      `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}`,
    );

    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: batch,
    });

    // Extract embeddings from response
    const batchEmbeddings = response.data.map((item) => item.embedding);
    embeddings.push(...batchEmbeddings);
  }

  return embeddings;
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

  // Step 4: Combine chunks and embeddings
  console.log("💾 Combining data...");
  const data: Chunk[] = chunks.map((text, index) => ({
    id: `chunk_${index}`,
    text: text,
    embedding: embeddings[index],
  }));

  // Step 5: Save to JSON file
  console.log("💾 Saving embeddings to file...");
  const outputPath = path.join(process.cwd(), "data", "embeddings.json");
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log(
    `✅ Ingestion complete! Saved ${data.length} chunks to ${outputPath}`,
  );
}

// Run the ingestion
ingestData().catch(console.error);
