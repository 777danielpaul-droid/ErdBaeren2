import { motion } from "framer-motion"
import {
  fadeUp,
  fadeDown,
  fadeLeft,
  fadeRight,
  stagger,
  staggerFast,
} from "./variants"

const VARIANTS = {
  up: fadeUp,
  down: fadeDown,
  left: fadeLeft,
  right: fadeRight,
}

// Reveal-on-scroll. Failsafe: sichtbar per Default (whileInView + once).
// variant: up | down | left | right
// stagger: wenn true -> Container, der Kinder (mit eigener motion-variant) gestaffelt einblendet
export default function Reveal({
  children,
  className = "",
  as = "div",
  variant = "up",
  delay = 0,
  stagger: isStagger = false,
  staggerFast: fast = false,
  amount = 0.25,
}) {
  const Tag = motion[as] || motion.div
  const chosen = isStagger ? (fast ? staggerFast : stagger) : (VARIANTS[variant] || fadeUp)

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={chosen}
      transition={isStagger ? undefined : { delay }}
    >
      {children}
    </Tag>
  )
}
