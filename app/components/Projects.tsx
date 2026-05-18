"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo, useCallback, memo } from "react";
import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiReact,
  SiJavascript,
  SiBootstrap,
  SiPostgresql,
  SiVite,
  SiAstro,
  SiMongodb,
  SiStrapi,
  SiPostcss,
  SiChartdotjs,
} from "react-icons/si";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import type { IconType } from "react-icons";
import { TbBrandFramer } from "react-icons/tb";
import { Variants } from "framer-motion";

// ============ TYPES ============
interface Project {
  id: string;
  title: string;
  description: string;
  tech: readonly string[];
  link: string;
  image: string;
  github?: string;
  status?: "In Progress" | "Completed" | "Archived";
  featured?: boolean;
  year?: number;
}

interface TechConfig {
  icon: IconType;
  color: string;
  bgOpacity: number;
}

// ============ CONSTANTS ============
const TECH_CONFIG: Record<string, TechConfig> = {
  "Next.js": { icon: SiNextdotjs, color: "#000000", bgOpacity: 0.1 },
  TypeScript: { icon: SiTypescript, color: "#3178C6", bgOpacity: 0.15 },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4", bgOpacity: 0.15 },
  React: { icon: SiReact, color: "#61DAFB", bgOpacity: 0.15 },
  Javascript: { icon: SiJavascript, color: "#F7DF1E", bgOpacity: 0.15 },
  Bootstrap: { icon: SiBootstrap, color: "#7952B3", bgOpacity: 0.15 },
  PostgreSQL: { icon: SiPostgresql, color: "#4169E1", bgOpacity: 0.15 },
  recharts: { icon: SiChartdotjs, color: "#22B5BF", bgOpacity: 0.15 },
  Vite: { icon: SiVite, color: "#646CFF", bgOpacity: 0.15 },
  Astro: { icon: SiAstro, color: "#BC52EE", bgOpacity: 0.15 },
  "Framer Motion": { icon: TbBrandFramer, color: "#0055FF", bgOpacity: 0.15 },
  MongoDB: { icon: SiMongodb, color: "#47A248", bgOpacity: 0.15 },
  Strapi: { icon: SiStrapi, color: "#D53F8C", bgOpacity: 0.15 },
  Scss: { icon: SiPostcss, color: "#CB6699", bgOpacity: 0.15 },
};

const PROJECTS: readonly Project[] = [
  {
    id: "renewal-guard",
    title: "Renewal Guard",
    description:
      "A license renewal tracker built with Next.js and Tailwind CSS.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"] as const,
    link: "https://renewal-guard.vercel.app/",
    image: "/projects/renewal-guard.png",
    year: 2024,
  },
  {
    id: "portfolio",
    title: "Portfolio Website",
    description: "A modern portfolio with smooth Framer Motion animations.",
    tech: ["Astro", "Tailwind CSS", "Framer Motion"] as const,
    link: "https://ogunfidodoayokunle.vercel.app/",
    image: "/projects/portfolio.webp",
    year: 2024,
  },
  {
    id: "monthly-spending",
    title: "Monthly Spending App",
    description:
      "A personal finance tracker to monitor monthly expenses and budgets.",
    tech: [
      "React",
      "Javascript",
      "Bootstrap",
      "PostgreSQL",
      "recharts",
    ] as const,
    link: "https://github.com/fidodo/monthly-spending",
    image: "/projects/monthly-spending.png",
    github: "https://github.com/fidodo/monthly-spending",
    year: 2023,
  },
  {
    id: "task-management",
    title: "Task Management App",
    description:
      "A collaborative task manager with real-time sync and clean UI.",
    tech: ["React", "TypeScript", "PostgreSQL", "Vite"] as const,
    link: "https://github.com/fidodo/thought-app",
    image: "/projects/task-app.png",
    github: "https://github.com/fidodo/thought-app",
    year: 2023,
  },
  {
    id: "ecommerce",
    title: "E-commerce Store",
    description:
      "A full-stack CMS e-commerce platform with product listings and cart functionality.",
    tech: ["Next.js", "Javascript", "Tailwind CSS", "MongoDB"] as const,
    link: "bouyantech.vercel.app",
    image: "/projects/Bouyantech.webp",
    github: "https://github.com/fidodo/Bouyantech",
    status: "In Progress",
    year: 2024,
  },
  {
    id: "green-fields",
    title: "AlhmanEdu Green Fields",
    description: "A blog platform built with Strapi CMS in backend, React.",
    tech: ["React", "TypeScript", "Javascript", "Strapi"] as const,
    link: "https://greenfileds-alhman.vercel.app/#home",
    image: "/projects/greenfields.webp",
    github: "https://github.com/fidodo/greenfileds_alhman",
    status: "In Progress",
    year: 2024,
  },
] as const;

