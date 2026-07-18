// Shared scroll-linked reveal stage for Battle / SecretWeapon style sections.
// Eliminates duplicated transform blocks across multiple sections.
import { useScroll, useTransform } from "framer-motion"

export function useScrollRevealStage(ref, { offset } = {}) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset || ["start start", "end end"],
  })

  const imgY = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "4%", "10%"])
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.03, 1.0])
  const imgOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.0, 0.7, 1])
  const imgBlur = useTransform(scrollYProgress, [0, 0.32], [18, 0])

  const panelY = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "-46%", "-58%"])
  const panelOpacity = useTransform(scrollYProgress, [0, 0.45, 0.7], [1, 0.9, 0])

  const captionY = useTransform(scrollYProgress, [0.5, 1], ["36%", "0%"])
  const captionOpacity = useTransform(scrollYProgress, [0.55, 0.8, 1], [0, 0.6, 1])

  const glow = useTransform(scrollYProgress, [0.3, 0.7, 1], [0.15, 0.5, 0.72])
  const glowShadow = useTransform(glow, (g) => `0 0 ${30 + g * 80}px rgba(192,38,211,${g})`)
  const imgFilter = useTransform(imgBlur, (b) => `blur(${b}px)`)

  return {
    scrollYProgress,
    imgY,
    imgScale,
    imgOpacity,
    imgBlur,
    panelY,
    panelOpacity,
    captionY,
    captionOpacity,
    glow,
    glowShadow,
    imgFilter,
  }
}
