// ZENTRALE MOTION-PRESETS — einheitliches Easing, Reveal-Varianten.
import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"

// Einheitliches Easing (weich/expo-out) — überall verwendet für konsistente Bewegung.
export const EASE = [0.16, 1, 0.3, 1]

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
  hidden: { opacity: 0, x: 48 },
  show: { opacity: 1, x: 0, transition: base },
}

export const fadeRight = {
  hidden: { opacity: 0, x: -48 },
  show: { opacity: 1, x: 0, transition: base },
}

// Title line variant for Hero headline
export const titleLine = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: 0.15 + i * 0.12 },
  }),
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
