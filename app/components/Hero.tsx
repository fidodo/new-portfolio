"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";

export default function Hero() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;
    const tl = gsap.timeline();
    tl.from(titleRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    }).from(
      subtitleRef.current,
      {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.5",
    );
  }, []);

  return (
    <section
      id="home"
      className="section min-h-screen flex items-center justify-center"
    >
      <div className="text-center max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            staggerChildren: 0.2,
          }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Hi, I&apos;m{" "}
            <span className="text-primary">Ayokunle Ogunfidodo</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-primary mb-6 font-medium"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Frontend Focused Full Stack Developer • Frontend Engineer • UI/UX
            Enthusiast
          </motion.p>

          <motion.p
            className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            I build scalable, human-centered digital experiences using React,
            Next.js, TypeScript, and modern frontend technologies. Passionate
            about combining clean engineering, UX thinking, innovation, and
            interactive design to create meaningful products.
          </motion.p>

          <motion.div
            className="flex justify-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <a href="#projects" className="button">
              View My Work
            </a>

            <a href="#contact" className="button">
              Get in Touch
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
