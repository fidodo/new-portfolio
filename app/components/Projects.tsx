"use client";

import Image from "next/image";
import { motion } from "framer-motion";

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
    title: "Task Management App",
    description:
      "A collaborative task manager with real-time sync and clean UI.",
    tech: ["React", "TypeScript", "PostgreSQL", "Vite"],
    link: "https://github.com/fidodo/thought-app",
    image: "/projects/task-app.png",
  },
  {
    title: "Portfolio Website",
    description: "A modern portfolio with smooth Framer Motion animations.",
    tech: ["Astro", "Tailwind CSS", "Framer Motion"],
    link: "https://ogunfidodoayokunle.vercel.app/",
    image: "/projects/ogunfidodoayokunle.png",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        <h2 className="heading">Featured Projects</h2>
        <p className="subheading">Some of my recent work</p>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative w-full h-48 md:h-56">
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {project.title}
                </h3>
                <p className="text-secondary mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 font-medium transition-colors duration-300"
                >
                  View Project →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
