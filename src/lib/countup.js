import { useState, useEffect } from "react"

// Count-up-Hook: zählt sanft von `from` auf den Zielwert, sobald `when` true ist.
// Wiederverwendbar für Live-Vote-Zähler und andere animierten Zahlen.
export function useCountUp(target, from = 0, when = true, dur = 1200) {
  const [v, setV] = useState(from)

  useEffect(() => {
    if (!when) return
    let raf, start
    const step = (t) => {
      if (!start) start = t
      const p = Math.min((t - start) / dur, 1)
      setV(Math.round(from + p * (target - from)))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [when, target, from, dur])

  return v
}
