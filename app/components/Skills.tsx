"use client";

import { motion } from "framer-motion";
import * as HeroIcons from "@heroicons/react/24/outline";
import { fadeUp, fadeUpDelayed } from "../lib/motion";

const skills = {
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
    {
      name: "CI/CD (GitHub Actions)",
      level: "Intermediate",
      icon: "ArrowPathIcon",
    },
    { name: "Docker", level: "Intermediate", icon: "CubeTransparentIcon" },
    { name: "AWS", level: "Intermediate", icon: "CloudIcon" },
    {
      name: "GCP",
      level: "Beginner",
      icon: "CloudArrowUpIcon",
    },
  ],
  design: [
    { name: "Figma", level: "Intermediate", icon: "PaintBrushIcon" },
    { name: "Framer", level: "Intermediate", icon: "FilmIcon" },
    { name: "UxPilot", level: "Intermediate", icon: "CursorArrowRaysIcon" },
    { name: "GSAP", level: "Intermediate", icon: "PlayIcon" },
  ],
  "Ai/ML": [
    {
      name: "OpenAI API",
      level: "Intermediate",
      icon: "ChatBubbleLeftRightIcon",
    },
    {
      name: "Prompt Engineering",
      level: "intermediate",
      icon: "ChatBubbleLeftRightIcon",
    },
    {
      name: "Hugging Face",
      level: "intermediate",
      icon: "ChatBubbleLeftRightIcon",
    },
    {
      name: "LangChain",
      level: "intermediate",
      icon: "ChatBubbleLeftRightIcon",
    },
    {
      name: "LLMOps",
      level: "intermediate",
      icon: "ChatBubbleLeftRightIcon",
      status:
        "in progress (~50% through DataCamp's Associate AI Engineer for Developers track)",
    },
    {
      name: "Vector Databases (Pinecone)",
      level: "Intermediate",
      icon: "CircleStackIcon",
    },
  ],
  "Testing & Quality": [
    { name: "Jest", level: "Intermediate", icon: "BeakerIcon" },
    {
      name: "React Testing Library",
      level: "Intermediate",
      icon: "CheckBadgeIcon",
    },
    { name: "WCAG Accessibility", level: "Advanced", icon: "EyeIcon" },
    {
      name: "Lighthouse / Core Web Vitals",
      level: "Advanced",
      icon: "ChartBarIcon",
    },
  ],
};

export default function Skills() {
  return (
    <section id="skills" className="section">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto"
      >
        <h2 className="heading text-center mb-2">Skills & Expertise</h2>
        <p className="subheading text-center mb-8">
          Technologies and tools I work with
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {Object.entries(skills).map(([category, items], categoryIndex) => (
            <motion.div
              key={category}
              variants={fadeUpDelayed(categoryIndex * 0.2)}
              initial="hidden"
              animate="visible"
              className="p-5 bg-card rounded-xl shadow-md border border-border"
            >
              <h3 className="text-lg font-semibold text-primary mb-4 capitalize">
                {category}
              </h3>
              <ul className="space-y-3">
                {items.map((skill, index) => {
                  const Icon = HeroIcons[skill.icon as keyof typeof HeroIcons];
                  return (
                    <motion.li
                      key={skill.name}
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <div className="flex items-center gap-3">
                        {Icon && (
                          <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        )}
                        <span className="font-medium text-card-foreground">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {skill.level}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
