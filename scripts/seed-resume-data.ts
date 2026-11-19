// scripts/seed-resume-data.ts
// One-time seed: copies the current hardcoded Experience/Skills content (and
// the resume's one certification) into the database, so ExperienceEntry/
// SkillEntry/CertificationEntry start out identical to what's already on the
// page. Run once via `npx tsx scripts/seed-resume-data.ts`.
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

dotenv.config({ path: path.join(projectRoot, ".env") });
dotenv.config({ path: path.join(projectRoot, ".env.local") });

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in .env");
  process.exit(1);
}

const prisma = new PrismaClient();

const experiences = [
  {
    title: "Frontend & Full-Stack Developer",
    company: "STR Global Oy",
    period: "Jan 2021 - Jan 2026",
    description:
      "Built and scaled Next.js real-time dashboards and operational workflows for a telemarketing Order Management System — order lifecycle tracking, CSV exports, fraud blacklisting, and payment gateway integration — improving team efficiency 2x. Enhanced CI/CD pipelines and Dockerized services, cutting release cycles ~40%, while maintaining 85%+ test coverage (Jest + React Testing Library) and WCAG-compliant interfaces.",
  },
  {
    title: "Freelance Full-Stack & UX/UI Developer",
    company: "Freelance",
    period: "Jan 2018 - Present",
    description:
      "Designed and built full-stack SaaS applications and AI-powered products end-to-end — including InterviewPal (an AI interview-prep platform) and an AI Resume Assistant — using React, Next.js, Node.js, Astro, and Strapi CMS. Optimized front-ends to consistently hit 90-95+ Lighthouse scores and led UX research and prototyping in Figma to sharpen onboarding and user flows.",
  },
  {
    title: "Innovation Program Participant & Frontend Developer",
    company: "Kasvuhuoneilmiö × AhlmanEdu",
    period: "Jan 2026 (5-week program)",
    description:
      "Collaborated in a multidisciplinary team to design community-focused digital and physical experiences for AhlmanEdu campus initiatives. Applied frontend development, UX thinking, and innovation strategy to rapid ideation and prototyping. Built a CMS-driven platform using React and Strapi while contributing to stakeholder presentations and human-centered solution development.",
  },
  {
    title: "ICT4N Internship",
    company: "Tampere University (via Opiframe Full Stack RekryKoulutus)",
    period: "Jan 2021 - Jan 2022",
    description:
      "Developed full-stack research tools and improved accessibility and usability of analytics dashboards for academic and operational use, using React, Node.js, and REST APIs.",
  },
  {
    title: "UX/UI Designer",
    company: "Lean Entries",
    period: "Jan 2018",
    description:
      "Redesigned onboarding flows and UI systems for regulatory SaaS tools, significantly increasing usability and clarity.",
  },
];

const skills: Record<
  string,
  { name: string; level: string; icon: string; status?: string }[]
