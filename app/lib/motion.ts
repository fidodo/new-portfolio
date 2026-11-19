import { Variants } from "framer-motion";

// Section entrances are deliberately quiet — short distance, short duration —
// so they read as "content is ready," not as a repeated performance. The one
// orchestrated, memorable motion moment lives in Hero's GSAP timeline instead.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const fadeUpDelayed = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, delay } },
});

export const fadeInLeft = (delay: number): Variants => ({
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, delay } },
});

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

// Hover-lift is reserved for elements that are actually interactive (project
// cards, which link out) — not applied to static display cards.
export const cardHover: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
  hover: { y: -6, transition: { duration: 0.2, ease: "easeOut" } },
};
