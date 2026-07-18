import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"

const INTRO_VIDEO_PATH = `${import.meta.env.BASE_URL}intro/hero-intro.mp4`

export default function Intro({ onDone }) {
  const [visible, setVisible] = useState(true)
  const [fadeStarted, setFadeStarted] = useState(false)

  const startFade = useCallback(() => {
    if (fadeStarted) return
    setFadeStarted(true)
    setTimeout(() => {
      setVisible(false)
      onDone?.()
    }, 900)
  }, [fadeStarted, onDone])

  useEffect(() => {
    if (!visible) return
    const fallback = setTimeout(() => startFade(), 1200)
    return () => clearTimeout(fallback)
  }, [visible, startFade])

  if (!visible) return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black"
      animate={{ opacity: fadeStarted ? 0 : 1 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <video
        className="h-full w-full object-cover"
        src={INTRO_VIDEO_PATH}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => startFade()}
        onError={() => startFade()}
      />
      <button
        type="button"
        onClick={startFade}
        className="absolute bottom-6 right-6 mono-label border border-white/25 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white px-4 py-2 backdrop-blur-md transition-colors"
      >
        Skip Intro
      </button>
    </motion.div>
  )
}
