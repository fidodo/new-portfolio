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
    <section id="certifications" className="section">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        <h2 className="heading text-center mb-2">Certifications & Licenses</h2>
        <p className="subheading text-center mb-8">
          Credentials I&apos;ve earned or am working toward
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              variants={fadeUpDelayed(index * 0.1)}
              initial="hidden"
              animate="visible"
              className="p-5 bg-card rounded-xl shadow-md border border-border flex items-start gap-4"
            >
              <FiAward className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground">
                  {cert.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">
                  {cert.issuer}
                </p>
                <p className="text-sm text-primary font-medium">
                  {cert.status}
                </p>
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 mt-2"
                  >
                    View credential
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
