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
  SiPostgresql,
  SiVite,
  SiAstro,
  SiMongodb,
  SiStrapi,
  SiPostcss,
  SiChartdotjs,
  SiGooglegemini,
  SiExpress,
  SiPrisma,
} from "react-icons/si";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import type { IconType } from "react-icons";
import { TbBrandFramer } from "react-icons/tb";
import { Sparkles } from "lucide-react";
import { staggerContainer, cardHover } from "../lib/motion";

// ============ TYPES ============
interface Project {
  id: string;
  title: string;
  description: string;
  impact?: string;
  tech: readonly string[];
  link: string;
  image?: string;
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
  PostgreSQL: { icon: SiPostgresql, color: "#4169E1", bgOpacity: 0.15 },
  recharts: { icon: SiChartdotjs, color: "#22B5BF", bgOpacity: 0.15 },
  Vite: { icon: SiVite, color: "#646CFF", bgOpacity: 0.15 },
  Astro: { icon: SiAstro, color: "#BC52EE", bgOpacity: 0.15 },
  "Framer Motion": { icon: TbBrandFramer, color: "#0055FF", bgOpacity: 0.15 },
  MongoDB: { icon: SiMongodb, color: "#47A248", bgOpacity: 0.15 },
  Strapi: { icon: SiStrapi, color: "#D53F8C", bgOpacity: 0.15 },
  Scss: { icon: SiPostcss, color: "#CB6699", bgOpacity: 0.15 },
  "Gemini API": { icon: SiGooglegemini, color: "#8E75B2", bgOpacity: 0.15 },
  Express: { icon: SiExpress, color: "#000000", bgOpacity: 0.1 },
  Prisma: { icon: SiPrisma, color: "#2D3748", bgOpacity: 0.12 },
};

const PROJECTS: readonly Project[] = [
  {
    id: "interviewpal",
    title: "InterviewPal",
    description:
      "An AI-powered interview-prep platform: practice technical interviews by voice or code with instant AI scoring, target-role mock interviews, a system-design canvas, and a RAG Lab for building and grading your own retrieval chatbot.",
    impact:
      "Shipped solo: a full-stack TypeScript app orchestrating multiple LLM providers behind one interface, from auth to voice-based scoring.",
    tech: [
      "React",
      "TypeScript",
      "Vite",
      "Express",
      "Prisma",
      "PostgreSQL",
    ] as const,
    link: "https://client-beige-mu-26.vercel.app/login",
    image: "/projects/interviewpal.png",
    github: "https://github.com/fidodo/interviewpal",
    featured: true,
    year: 2026,
  },
  {
    id: "portfolio",
    title: "Portfolio Website",
    description: "A modern portfolio with smooth Framer Motion animations.",
    tech: ["Astro", "Tailwind CSS", "Framer Motion"] as const,
    link: "https://ogunfidodoayokunle.vercel.app/",
    image: "/projects/portfolio.webp",
    github: "https://github.com/fidodo/new-portfolio",
    year: 2025,
  },
  {
    id: "renewal-guard",
    title: "Renewal Guard",
    description:
      "A license renewal tracker built with Next.js and Tailwind CSS.",
    impact:
      "Deployed and live: automated renewal reminders and status tracking for real subscription management, not just a demo.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"] as const,
    link: "https://renewal-guard.vercel.app/",
    image: "/projects/renewal-guard.png",
    featured: true,
    year: 2026,
  },

  {
    id: "ecommerce",
    title: "E-commerce Store",
    description:
      "A full-stack CMS e-commerce platform with product listings and cart functionality.",
    tech: ["Next.js", "Javascript", "Tailwind CSS", "MongoDB"] as const,
    link: "https://bouyantech.vercel.app/",
    image: "/projects/Bouyantech.webp",
    github: "https://github.com/fidodo/Bouyantech",
    status: "In Progress",
    year: 2026,
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
    year: 2026,
  },
  {
    id: "Ai resume assistant (In Progess)",
    title: "AI Resume Assistant",
    description:
      "A chatbot built on the Google Gemini API that answers questions about my background using my resume and project history as context. Built to apply what I'm learning in prompt engineering and retrieval directly, not just in coursework.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Gemini API"] as const,
    link: "https://ogunfidodoayokunle.vercel.app/",
    image: "/projects/ai-assistant.webp",
    github: "https://github.com/fidodo/new-portfolio",
    status: "In Progress",
    year: 2026,
  },
] as const;

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
      <span className="text-card-foreground">{tech}</span>
    </motion.span>
  );
});

