"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, fadeInLeft } from "../lib/motion";

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);

  useEffect(() => {
    fetch("/api/resume-data")
      .then((res) => res.json())
      .then((data) => setExperiences(data.experience ?? []))
      .catch((error) => console.error("Failed to load experience data:", error));
  }, []);

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
              key={exp.id}
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
