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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {Object.entries(skills).map(([category, items], categoryIndex) => (
            <motion.div
              key={category}
              variants={fadeUpDelayed(categoryIndex * 0.2)}
              initial="hidden"
              animate="visible"
              className="p-5 bg-card rounded-xl shadow-md border border-border"
            >
              <h3 className="text-lg font-semibold text-primary mb-4 capitalize">
                {category}
              </h3>
              <ul className="space-y-3">
                {items.map((skill, index) => {
                  const Icon = HeroIcons[skill.icon as keyof typeof HeroIcons];
                  return (
                    <motion.li
                      key={skill.id}
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <div className="flex items-center gap-3">
                        {Icon && (
                          <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        )}
                        <span className="font-medium text-card-foreground">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {skill.level}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
