"use client";

import { motion } from "framer-motion";

const experiences = [
  {
    title: "Full Stack Web Developer (Front-end focus) & UX Designer",
    company: "STR Global Oy",
    period: "2021 - January 2026",
    description:
      "Built and enhanced internal OMS and WMS applications with a frontend-focused full-stack approach, improving operational efficiency, interface responsiveness, and overall user experience for internal teams and business operations.",
  },

  {
    title: "Innovation Program Participant & Frontend Developer",
    company: "Kasvuhuoneilmiö × AhlmanEdu",
    period: "2026 (5-week program)",
    description:
      "Collaborated in a multidisciplinary team to design community-focused digital and physical experiences for AhlmanEdu campus initiatives. Applied frontend development, UX thinking, and innovation strategy to rapid ideation and prototyping. Built a CMS-driven platform using React and Strapi while contributing to stakeholder presentations and human-centered solution development.",
  },

  {
    title: "Full Stack Developer",
    company:
      "Opiframe Full Stack -kehittäjän RekryKoulutus Oy / Tampere University ICT4N (ICT For Need)",
    period: "2021 - 2022",
    description:
      "Developed full-stack applications and research tools using modern web technologies, focusing on usability, accessibility, and scalable frontend architecture.",
  },

  {
    title: "Web Developer, Tech Enthusiast & UI/UX Designer",
    company: "Freelance",
    period: "2015 - Present",
    description:
      "Designed and developed websites and digital products for clients using React, Next.js, Astro, and modern frontend technologies, with a strong focus on responsive design, performance, and user experience.",
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
