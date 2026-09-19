// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

// OpenAI is only used for question embeddings; chat answers come from
// Gemini, with Groq as a backup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Type for our data chunks
interface Chunk {
  id: string;
  text: string;
  embedding: number[];
}
console.log("🔧 Chat API initialized with OpenAI, Gemini and Groq clients");
// Comprehensive mock data
const MOCK_CHUNKS: Chunk[] = [
  {
    id: "chunk_0",
    text: "Ayokunle Ogunfidodo is a Full-Stack Software Engineer with 5+ years experience building React, Next.js, and Node.js platforms. He worked at STR Global Oy from 2021-2026 building real-time operational dashboards. He has an MSc in Human-Technology Interaction and focuses on interfaces that are fast, accessible, and genuinely usable.",
    embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
  },
  {
    id: "chunk_1",
    text: "Frontend Skills: React (Advanced), Next.js (Advanced), TypeScript (Advanced), Tailwind CSS (Advanced), Astro, Vite, GSAP, SCSS, JavaScript. Backend Skills: Node.js (Intermediate), GraphQL (Intermediate), PostgreSQL (Intermediate), MongoDB (Intermediate), Firebase (Intermediate), Express.js (Intermediate), Prisma (Intermediate), Strapi (Intermediate).",
    embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
  },
  {
    id: "chunk_2",
    text: "AI/ML Skills: OpenAI API (Intermediate), Prompt Engineering (Intermediate), Hugging Face (Intermediate), LangChain (Intermediate), LLMOps (Intermediate). Ayokunle is actively building AI skills through DataCamp's Associate AI Engineer for Developers track.",
    embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
  },
  {
    id: "chunk_3",
    text: "Projects: Renewal Guard (Next.js, Tailwind CSS - license renewal tracker), Spending Tracker App (React, PostgreSQL - personal finance), AI Resume Assistant (Gemini API - chatbot about background), E-commerce Store (Next.js, MongoDB - full-stack CMS), AlhmanEdu Green Fields (React, Strapi - blog platform), Portfolio Website (Astro, Tailwind CSS).",
    embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
  },
  {
    id: "chunk_4",
    text: "Experience: STR Global Oy (2021-2026) - Full Stack Web Developer building OMS and WMS applications, improving operational efficiency and user experience. Kasvuhuoneilmiö × AhlmanEdu (2026) - Innovation Program Participant. Freelance (2018-Present) - Web Developer and UI/UX Designer.",
    embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
  },
  {
    id: "chunk_5",
    text: "Education: MSc in Human-Technology Interaction with focus on usability, accessibility, and user-centered design principles. Currently expanding into AI engineering through DataCamp's Associate AI Engineer for Developers track.",
    embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
  },
];

// Load embeddings
let embeddingsData: Chunk[] | null = null;

function loadEmbeddings(): Chunk[] {
  if (!embeddingsData) {
    try {
      console.log("Loading embeddings from file...");
      const filePath = path.join(process.cwd(), "data", "embeddings.json");

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        embeddingsData = JSON.parse(fileContent);
        console.log(`✅ Loaded ${embeddingsData?.length} embeddings from file`);
      } else {
        console.log("⚠️ embeddings.json not found, using mock data");
        embeddingsData = MOCK_CHUNKS;
        console.log(`✅ Loaded ${embeddingsData?.length} mock chunks`);
      }
    } catch (error) {
      console.error("Error loading embeddings:", error);
      console.log("⚠️ Falling back to mock data");
      embeddingsData = MOCK_CHUNKS;
    }
  }
  return embeddingsData as Chunk[];
}