TechBadge.displayName = "TechBadge";

const ProjectLinks = memo(
  ({ link, github }: Pick<Project, "link" | "github">) => (
    <div className="flex items-center justify-between pt-2 border-t border-border">
      <motion.a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group/link"
      >
        <span>View live site</span>
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

const SecondaryProjectRow = memo(({ project }: { project: Project }) => (
  <a
    href={project.link}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center justify-between gap-4 py-4 border-b border-border last:border-b-0 hover:bg-secondary/40 -mx-3 px-3 rounded-lg transition-colors"
  >
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        {project.status && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {project.status}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground line-clamp-1">
        {project.description}
      </p>
    </div>
    <div className="flex items-center gap-3 flex-shrink-0">
      <span className="hidden sm:flex gap-1.5">
        {project.tech.slice(0, 3).map((tech) => {
          const config = TECH_CONFIG[tech];
          if (!config) return null;
          const Icon = config.icon;
          return (
            <Icon
              key={tech}
              className="w-4 h-4"
              style={{ color: config.color }}
              title={tech}
            />
          );
        })}
      </span>
      <FiExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
    </div>
  </a>
));

SecondaryProjectRow.displayName = "SecondaryProjectRow";

const FeaturedProjectRow = memo(
  ({
    project,
    reversed,
    onImageError,
  }: {
    project: Project;
    reversed: boolean;
    onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  }) => {
    let hostname = project.link;
    try {
      hostname = new URL(project.link).hostname;
    } catch {
      // link isn't a full URL (shouldn't happen for featured projects); fall
      // back to showing it as-is rather than throwing.
    }

    return (
      <motion.article
        variants={cardHover}
        className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
      >
        {/* Browser-chrome mockup: grounds the screenshot as a real, live
            site rather than a decorative thumbnail. */}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.title} (${hostname})`}
          className={`group block rounded-lg border border-border overflow-hidden bg-card hover:border-primary/50 transition-colors ${
            reversed ? "md:order-2" : ""
          }`}
        >
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border">
            <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            <span className="ml-2 text-xs text-muted-foreground truncate">
              {hostname}
            </span>
          </div>
          <div className="relative w-full h-56 md:h-64 bg-muted">
            <Image
              src={project.image ? project.image : "/projects/fallback.webp"}
              alt={`${project.title} project preview`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              onError={onImageError}
            />
          </div>
        </a>

        <div className={reversed ? "md:order-1" : ""}>
          <h3 className="text-2xl font-bold mb-2">
            {project.title}
            {project.status && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                · {project.status}
              </span>
            )}
          </h3>

          <p className="text-card-foreground/80 mb-3 leading-relaxed">
            {project.description}
          </p>

          {project.impact && (
            <p className="flex items-start gap-2 text-sm text-foreground mb-5">
              <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{project.impact}</span>
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-5">
            {project.tech.map((tech) => (
              <TechBadge key={tech} tech={tech} />
            ))}
          </div>

          <ProjectLinks link={project.link} github={project.github} />
        </div>
      </motion.article>
    );
  },
);

FeaturedProjectRow.displayName = "FeaturedProjectRow";

// ============ MAIN COMPONENT ============
export default function Projects() {
  const { featuredProjects, secondaryProjects } = useMemo(() => {
    const sorted = [...PROJECTS].sort((a, b) => (b.year || 0) - (a.year || 0));
    return {
      featuredProjects: sorted.filter((p) => p.featured),
      secondaryProjects: sorted.filter((p) => !p.featured),
    };
  }, []);

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
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Some of my recent work
          </p>
        </motion.div>

        {/* Featured Projects */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-16 md:space-y-20"
        >
          {featuredProjects.map((project, index) => (
            <FeaturedProjectRow
              key={project.id}
              project={project}
              reversed={index % 2 === 1}
              onImageError={handleImageError}
            />
          ))}
        </motion.div>

        {/* More Projects */}
        {secondaryProjects.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mt-16"
          >
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-2">
              More projects
            </h3>
            <div>
              {secondaryProjects.map((project) => (
                <SecondaryProjectRow key={project.id} project={project} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
