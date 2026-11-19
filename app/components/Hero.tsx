"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { ArrowDown, ArrowRight, Loader2, Send } from "lucide-react";

const QUICK_PROMPTS = [
  "What's InterviewPal?",
  "What AI tools do you use?",
  "What's your experience?",
];

export default function Hero() {
  const identityRef = useRef(null);
  const teaserRef = useRef(null);
  const ctaRef = useRef(null);
  const avatarRef = useRef(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    if (!identityRef.current || !teaserRef.current || !ctaRef.current) return;

    // gsap.context + revert() (not just an empty effect) because React Strict
    // Mode double-invokes effects in dev — without cleanup, a second timeline
    // starts mid-flight on the same elements and they can get stuck faded.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(avatarRef.current, {
        opacity: 0,
        scale: 0.85,
        duration: 0.7,
        ease: "power3.out",
      })
        .from(
          identityRef.current,
          { opacity: 0, y: 30, duration: 0.7, ease: "power3.out" },
          "-=0.4",
        )
        .from(
          teaserRef.current,
          { opacity: 0, y: 24, duration: 0.6, ease: "power3.out" },
          "-=0.35",
        )
        .from(
          ctaRef.current,
          { opacity: 0, y: 16, duration: 0.5, ease: "power3.out" },
          "-=0.3",
        );
    });

    return () => ctx.revert();
  }, []);

  const askQuestion = async (q: string) => {
    if (!q.trim() || isAsking) return;
    setIsAsking(true);
    setAnswer(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await response.json();
      setAnswer(
        response.ok
          ? data.answer
          : "Sorry, I couldn't answer that just now — try the chat button in the corner instead.",
      );
    } catch (error) {
      console.error("Hero chat teaser error:", error);
      setAnswer("Sorry, something went wrong. Try the chat button in the corner instead.");
    } finally {
      setIsAsking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    askQuestion(question);
  };

  const openFullChat = () => {
    if (!answer) return;
    window.dispatchEvent(
      new CustomEvent("portfolio-open-chat", {
        detail: { question, answer },
      }),
    );
  };

  return (
    <section
      id="home"
      className="section min-h-screen flex items-center justify-center relative"
    >
      <div className="w-full max-w-2xl px-6">
        <div
          ref={identityRef}
          className="flex items-center gap-4 mb-10 justify-center md:justify-start"
        >
          <div
            ref={avatarRef}
            className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-primary/25 shadow-md"
          >
            <Image
              src="/profile.png"
              alt="Portrait of Ayokunle Ogunfidodo"
              fill
              sizes="64px"
              priority
              className="object-cover grayscale-[15%] contrast-[1.05] saturate-[0.9]"
            />
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground mb-1">
              Hi, I&apos;m Ayokunle Ogunfidodo
            </p>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              <span className="text-primary">Full-Stack Engineer</span>
              {" "}building toward AI/ML
            </h1>
          </div>
        </div>

        <div
          ref={teaserRef}
          className="bg-card border border-border rounded-2xl shadow-lg p-5 md:p-6"
        >
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Ask my AI assistant about my work
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What's InterviewPal?"
              aria-label="Ask a question about Ayokunle's work"
              className="flex-1 min-w-0"
              disabled={isAsking}
            />
            <button
              type="submit"
              disabled={isAsking || !question.trim()}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center bg-primary text-primary-foreground rounded-xl transition-colors hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
              aria-label="Ask"
            >
              {isAsking ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>

          <div className="flex flex-wrap gap-2 mt-3">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  setQuestion(prompt);
                  askQuestion(prompt);
                }}
                disabled={isAsking}
                className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {answer && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-card-foreground leading-relaxed">
                {answer}
              </p>
              <button
                type="button"
                onClick={openFullChat}
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium mt-3"
              >
                Keep chatting
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <div
          ref={ctaRef}
          className="flex justify-center md:justify-start gap-3 flex-wrap mt-8"
        >
          <a href="#projects" className="button">
            View My Work
          </a>
          <a href="#contact" className="button button-secondary">
            Get in Touch
          </a>
          <a href="/resume.pdf" download className="button button-secondary">
            Download Resume
          </a>
        </div>
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
