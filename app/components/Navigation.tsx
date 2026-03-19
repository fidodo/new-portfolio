"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, User, Code2, FolderGit2, Briefcase, Mail } from "lucide-react";

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = document.querySelectorAll("section[id]");
      sections.forEach((section) => {
        const htmlSection = section as HTMLElement;
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
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Skills", icon: Code2 },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 border-white/20 border-b hidden md:block ${
          isScrolled
            ? "bg-white/80 backdrop-blur-sm shadow-lg dark:bg-gray-900/80"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <span className="text-xl font-bold text-text">
              Ayokunle Ogunfidodo
            </span>
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
      </motion.nav>

      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200 dark:bg-gray-900/90 dark:border-gray-800 shadow-lg"
      >
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`flex flex-col items-center justify-center px-2 py-1 rounded-md transition-colors relative
                ${
                  activeSection === id
                    ? "text-primary"
                    : "text-gray-600 dark:text-gray-400 hover:text-primary"
                }`}
            >
              {activeSection === id && (
                <motion.div
                  layoutId="activeMobileNav"
                  className="absolute -top-1 w-12 h-1 bg-primary rounded-full"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </a>
          ))}
        </div>
      </motion.nav>

      <div className="h-16 md:hidden" />
    </>
  );
}
