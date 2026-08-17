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
              I&apos;m a full-stack developer with 5+ years shipping production
              React, Next.js, and Node.js platforms — most recently building
              real-time operational dashboards at STR Global Oy (2021–2026). I
              care about interfaces that are fast, accessible, and genuinely
              usable, which is where my MSc in Human-Technology Interaction
              comes in: I don&apos;t just build features, I build ones people
              can actually use under pressure.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-primary">What I Do</h3>
            <p className="text-secondary">
              I specialize in responsive, production-grade web applications —
              from backend API design through to polished, WCAG-compliant
              frontends. Right now I'm deliberately expanding into AI
              engineering, working through DataCamp's Associate AI Engineer for
              Developers track (OpenAI API, LangChain, Hugging Face, LLMOps),
              because I want to build AI-powered features on top of a full-stack
              foundation, not bolt AI on as an afterthought.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
