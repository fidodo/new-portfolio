"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Blog from "./components/Blog";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".section");

      sections.forEach((section: any) => {
        gsap.fromTo(
          section,
          {
            opacity: 0.5,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 20%",
              toggleActions: "play none none none",
              once: true,
            },
          },
        );
      });
    }, mainRef);

    return () => {
      ctx.revert(); // Cleans up GSAP animations
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); // Kills ScrollTriggers
    };
  }, []);

  return (
    <>
      <Navigation />
      <main ref={mainRef}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
        <Blog />
      </main>
    </>
  );
}
