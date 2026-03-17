"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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
  SiFramer,
  SiMongodb,
} from "react-icons/si";
import { TbBrandFramer } from "react-icons/tb";

interface TechIcons {
  [key: string]: React.ElementType;
}

interface TechColors {
  [key: string]: string;
}

// Tech icon mapping
const techIcons: TechIcons = {
  "Next.js": SiNextdotjs,
  TypeScript: SiTypescript,
  "Tailwind CSS": SiTailwindcss,
  React: SiReact,
  Javascript: SiJavascript,
  Bootstrap: SiBootstrap,
  PostgreSQL: SiPostgresql,
  recharts: SiReact,
  Vite: SiVite,
  Astro: SiAstro,
  "Framer Motion": TbBrandFramer,
  MongoDB: SiMongodb,
};

// Tech colors for badges
const techColors: TechColors = {
  "Next.js": "#000000",
  TypeScript: "#3178C6",
  "Tailwind CSS": "#06B6D4",
  React: "#61DAFB",
  Javascript: "#F7DF1E",
  Bootstrap: "#7952B3",
  PostgreSQL: "#4169E1",
  recharts: "#22B5BF",
  Vite: "#646CFF",
  Astro: "#BC52EE",
  "Framer Motion": "#0055FF",
  MongoDB: "#47A248",
};

const projects = [
  {
    title: "Renewal Guard",
    description:
      "A license renewal tracker built with Next.js and Tailwind CSS.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    link: "https://renewal-guard.vercel.app/",
    image: "/projects/renewal-guard.png",
  },
  {
    title: "Portfolio Website",
    description: "A modern portfolio with smooth Framer Motion animations.",
    tech: ["Astro", "Tailwind CSS", "Framer Motion"],
    link: "https://ogunfidodoayokunle.vercel.app/",
    image: "/projects/portfolio.png",
  },
  {
    title: "Montly Spending App",
    description:
      "A personal finance tracker to monitor monthly expenses and budgets.",
    tech: ["React", "JavaScript", "Bootstrap", "PostgreSQL", "recharts"],
    link: "https://github.com/fidodo/monthly-spending",
    image: "/projects/monthly-spending.png",
    github: "https://github.com/fidodo/monthly-spending",
  },
  {
    title: "Task Management App",
    description:
      "A collaborative task manager with real-time sync and clean UI.",
    tech: ["React", "TypeScript", "PostgreSQL", "Vite"],
    link: "https://github.com/fidodo/thought-app",
    image: "/projects/task-app.png",
    github: "https://github.com/fidodo/thought-app",
  },
  {
    title: "E-commerce Store",
    description:
      "A full-stack CMS e-commerce platform with product listings and cart functionality.",
    tech: ["Next.js", "JavaScript", "Tailwind CSS", "MongoDB"],
    link: "https://github.com/fidodo/Bouyantech",
    image: "/projects/Bouyantech.png",
    github: "https://github.com/fidodo/Bouyantech",
    status: "In Progress",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="section py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-12">
          <h2 className="heading text-3xl md:text-4xl font-bold mb-4">
            Featured Projects
          </h2>
          <p className="subheading text-gray-400 relative inline-block">
            Some of my recent work
            <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative bg-card dark:bg-[#1a1a1a] rounded-xl shadow-md border border-border dark:border-[#2a2a2a] hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative w-full h-48 md:h-56 overflow-hidden">
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Quick View Button - Appears on hover */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white dark:bg-gray-900 text-primary px-4 py-2 rounded-full text-sm font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    Live Preview
                  </a>
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-2 line-clamp-1 group-hover:text-primary/80 transition-colors">
                  {project.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed text-sm">
                  {project.description}
                </p>

                {/* Tech Stack with Icons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => {
                    const IconComponent = techIcons[tech];
                    const techColor = techColors[tech] || "#64748b";

                    return (
                      <motion.div
                        key={tech}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group/tech"
                      >
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 dark:bg-[#2a2a2a] rounded-full text-xs font-medium border border-primary/10 hover:border-primary/30 transition-all duration-200 cursor-default"
                          style={{
                            borderColor: techColor + "20",
                            backgroundColor: techColor + "10",
                          }}
                          title={tech}
                        >
                          {IconComponent && (
                            <IconComponent
                              className="w-3.5 h-3.5"
                              style={{ color: techColor }}
                            />
                          )}
                          <span className="text-gray-700 dark:text-gray-300">
                            {tech}
                          </span>
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Project Links */}
                <div className="flex items-center justify-between pt-2 border-t border-border dark:border-[#2a2a2a]">
                  {/* Main Project Link */}
                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group/link"
                  >
                    <span>View Project</span>
                    <svg
                      className="w-4 h-4 transition-all duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </motion.a>

                  {/* GitHub Link (if available) */}
                  {project.github && (
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors group/github"
                      title="View Source Code"
                    >
                      <svg
                        className="w-5 h-5 text-primary transition-transform group-hover/github:rotate-12"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    </motion.a>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              {project.status && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute -top-2 -right-2 px-3 py-1.5 bg-primary text-secondary rounded-full text-xs font-medium shadow-lg z-10"
                  title={`Status: ${project.status}`}
                >
                  {project.status}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
