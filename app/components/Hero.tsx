"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";

export default function Hero() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
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
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            staggerChildren: 0.2, // For sequential child animations
          }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Hi, I&apos;m{" "}
            <span className="text-primary">Ayokunle Ogunfidodo</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-primary mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Full Stack Developer | UI/UX Enthusiast | Problem Solver
          </motion.p>
          <div className="flex justify-center gap-4">
            <a href="#projects" className="button">
              View My Work
            </a>
            <a href="#contact" className="button">
              Get in Touch
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
