import { Suspense, lazy, useState, useEffect } from "react"
import EarthBoundary from "./EarthBoundary"
import { useTimeline } from "./TimelineProvider"

// Lazy: drei.js/three.js (~600KB) werden erst geladen, wenn die Komponente
// tatsächlich gerendert wird (nur lg+). Spart Erstladezeit auf schwachen Geräten.
const HoloEarth = lazy(() => import("./HoloEarth"))

function HoloFallback() {
  return (
    <div className="relative w-full h-full min-h-[360px] grid place-items-center">
      <div className="w-40 h-40 rounded-full bg-neon/10 blur-[60px] animate-pulse" />
    </div>
  )
}

export default function HoloEarthLazy() {
  const { phase } = useTimeline()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (phase >= 5 && !ready) {
      const id = setTimeout(() => setReady(true), 350)
      return () => clearTimeout(id)
    }
  }, [phase, ready])

  if (phase < 5) return null
  if (!ready) {
    return (
      <div className="relative w-full h-full min-h-[360px]">
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="w-44 h-44 rounded-full bg-neon/25 blur-[80px] animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <EarthBoundary>
      <Suspense fallback={<HoloFallback />}>
        <HoloEarth />
      </Suspense>
    </EarthBoundary>
  )
}
