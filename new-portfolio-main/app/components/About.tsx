"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="heading">About Me</h2>
        <p className="subheading">
          Passionate developer crafting exceptional digital experiences
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-primary">Who I Am</h3>
            <p className="text-secondary">
              I&apos;m a full-stack developer with a passion for creating
              beautiful, functional, and user-friendly applications. With a
              strong foundation in modern web technologies, I strive to write
              clean, efficient code that solves real-world problems.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-primary">What I Do</h3>
            <p className="text-secondary">
              I specialize in building responsive web applications using modern
              frameworks and tools. My approach combines technical expertise
              with creative problem-solving to deliver solutions that exceed
              expectations.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
