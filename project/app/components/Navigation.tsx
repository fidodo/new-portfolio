"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = document.querySelectorAll("section[id]");
      sections.forEach((section) => {
        const htmlSection = section as HTMLElement; // Type assertion
        const sectionTop = htmlSection.offsetTop;
        const sectionHeight = htmlSection.clientHeight;

        if (
          window.scrollY >= sectionTop - 200 &&
          window.scrollY < sectionTop + sectionHeight - 200
        ) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-sm shadow-lg dark:bg-gray-900/80"
          : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <span className="text-xl font-bold text-text">
            Ayokunle Ogunfidodo
          </span>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navItems.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      activeSection === id
                        ? "text-white bg-primary"
                        : "text-text hover:text-primary"
                    }`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