// Keyword search fallback
function keywordSearch(
  query: string,
  chunks: Chunk[],
  topK: number = 3,
): Chunk[] {
  console.log("🔍 Using keyword search");

  const queryWords = query.toLowerCase().split(/\s+/);

  const scored = chunks.map((chunk) => {
    const chunkText = chunk.text.toLowerCase();
    let score = 0;

    if (chunkText.includes(query.toLowerCase())) {
      score += 10;
    }

    for (const word of queryWords) {
      if (word.length > 2 && chunkText.includes(word)) {
        score += 1;
      }
    }

    const importantKeywords = [
      "react",
      "next",
      "typescript",
      "openai",
      "project",
      "experience",
      "skill",
      "work",
      "job",
      "education",
    ];
    for (const keyword of importantKeywords) {
      if (
        query.toLowerCase().includes(keyword) &&
        chunkText.includes(keyword)
      ) {
        score += 2;
      }
    }

    return { ...chunk, score };
  });

  scored.sort((a, b) => (b.score || 0) - (a.score || 0));
  return scored.slice(0, topK);
}

// Pull the text following "Label:" up to the end of that sentence
// (a period followed by whitespace, so "Next.js" is not cut short)
function extractSection(label: string, text: string): string | null {
  const match = text.match(
    new RegExp(`${label}:\\s*(.+?)(?:\\.\\s|\\.$|$)`, "i"),
  );
  return match ? match[1].trim() : null;
}

// Generate fallback response without API calls
function generateFallbackResponse(
  question: string,
  relevantChunks: Chunk[],
): string {
  console.log("🤖 Generating fallback response (no API call)");

  if (!relevantChunks || relevantChunks.length === 0) {
    return "I don't have information about that in my portfolio. Feel free to ask about Ayokunle's experience, skills, projects, or education!";
  }

  const contextText = relevantChunks.map((c) => c.text).join(" ");
  const questionLower = question.toLowerCase();
  const hasWord = (...words: string[]) =>
    new RegExp(`\\b(${words.join("|")})\\b`).test(questionLower);

  if (hasWord("projects?", "build", "built", "created")) {
    const projects = extractSection("Projects?", contextText);
    if (projects) {
      return `Ayokunle has worked on several projects including: ${projects}. He builds with React, Next.js, and modern web technologies.`;
    }
  }

  if (hasWord("skills?", "tech", "technology", "technologies")) {
    const skills = extractSection("Skills?", contextText);
    if (skills) {
      return `Ayokunle's technical skills include: ${skills}. He's particularly strong in React, Next.js, and TypeScript.`;
    }
  }

  if (hasWord("experience", "work", "job")) {
    const experience = extractSection("Experience", contextText);
    if (experience) {
      return `Ayokunle has over 5 years of experience as a Full-Stack Developer. ${experience}.`;
    }
  }

  if (hasWord("education", "study", "degree")) {
    const education = extractSection("Education", contextText);
    if (education) {
      return `Ayokunle holds an MSc in Human-Technology Interaction, focusing on usability and user-centered design. ${education}.`;
    }
  }

  if (hasWord("ai", "machine learning", "ml")) {
    return "Ayokunle is actively building AI skills through DataCamp's Associate AI Engineer track. He's learning about OpenAI API, Prompt Engineering, Hugging Face, LangChain, and LLMOps. He's passionate about integrating AI into full-stack applications.";
  }

  if (hasWord("who", "about")) {
    return "Ayokunle Ogunfidodo is a Full-Stack Software Engineer with over 5 years of experience. He specializes in React, Next.js, and TypeScript, and is currently transitioning into AI Engineering. He has an MSc in Human-Technology Interaction and has worked at STR Global Oy building operational dashboards.";
  }

  const firstSentence = contextText.split(/\.\s/)[0].replace(/\.$/, "");
  if (firstSentence) {
    const hint =
      relevantChunks.length > 1
        ? " I can tell you more about specific topics like skills, projects, experience, or education if you ask!"
        : "";
    return `${firstSentence}.${hint}`;
  }

  return "I'm an AI assistant for Ayokunle's portfolio. I can answer questions about his experience, skills, projects, education, and AI journey. Feel free to ask specific questions!";
}

/**
 * Try multiple providers with failover
 */
