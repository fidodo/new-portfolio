"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;
    const tl = gsap.timeline();
    if (avatarRef.current) {
      tl.from(avatarRef.current, {
        opacity: 0,
        scale: 0.85,
        duration: 0.8,
        ease: "power3.out",
      });
    }
    tl.from(
      titleRef.current,
      {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      },
      avatarRef.current ? "-=0.4" : undefined,
    ).from(
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
      className="section min-h-screen flex items-center justify-center relative"
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
          <div
            ref={avatarRef}
            className="relative mx-auto mb-8 h-32 w-32 md:h-40 md:w-40"
          >
            <div className="relative h-full w-full overflow-hidden rounded-full ring-4 ring-primary/25 shadow-xl">
              <Image
                src="/profile.png"
                alt="Portrait of Ayokunle Ogunfidodo"
                fill
                sizes="160px"
                priority
                className="object-cover grayscale-[15%] contrast-[1.05] saturate-[0.9]"
              />
            </div>
          </div>

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
            Full-Stack Software Engineer • Building Toward AI/ML Engineering •
            UX-Minded • Product Innovator
          </motion.p>

          <motion.p
            className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            I build scalable, human-centered digital experiences using React,
            Next.js, TypeScript, and modern frontend technologies. Passionate
            about combining clean engineering, UX thinking, LLM&apos;s, AI &
            innovation, and interactive design to create meaningful products.
          </motion.p>

          <motion.div
            className="flex justify-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <a href="#projects" className="button">
              View My Work
            </a>

            <a href="#contact" className="button button-secondary">
              Get in Touch
            </a>

            <a
              href="/resume.pdf"
              download
              className="button button-secondary"
            >
              Download Resume
            </a>
          </motion.div>
        </motion.div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About section"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-secondary-foreground/60 hover:text-primary transition-colors animate-bounce"
      >
        <ArrowDown className="h-5 w-5" />
      </a>
    </section>
  );
}
