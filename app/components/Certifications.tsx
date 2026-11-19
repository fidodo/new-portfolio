"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiExternalLink, FiAward } from "react-icons/fi";
import { fadeUp, fadeUpDelayed } from "../lib/motion";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  status: string;
  issuedDate: string | null;
  url: string | null;
}

export default function Certifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    fetch("/api/resume-data")
      .then((res) => res.json())
      .then((data) => setCertifications(data.certifications ?? []))
      .catch((error) =>
        console.error("Failed to load certifications data:", error),
      );
  }, []);

  if (certifications.length === 0) return null;

  return (
    <section id="certifications" className="section py-12">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
          Certifications & Licenses
        </h3>

        <div>
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              variants={fadeUpDelayed(index * 0.08)}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 py-3 border-b border-border last:border-b-0"
            >
              <FiAward className="h-4 w-4 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-foreground">
                  {cert.name}
                </span>
                <span className="text-muted-foreground"> — {cert.issuer}</span>
              </div>
              <span className="text-sm text-primary font-medium flex-shrink-0">
                {cert.status}
              </span>
              {cert.url && (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View credential: ${cert.name}`}
                  className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                >
                  <FiExternalLink className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
