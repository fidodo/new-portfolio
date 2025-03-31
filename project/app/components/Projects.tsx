"use client";

import { motion } from "framer-motion";

const projects = [
  {
    title: "A Delivery of Product Calculator",
    description:
      "A full-featured online shopping platform built with Next.js and Tailwind CSS",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "ESlint", "Prettier", "jest"],
    link: "https://github.com/fidodo/dopc-task",
  },
  {
    title: "Task Management App",
    description: "A collaborative task/thoughts management tool with real-time updates",
    tech: ["React", "TypeScript", "Tailwind CSS", "Postgresql", "Vite"],
    link: "https://github.com/fidodo/thought-app",
  },
  {
    title: "Portfolio Website using astrojs",
    description:
      "A modern portfolio website with smooth animations and responsive design",
    tech: ["Next.js", "GSAP", "Framer Motion", "Tailwind CSS"],
    link: "https://ayokunleogunfidodo.netlify.app/",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="heading">Featured Projects</h2>
        <p className="subheading">Some of my recent work</p>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
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
