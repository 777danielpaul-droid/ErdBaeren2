import { motion, useScroll, useSpring } from "framer-motion"

// Scroll-Linked Fortschrittsbalken oben (gekoppelt an window scrollYProgress).
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

  return (
    <motion.div
      className="fixed top-0 inset-x-0 h-[3px] z-[70] origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, #c026d3 0%, #22d3ee 55%, #f5c542 100%)",
        boxShadow: "0 0 14px rgba(192,38,211,0.7)",
      }}
      aria-hidden="true"
    />
  )
}