// ============ ANIMATION VARIANTS ============
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
  hover: {
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const statusVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  hover: { scale: 1.05 },
};

// ============ SUB-COMPONENTS ============
const TechBadge = memo(({ tech }: { tech: string }) => {
  const config = TECH_CONFIG[tech];

  if (!config) {
    console.warn(`No tech config found for: ${tech}`);
    return null;
  }

  const { icon: Icon, color, bgOpacity } = config;

  return (
    <motion.span
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-default"
      style={{
        backgroundColor: `${color}${Math.floor(bgOpacity * 100)}`,
        borderColor: `${color}30`,
        borderWidth: 1,
      }}
      title={tech}
    >
      <Icon className="w-3.5 h-3.5" style={{ color }} />
      <span className="text-gray-700 dark:text-gray-300">{tech}</span>
    </motion.span>
  );
});

TechBadge.displayName = "TechBadge";

const ProjectLinks = memo(
  ({ link, github }: Pick<Project, "link" | "github">) => (
    <div className="flex items-center justify-between pt-2 border-t border-border dark:border-[#2a2a2a]">
      <motion.a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group/link"
      >
        <span>View Project</span>
        <FiExternalLink className="w-4 h-4 transition-all duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
      </motion.a>

      {github && (
        <motion.a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, rotate: 12 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
          aria-label="View Source Code"
        >
          <FiGithub className="w-5 h-5 text-primary" />
        </motion.a>
      )}
    </div>
  ),
);

ProjectLinks.displayName = "ProjectLinks";

const StatusBadge = memo(
  ({ status }: { status: NonNullable<Project["status"]> }) => (
    <motion.div
      variants={statusVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-full text-xs font-medium shadow-lg z-10 backdrop-blur-sm"
      title={`Status: ${status}`}
    >
      {status}
    </motion.div>
  ),
);

StatusBadge.displayName = "StatusBadge";

// ============ MAIN COMPONENT ============
export default function Projects() {
  const sortedProjects = useMemo(
    () => [...PROJECTS].sort((a, b) => (b.year || 0) - (a.year || 0)),
    [],
  );

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      img.src = "/projects/fallback.webp";
      img.onerror = null;
    },
    [],
  );

  return (
    <section
      id="projects"
      className="section py-20 scroll-mt-16"
      aria-label="Featured Projects"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Some of my recent work
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 gap-8"
        >
          {sortedProjects.map((project) => (
            <motion.article
              key={project.id}
              variants={itemVariants}
              whileHover="hover"
              className="group relative bg-white dark:bg-[#1a1a1a] rounded-xl shadow-md border border-gray-200 dark:border-[#2a2a2a] hover:shadow-xl transition-all duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-primary/50"
            >
              {/* Image Container */}
              <div className="relative w-full h-48 md:h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={project.image}
                  alt={`${project.title} project preview`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={project.featured}
                  onError={handleImageError}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Quick View Button */}
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <span className="bg-white dark:bg-gray-900 text-primary px-5 py-2.5 rounded-full text-sm font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Live Preview →
                  </span>
                </motion.a>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-2 line-clamp-1">
                  {project.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed text-sm">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <TechBadge key={tech} tech={tech} />
                  ))}
                </div>

                <ProjectLinks link={project.link} github={project.github} />
              </div>

              {/* Status Badge */}
              {project.status && <StatusBadge status={project.status} />}
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
