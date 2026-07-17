// ZENTRALE MOTION-PRESETS — einheitliches Easing, Reveal-Varianten, Scroll-Helfer.
import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"

// Einheitliches Easing (weich/expo-out) — überall verwendet für konsistente Bewegung.
export const EASE = [0.16, 1, 0.3, 1]
export const EASE_SOFT = [0.16, 1, 0.3, 1]
export const SPRING = { type: "spring", stiffness: 120, damping: 20, mass: 0.9 }

// --- REVEAL-VARIANTEN (alle on-scroll, einmalig) ---
const base = { duration: 0.85, ease: EASE }

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: base },
}

export const fadeDown = {
  hidden: { opacity: 0, y: -28 },
  show: { opacity: 1, y: 0, transition: base },
}

export const fadeLeft = {
  // kommt von rechts nach links rein
  hidden: { opacity: 0, x: 48 },
  show: { opacity: 1, x: 0, transition: base },
}

export const fadeRight = {
  // kommt von links nach rechts rein
  hidden: { opacity: 0, x: -48 },
  show: { opacity: 1, x: 0, transition: base },
}

export const fadeScale = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { ...base, duration: 0.85 } },
}

export const fadeBlur = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { ...base, duration: 0.9 } },
}

export const fadeClip = {
  hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
  show: { opacity: 1, clipPath: "inset(0 0 0% 0)", transition: { duration: 0.9, ease: EASE } },
}

// Stagger-Container
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.08 } },
}
export const staggerFast = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

// --- SCROLL-LINKED HELFER ---
// Horizontale/vertikale Parallax-Verschiebung, gekoppelt an Scroll-Position.
export function useParallax(offset = 80, axis = "y") {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const distance = offset
  const value =
    axis === "y"
      ? useTransform(scrollYProgress, [0, 1], [distance, -distance])
      : useTransform(scrollYProgress, [0, 1], [distance, -distance])
  return { ref, value }
}

// Scroll-Fortschritt (0..1) über ein Element — für z.B. Glow-Intensität.
export function useScrollGlow(range = [0, 1]) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  })
  const glow = useTransform(scrollYProgress, range, [0.15, 0.55])
  return { ref, glow }
}
