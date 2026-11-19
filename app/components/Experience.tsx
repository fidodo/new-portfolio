"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeInLeft } from "../lib/motion";

const experiences = [
  {
    title: "Frontend & Full-Stack Developer",
    company: "STR Global Oy",
    period: "Jan 2021 - Jan 2026",
    description:
      "Built and scaled Next.js real-time dashboards and operational workflows for a telemarketing Order Management System — order lifecycle tracking, CSV exports, fraud blacklisting, and payment gateway integration — improving team efficiency 2x. Enhanced CI/CD pipelines and Dockerized services, cutting release cycles ~40%, while maintaining 85%+ test coverage (Jest + React Testing Library) and WCAG-compliant interfaces.",
  },

  {
    title: "Freelance Full-Stack & UX/UI Developer",
    company: "Freelance",
    period: "Jan 2018 - Present",
    description:
      "Designed and built full-stack SaaS applications and AI-powered products end-to-end — including InterviewPal (an AI interview-prep platform) and an AI Resume Assistant — using React, Next.js, Node.js, Astro, and Strapi CMS. Optimized front-ends to consistently hit 90-95+ Lighthouse scores and led UX research and prototyping in Figma to sharpen onboarding and user flows.",
  },

  {
    title: "Innovation Program Participant & Frontend Developer",
    company: "Kasvuhuoneilmiö × AhlmanEdu",
    period: "Jan 2026 (5-week program)",
    description:
      "Collaborated in a multidisciplinary team to design community-focused digital and physical experiences for AhlmanEdu campus initiatives. Applied frontend development, UX thinking, and innovation strategy to rapid ideation and prototyping. Built a CMS-driven platform using React and Strapi while contributing to stakeholder presentations and human-centered solution development.",
  },

  {
    title: "ICT4N Internship",
    company: "Tampere University (via Opiframe Full Stack RekryKoulutus)",
    period: "Jan 2021 - Jan 2022",
    description:
      "Developed full-stack research tools and improved accessibility and usability of analytics dashboards for academic and operational use, using React, Node.js, and REST APIs.",
  },

  {
    title: "UX/UI Designer",
    company: "Lean Entries",
    period: "Jan 2018",
    description:
      "Redesigned onboarding flows and UI systems for regulatory SaaS tools, significantly increasing usability and clarity.",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        <h2 className="heading">Experience</h2>
        <p className="subheading">My professional journey</p>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              variants={fadeInLeft(index * 0.2)}
              initial="hidden"
              animate="visible"
              className="relative pl-8 border-l-2 border-primary"
            >
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-0" />
              <h3 className="text-xl font-semibold text-primary">
                {exp.title}
              </h3>
              <p className="text-secondary-foreground mb-1">{exp.company}</p>
              <p className="text-sm text-secondary-foreground mb-2">{exp.period}</p>
              <p className="text-secondary-foreground">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
