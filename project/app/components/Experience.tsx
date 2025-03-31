"use client";

import { motion } from "framer-motion";

const experiences = [
  {
    title: "Full Stack Web Developer (Front-end focus) and UX designer",
    company: "STR Global oy",
    period: "2022 - Present",
    description:
      "Developed and maintained modern web applications using React, astrojs and Next.js",
  },
  {
    title: "Full Stack Developer",
    company:
      "Opiframe Full Stack -kehittäjän RekryKoulutus Oy / Tampere University ICT4N 'ICT For Need' ",
    period: "2021 - 2022",
    description:
      "Built full-stack applications using various modern technologies",
  },
  {
    title: "Web Developer & Tech enthusiast & UI/UX Designer",
    company: "Freelance",
    period: "2015 - 2021",
    description: "Developed and maintained multiple client websites",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="heading">Experience</h2>
        <p className="subheading">My professional journey</p>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative pl-8 border-l-2 border-primary"
            >
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-0" />
              <h3 className="text-xl font-semibold text-primary">
                {exp.title}
              </h3>
              <p className="text-secondary mb-1">{exp.company}</p>
              <p className="text-sm text-secondary mb-2">{exp.period}</p>
              <p className="text-secondary">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
