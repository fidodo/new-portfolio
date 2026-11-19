"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as HeroIcons from "@heroicons/react/24/outline";
import { fadeUp, fadeUpDelayed } from "../lib/motion";

interface SkillItem {
  id: string;
  name: string;
  level: string;
  icon: string;
  status?: string | null;
}

export default function Skills() {
  const [skills, setSkills] = useState<Record<string, SkillItem[]>>({});

  useEffect(() => {
    fetch("/api/resume-data")
      .then((res) => res.json())
      .then((data) => setSkills(data.skills ?? {}))
      .catch((error) => console.error("Failed to load skills data:", error));
  }, []);

  return (
    <section id="skills" className="section">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto"
      >
        <h2 className="heading text-center mb-2">Skills & Expertise</h2>
        <p className="subheading text-center mb-8">
          Technologies and tools I work with
        </p>

        <div className="space-y-7">
          {Object.entries(skills).map(([category, items], categoryIndex) => (
            <motion.div
              key={category}
              variants={fadeUpDelayed(categoryIndex * 0.08)}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => {
                  const Icon = HeroIcons[skill.icon as keyof typeof HeroIcons];
                  return (
                    <span
                      key={skill.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm text-card-foreground"
                      title={skill.status ?? undefined}
                    >
                      {Icon && <Icon className="h-3.5 w-3.5 text-primary" />}
                      {skill.name}
                      <span className="text-muted-foreground text-xs">
                        · {skill.level}
                      </span>
                    </span>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
