import { useLayoutEffect } from "react"
import { useMotionValue, useTransform } from "framer-motion"

// Hook für die 3D-Stapel-Animation der Archiv-Karten.
// Positioniert Karten radial um die Mitte, rotiert sie beim Scrollen
// und blendet sie am unteren Rand aus.
export function useArchiveCardPosition(cardRef, index, count, progress) {
  const x = useMotionValue(0)
  const opacity = useMotionValue(0)

  const apply = (p) => {
    const card = cardRef.current
    const grid = card && card.parentElement
    if (!grid) return

    const stacked = window.matchMedia("(min-width: 1024px)").matches
    let center = 0
    if (stacked) {
      const g = grid.getBoundingClientRect()
      const r = card.getBoundingClientRect()
      const naturalLeft = r.left - x.get()
      center = g.left + g.width / 2 - (naturalLeft + r.width / 2)
    }

    const pp = typeof p === "number" ? p : progress.get()
    let factor
    if (pp < 0.70) factor = 1
    else if (pp > 0.97) factor = 0
    else {
      const t = (pp - 0.70) / (0.97 - 0.70)
      factor = 1 - Math.pow(t, 0.6)
    }

    x.set(factor * center)
    opacity.set(pp < 0.62 ? Math.max(0, (pp - 0.55) / 0.07) : 1)
  }

  useLayoutEffect(() => {
    apply()
  }, [apply])

  useLayoutEffect(() => {
    const off = progress.on("change", apply)
    return off
  }, [progress, apply])

  const rel = index - (count - 1) / 2
  const rotate = useTransform(progress, [0.70, 0.97], [rel * 3, 0])

  return { x, rotate, opacity }
}
