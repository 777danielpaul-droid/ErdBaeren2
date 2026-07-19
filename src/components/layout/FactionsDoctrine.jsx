import { useRef, useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { site } from "../../data/content"
import { asset } from "../../lib/asset"
import { stagger, EASE } from "../motion/variants"
import { T } from "../RunenText"

const ACCENT = {
  neon: {
    tag: "text-neon border-neon/40",
    dot: "bg-neon",
    border: "border-neon/40",
  },
  cyan: {
    tag: "text-cyan border-cyan/40",
    dot: "bg-cyan",
    border: "border-cyan/40",
  },
}

function MilchmausVideo({ baseUrl }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const rafRef = useRef(null)
  const MAX_DURATION = 2.17

  const tick = useCallback(() => {
    const v = videoRef.current
    if (!v || v.ended) return setPlaying(false)
    if (v.currentTime >= MAX_DURATION) {
      v.pause()
      v.currentTime = 0
      return setPlaying(false)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [MAX_DURATION])

  const start = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = 0
    setPlaying(true)
    v.play().catch(() => setPlaying(false))
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  const stop = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
    setPlaying(false)
    cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return (
    <div
      onPointerEnter={start}
      onPointerLeave={stop}
      onClick={start}
      className="absolute inset-0 z-[8] cursor-pointer"
      title="Hover oder klicken zum Abspielen"
    >
      <video
        ref={videoRef}
        poster={asset("/erdbaer-mouse.jpg")}
        className="relative z-[8] w-full h-full object-cover opacity-90"
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        disableRemotePlayback
      />
    </div>
  )
}

function BattleVideo({ baseUrl }) {
  const videoRef = useRef(null)
  const rafRef = useRef(null)
  const dirRef = useRef(1)
  const prevRef = useRef(null)
  const MAX_DURATION = 1.0

  const stop = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.removeAttribute("src")
    v.load()
    dirRef.current = 1
    prevRef.current = null
    cancelAnimationFrame(rafRef.current)
  }, [])

  const tick = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    const now = performance.now()
    const prev = prevRef.current
    const dt = prev ? Math.min((now - prev) / 1000, 0.1) : 0
    prevRef.current = now
    let t = v.currentTime + dirRef.current * dt
    t = Math.max(0, Math.min(MAX_DURATION, t))
    v.currentTime = t
    if (dirRef.current === 1 && t >= MAX_DURATION) {
      dirRef.current = -1
    } else if (dirRef.current === -1 && t <= 0) {
      stop()
      return
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [MAX_DURATION, stop])

  const start = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    stop()
    v.setAttribute("src", `${baseUrl}erdbaeren-battle.mp4`)
    v.load()
    v.currentTime = 0
    dirRef.current = 1
    prevRef.current = performance.now()
    rafRef.current = requestAnimationFrame(tick)
  }, [tick, stop, baseUrl])

  useEffect(() => () => stop(), [stop])

  return (
    <div
      onPointerEnter={start}
      onPointerLeave={stop}
      onClick={start}
      className="absolute inset-0 z-[8] cursor-pointer"
      title="Hover oder klicken zum Abspielen"
    >
      <video
        ref={videoRef}
        poster={asset("/erdbaer-bear.jpg")}
        className="relative z-[8] w-full h-full object-cover opacity-90"
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        disableRemotePlayback
      />
    </div>
  )
}

export default function FactionsDoctrine() {
  return (
    <section id="fraktionen" className="relative z-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-20 relative z-20">
        <p className="mono-label text-gold mb-4">// FRAKTIONEN</p>
        <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-12">
          <T en="Two powers. One Earth.">Zwei Mächte. Eine Erde.</T>
        </h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {site.factions.map((f) => {
            const a = ACCENT[f.accent]
            return (
              <motion.article
                key={f.id}
                variants={{
                  hidden: { opacity: 0, y: 48 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.9, ease: EASE },
                  },
                }}
                whileHover={{ y: -6, transition: { duration: 0.4, ease: EASE } }}
                className={`group relative rounded-2xl neon-border glass sheen overflow-hidden hover:${a.border} transition-colors`}
              >
                <div className="relative isolate h-60 sm:h-72 overflow-hidden">
                  {f.id === "milchmaeuse" ? (
                    <MilchmausVideo baseUrl={import.meta.env.BASE_URL} />
                  ) : f.id === "erdbaeren" ? (
                    <BattleVideo baseUrl={import.meta.env.BASE_URL} />
                  ) : (
                    <img
                      src={asset(f.image)}
                      alt={f.name.de}
                      loading="lazy"
                      className="relative z-10 w-full h-full object-cover opacity-90 group-hover:scale-[1.04] transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 z-[5] bg-panel/25" />
                  <div className={`absolute top-4 left-4 mono-label ${a.tag} px-3 py-1 rounded-sm bg-ink/60`}>
                    {f.id.toUpperCase()}
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="font-display font-bold text-2xl tracking-tight">
                    <T en={f.name.en}>{f.name.de}</T>
                  </h3>
                  <p className={`mono-label ${a.tag} mt-1`}>
                    <T en={f.role.en}>{f.role.de}</T>
                  </p>
                  <p className={`mt-4 text-bone/70 italic border-l-2 ${a.border} pl-4`}>
                    „<T en={f.quote.en}>{f.quote.de}</T>“
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {f.traits.map((t, i) => (
                      <li key={i} className="flex gap-3 text-sm text-bone/75">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${a.dot} shrink-0`} />
                        <T en={t.en}>{t.de}</T>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
