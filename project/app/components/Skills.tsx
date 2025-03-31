"use client";

import { motion } from "framer-motion";

const skills = [
  { name: "React", level: "Advanced" },
  { name: "TypeScript", level: "Advanced" },
  { name: "Next.js", level: "Advanced" },
  { name: "SCSS", level: "Intermediate" },
  { name: "GSAP", level: "Intermediate" },
  { name: "Astro", level: "Intermediate" },
  { name: "Vite", level: "Advanced" },
];

export default function Skills() {
  return (
    <section id="skills" className="section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="heading">Skills & Expertise</h2>
        <p className="subheading">Technologies and tools I work with</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold text-primary mb-2">
                {skill.name}
              </h3>
              <p className="text-secondary text-sm">{skill.level}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
