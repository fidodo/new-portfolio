"use client";

import { motion } from "framer-motion";
import * as HeroIcons from "@heroicons/react/24/outline";

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
  ],
  backend: [
    { name: "Node.js", level: "Intermediate", icon: "ServerIcon" },
    { name: "GraphQL", level: "Intermediate", icon: "BeakerIcon" },
    { name: "PostgreSQL", level: "Intermediate", icon: "ServerStackIcon" },
    { name: "MongoDB", level: "Intermediate", icon: "ServerStackIcon" },
    { name: "Firebase", level: "Intermediate", icon: "FireIcon" },
    { name: "Express.js", level: "Intermediate", icon: "PuzzlePieceIcon" },
    { name: "Prisma", level: "Intermediate", icon: "CubeIcon" },
  ],
  devops: [
    {
      name: "CI/CD (GitHub Actions, Docker)",
      level: "Intermediate",
      icon: "ArrowPathIcon",
    },
    { name: "AWS", level: "Intermediate", icon: "CloudIcon" },
    {
      name: "GCP",
      level: "Advanced",
      icon: "CloudArrowUpIcon",
    },
  ],
  design: [
    { name: "Figma", level: "Intermediate", icon: "PaintBrushIcon" },
    { name: "Framer", level: "Intermediate", icon: "FilmIcon" },
    { name: "UxPilot", level: "Intermediate", icon: "CursorArrowRaysIcon" },
    { name: "GSAP", level: "Intermediate", icon: "PlayIcon" },
  ],
};

export default function Skills() {
  return (
    <section id="skills" className="section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
              className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
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
                        <span className="font-medium text-gray-800 dark:text-gray-100">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
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