async function generateWithFailover(
  systemPrompt: string,
  question: string,
  relevantChunks: Chunk[],
): Promise<{ answer: string; provider: string }> {
  const messages = [
    { role: "system" as const, content: systemPrompt },
    { role: "user" as const, content: question },
  ];

  // Try Gemini first
  try {
    console.log("💬 Attempting Gemini...");
    const geminiResponse = await gemini.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: question,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        // Thinking tokens count against this budget, so leave headroom
        maxOutputTokens: 1024,
      },
    });

    const answer = geminiResponse.text?.trim();
    if (!answer) throw new Error("Empty response");
    console.log("✅ Gemini success!");
    return { answer, provider: "gemini" };
  } catch (error: any) {
    console.log(`❌ Gemini failed: ${error.message || "Unknown error"}`);
  }

  // If Gemini fails, try Groq
  try {
    console.log("💬 Attempting Groq (fallback)...");
    const groqResponse = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages,
      temperature: 0.7,
      // Reasoning tokens count against the completion budget, so keep
      // reasoning short and leave headroom for the visible answer
      reasoning_effort: "low",
      max_completion_tokens: 1024,
    });
    const answer = groqResponse.choices[0].message.content?.trim();
    if (!answer) throw new Error("Empty response");
    console.log("✅ Groq success!");
    return { answer, provider: "groq" };
  } catch (error: any) {
    console.log(`❌ Groq failed: ${error.message || "Unknown error"}`);
  }

  // Both failed - answer locally from the retrieved chunks
  return {
    answer: generateFallbackResponse(question, relevantChunks),
    provider: "fallback",
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request
    const body = await request.json();
    const question = body.question;

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 },
      );
    }

    console.log(`📝 Received question: "${question}"`);

    // Load embeddings (or mock data)
    const chunks = loadEmbeddings();

    // Find relevant chunks
    let relevantChunks: Chunk[] = [];

    try {
      // Try to use semantic search with embeddings
      console.log("🧠 Attempting to generate question embedding...");
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: question,
      });
      const questionEmbedding = embeddingResponse.data[0].embedding;
      console.log("✅ Successfully generated embedding");

      // Use cosine similarity
      const similarities = chunks.map((chunk) => ({
        ...chunk,
        similarity: cosineSimilarity(questionEmbedding, chunk.embedding),
      }));
      similarities.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
      relevantChunks = similarities.slice(0, 3);
    } catch (error: any) {
      // If embeddings fail, use keyword search
      console.log(`⚠️ Embedding failed, using keyword search`);
      relevantChunks = keywordSearch(question, chunks);
    }

    console.log(`✅ Found ${relevantChunks.length} relevant chunks`);

    // Build context
    const context = relevantChunks
      .map((chunk, index) => `[Context ${index + 1}]:\n${chunk.text}`)
      .join("\n\n---\n\n");

    // Build prompt
    const systemPrompt = `You are a friendly, professional assistant for Ayokunle Ogunfidodo's portfolio website. 
Your purpose is to help visitors learn about Ayokunle's background, skills, projects, and experience.

IMPORTANT RULES:
1. Only answer based on the context provided below
2. If the context doesn't contain the answer, say: "I don't have information about that in my portfolio. Feel free to ask about Ayokunle's experience, skills, or projects!"
3. Keep answers concise but informative (2-4 sentences)
4. Be enthusiastic but professional

Context:
${context}

Question: ${question}

Answer:`;

    // Generate response with failover
    const { answer, provider } = await generateWithFailover(
      systemPrompt,
      question,
      relevantChunks,
    );

    console.log(`✅ Final answer from: ${provider}`);

    // Return response with provider info
    return NextResponse.json({
      answer,
      provider, // Helps with debugging
    });
  } catch (error: any) {
    console.error("Error in chat API:", error);

    return NextResponse.json(
      {
        error: error.message || "An error occurred",
        answer:
          "I'm having trouble connecting to my systems right now. Please try again in a moment, or feel free to explore the portfolio directly!",
        provider: "error-fallback",
      },
      { status: 200 },
    );
  }
}

// Helper: cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
