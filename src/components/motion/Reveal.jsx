import { motion } from "framer-motion"
import {
  fadeUp,
  fadeDown,
  fadeLeft,
  fadeRight,
  fadeScale,
  fadeBlur,
  fadeClip,
  stagger,
  staggerFast,
  useParallax,
} from "./variants"

const VARIANTS = {
  up: fadeUp,
  down: fadeDown,
  left: fadeLeft,
  right: fadeRight,
  scale: fadeScale,
  blur: fadeBlur,
  clip: fadeClip,
}

// Reveal-on-scroll. Failsafe: sichtbar per Default (whileInView + once).
// variant: up | down | left | right | scale | blur | clip
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

// Scroll-gekoppeltes Parallax-Element (Verschiebung entlang Achse).
export function Parallax({ children, className = "", offset = 80, axis = "y" }) {
  const { ref, value } = useParallax(offset, axis)
  return (
    <motion.div ref={ref} style={{ [axis]: value }} className={className}>
      {children}
    </motion.div>
  )
}
