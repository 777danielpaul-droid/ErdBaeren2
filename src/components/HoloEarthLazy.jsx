import { Suspense, lazy } from "react"
import EarthBoundary from "./EarthBoundary"

// Lazy: drei.js/three.js (~600KB) werden erst geladen, wenn die Komponente
// tatsächlich gerendert wird (nur lg+). Spart Erstladezeit auf schwachen Geräten.
const HoloEarth = lazy(() => import("./HoloEarth"))

// Platzhalter, während das 3D-Bundle lädt.
function HoloFallback() {
  return (
    <div className="relative w-full h-full min-h-[360px] grid place-items-center">
      <div className="w-40 h-40 rounded-full bg-neon/10 blur-[60px] animate-pulse" />
    </div>
  )
}

export default function HoloEarthLazy() {
  return (
    <EarthBoundary>
      <Suspense fallback={<HoloFallback />}>
        <HoloEarth />
      </Suspense>
    </EarthBoundary>
  )
}