> = {
  frontend: [
    { name: "React", level: "Advanced", icon: "CodeBracketIcon" },
    { name: "Next.js", level: "Advanced", icon: "RocketLaunchIcon" },
    { name: "TypeScript", level: "Advanced", icon: "CommandLineIcon" },
    { name: "Tailwind CSS", level: "Advanced", icon: "SwatchIcon" },
    { name: "Astro", level: "Intermediate", icon: "GlobeAltIcon" },
    { name: "Vite", level: "Advanced", icon: "BoltIcon" },
    { name: "GSAP", level: "Intermediate", icon: "PlayIcon" },
    { name: "SCSS", level: "Intermediate", icon: "SparklesIcon" },
    { name: "JavaScript", level: "Advanced", icon: "CodeBracketIcon" },
  ],
  backend: [
    { name: "Node.js", level: "Intermediate", icon: "ServerIcon" },
    { name: "GraphQL", level: "Intermediate", icon: "BeakerIcon" },
    { name: "PostgreSQL", level: "Intermediate", icon: "ServerStackIcon" },
    { name: "MongoDB", level: "Intermediate", icon: "ServerStackIcon" },
    { name: "Firebase", level: "Intermediate", icon: "FireIcon" },
    { name: "Express.js", level: "Intermediate", icon: "PuzzlePieceIcon" },
    { name: "Prisma", level: "Intermediate", icon: "CubeIcon" },
    { name: "Strapi", level: "Intermediate", icon: "CubeIcon" },
    { name: "flask", level: "Beginner", icon: "ServerIcon" },
  ],
  devops: [
    { name: "CI/CD (GitHub Actions)", level: "Intermediate", icon: "ArrowPathIcon" },
    { name: "Docker", level: "Intermediate", icon: "CubeTransparentIcon" },
    { name: "AWS", level: "Intermediate", icon: "CloudIcon" },
    { name: "GCP", level: "Beginner", icon: "CloudArrowUpIcon" },
  ],
  design: [
    { name: "Figma", level: "Intermediate", icon: "PaintBrushIcon" },
    { name: "Framer", level: "Intermediate", icon: "FilmIcon" },
    { name: "UxPilot", level: "Intermediate", icon: "CursorArrowRaysIcon" },
    { name: "GSAP", level: "Intermediate", icon: "PlayIcon" },
  ],
  "Ai/ML": [
    { name: "OpenAI API", level: "Intermediate", icon: "ChatBubbleLeftRightIcon" },
    { name: "Prompt Engineering", level: "intermediate", icon: "ChatBubbleLeftRightIcon" },
    { name: "Hugging Face", level: "intermediate", icon: "ChatBubbleLeftRightIcon" },
    { name: "LangChain", level: "intermediate", icon: "ChatBubbleLeftRightIcon" },
    {
      name: "LLMOps",
      level: "intermediate",
      icon: "ChatBubbleLeftRightIcon",
      status:
        "in progress (~50% through DataCamp's Associate AI Engineer for Developers track)",
    },
    { name: "Vector Databases (Pinecone)", level: "Intermediate", icon: "CircleStackIcon" },
  ],
  "Testing & Quality": [
    { name: "Jest", level: "Intermediate", icon: "BeakerIcon" },
    { name: "React Testing Library", level: "Intermediate", icon: "CheckBadgeIcon" },
    { name: "WCAG Accessibility", level: "Advanced", icon: "EyeIcon" },
    { name: "Lighthouse / Core Web Vitals", level: "Advanced", icon: "ChartBarIcon" },
  ],
};

const certifications = [
  {
    name: "Associate AI Engineer for Developers Track",
    issuer: "DataCamp",
    status: "In Progress (~50% complete)",
    url: null,
  },
];

async function main() {
  const existingExperience = await prisma.experienceEntry.count();
  const existingSkills = await prisma.skillEntry.count();
  const existingCerts = await prisma.certificationEntry.count();

  if (existingExperience || existingSkills || existingCerts) {
    console.log(
      "⚠️  Resume tables already have data — skipping seed to avoid duplicates.",
    );
    console.log(
      `   ExperienceEntry: ${existingExperience}, SkillEntry: ${existingSkills}, CertificationEntry: ${existingCerts}`,
    );
    return;
  }

  await prisma.experienceEntry.createMany({
    data: experiences.map((exp, i) => ({ ...exp, sortOrder: i })),
  });
  console.log(`✅ Seeded ${experiences.length} ExperienceEntry rows`);

  let skillSortOrder = 0;
  const skillRows = Object.entries(skills).flatMap(([category, items]) =>
    items.map((item) => ({
      category,
      ...item,
      sortOrder: skillSortOrder++,
    })),
  );
  await prisma.skillEntry.createMany({ data: skillRows });
  console.log(`✅ Seeded ${skillRows.length} SkillEntry rows`);

  await prisma.certificationEntry.createMany({
    data: certifications.map((cert, i) => ({ ...cert, sortOrder: i })),
  });
  console.log(`✅ Seeded ${certifications.length} CertificationEntry rows`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
