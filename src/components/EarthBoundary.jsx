import { Component } from "react"

// Fängt Render-Fehler der 3D-Erde ab, damit ein WebGL-/Asset-Problem
// NIE die ganze Seite crasht — stattdessen wird ein dezenter Fallback gezeigt.
export default class EarthBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, msg: "" }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, msg: error?.message || String(error) }
  }
  componentDidCatch(error, info) {
    // Fehler sichtbar machen (nur Dev), damit wir ihn debuggen können.
    console.error("[HoloEarth] crashed:", error, info)
    if (typeof document !== "undefined") {
      const tag = document.createElement("pre")
      tag.id = "earth-error"
      tag.style.cssText = "position:fixed;bottom:8px;left:8px;z-index:9999;max-width:60vw;color:#f66;font:11px monospace;white-space:pre-wrap;background:#000a;padding:6px;border:1px solid #f66"
      tag.textContent = "[HoloEarth] " + (error?.stack || error?.message || String(error))
      document.body.appendChild(tag)
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[560px] grid place-items-center">
          <div className="w-40 h-40 rounded-full bg-neon/10 blur-[60px]" />
        </div>
      )
    }
    return this.props.children
  }
}
