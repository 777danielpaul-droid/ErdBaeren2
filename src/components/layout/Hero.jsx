import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { EASE } from "../motion/variants"
import { site } from "../../data/content"
import { useVotes } from "../../lib/votes"
import { T } from "../RunenText"
import HoloEarthLazy from "../HoloEarthLazy"

const NEON = ["#c026d3", "#7c3aed", "#22d3ee", "#c9a227"]

function HeroGrid() {
  // Auf schwachen/schmalen Geraeten (Mobile) das Grid komplett weglassen:
  // 600 DOM-Nodes + Hover-Transitions wuergen alte Handys (z.B. Galaxy A20) ab.
  if (typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches) {
    return null
  }
  // Feste Zellzahl; Overflow wird vom Hero (overflow-hidden) gekappt.
  // Beide Achsen mit 1fr -> das Grid fuellt den gesamten sichtbaren Hero.
  const cells = Array.from({ length: 600 })
  const onEnter = (e) => {
    const c = NEON[(Math.random() * NEON.length) | 0]
    e.currentTarget.style.background = `${c}22`
    e.currentTarget.style.borderColor = c
    e.currentTarget.style.boxShadow = `0 0 18px ${c}66, inset 0 0 12px ${c}33`
  }
  const onLeave = (e) => {
    e.currentTarget.style.background = "transparent"
    e.currentTarget.style.borderColor = "rgba(232,121,249,0.07)"
    e.currentTarget.style.boxShadow = "none"
  }
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 grid overflow-hidden"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(56px, 1fr))",
        gridTemplateRows: "repeat(auto-fill, minmax(56px, 1fr))",
      }}
    >
      {cells.map((_, i) => (
        <div
          key={i}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          className="border transition-[background,border-color,box-shadow] duration-200"
          style={{ borderColor: "rgba(232,121,249,0.07)" }}
        />
      ))}
    </div>
  )
}

const line = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: 0.15 + i * 0.12 },
  }),
}

// Mehrstufiger, gestaffelter Schatten = 3D-Extrusion in SCHWARZ: Buchstaben
// wirken wie aus der Flaeche herausragend (schwarzer Keil nach rechts-unten,
// weiter versetzt + leicht transparent).
const TITLE_SHADOW =
  "2px 2px rgba(0,0,0,0.55), 4px 4px rgba(0,0,0,0.5), 6px 6px rgba(0,0,0,0.45), " +
  "8px 8px rgba(0,0,0,0.4), 10px 10px rgba(0,0,0,0.38), 12px 12px rgba(0,0,0,0.34), " +
  "14px 14px rgba(0,0,0,0.3), 16px 16px rgba(0,0,0,0.28), 18px 18px rgba(0,0,0,0.25), " +
  "20px 20px rgba(0,0,0,0.22), 24px 24px 10px rgba(0,0,0,0.3)"

export default function Hero() {
  const h = site.hero
  const [t1, t2] = h.title.de.split("\n")
  const [t1en, t2en] = h.title.en.split("\n")
  const votes = useVotes()

  // Count-up-Hook: zählt sanft von `from` auf den Zielwert, sobald geladen.
  const useCountUp = (target, from = 0) => {
    const [v, setV] = useState(from)
    useEffect(() => {
      if (!votes.loaded) return
      let raf, start
      const dur = 1200
      const step = (t) => {
        if (!start) start = t
        const p = Math.min((t - start) / dur, 1)
        setV(Math.round(from + p * (target - from)))
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
      return () => cancelAnimationFrame(raf)
    }, [votes.loaded, target, from])
    return v
  }

  // Basis-Stand der Milchmäuse (lore-seitig höher als der Widerstand).
  const MILCHMAEUSE_BASE = 17171

  const nWiderstand = useCountUp(votes.loaded ? votes.erdbaeren : 0)
  const nUnterdruecker = useCountUp(
    votes.loaded ? MILCHMAEUSE_BASE + votes.milchmaeuse : MILCHMAEUSE_BASE,
    MILCHMAEUSE_BASE
  )

  // Live-Zähler ersetzen die statischen Werte.
  const liveValue = (label) => {
    if (label === "Der Widerstand") return nWiderstand.toLocaleString("de-DE")
    if (label === "Die Unterdrücker") return nUnterdruecker.toLocaleString("de-DE")
    return null
  }

  // Scroll-Linked Parallax: Aurora-Blob driftet beim Scrollen.
  const { scrollY } = useScroll()
  const blobY = useTransform(scrollY, [0, 800], [0, 220])
  const blobOpacity = useTransform(scrollY, [0, 600], [1, 0.3])

  return (
    <section id="top" className="relative min-h-screen flex items-center bg-theatre grain overflow-hidden">
      <HeroGrid />
      <motion.div
        style={{ y: blobY, opacity: blobOpacity }}
        className="absolute top-24 right-[-6rem] w-[18rem] h-[18rem] sm:w-[28rem] sm:h-[28rem] rounded-full bg-neon/25 blur-[60px] sm:blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-20 w-full pointer-events-none">
        <div className="relative">
          {/* LINKS: Headline + Copy + CTAs + Stats */}
          <div className="relative">
            <motion.p
              custom={0}
              initial="hidden"
              animate="show"
              variants={line}
              className="mono-label text-neon mb-6"
            >
              <T en={h.eyebrow.en}>{h.eyebrow.de}</T>
            </motion.p>

            <h1
              className="font-display font-bold leading-[1.05] tracking-tight text-3xl sm:text-7xl lg:text-8xl max-w-4xl break-words"
              style={{ filter: "drop-shadow(2px 2px rgba(0,0,0,0.55)) drop-shadow(4px 4px rgba(0,0,0,0.5)) drop-shadow(8px 8px rgba(0,0,0,0.4)) drop-shadow(12px 12px rgba(0,0,0,0.34)) drop-shadow(18px 18px rgba(0,0,0,0.25)) drop-shadow(24px 24px 10px rgba(0,0,0,0.3))" }}
            >
              <motion.span custom={1} initial="hidden" animate="show" variants={line} className="block title-rainbow">
                <T en={t1en}>{t1}</T>
              </motion.span>
              <motion.span
                custom={2}
                initial="hidden"
                animate="show"
                variants={line}
                className="block title-rainbow"
              >
                <T en={t2en}>{t2}</T>
              </motion.span>
            </h1>

            <motion.p
              custom={3}
              initial="hidden"
              animate="show"
              variants={line}
              className="mt-8 text-lg sm:text-xl text-bone/70 max-w-2xl leading-relaxed"
            >
              <T en={h.lead.en}>{h.lead.de}</T>
            </motion.p>

            <motion.div
              custom={4}
              initial="hidden"
              animate="show"
              variants={line}
              className="mt-10 flex flex-wrap gap-4 pointer-events-auto"
            >
              <a
                href={h.primaryCta.href}
                className="mono-label bg-neon hover:bg-neon-2 transition-colors text-white px-6 py-3 rounded-sm shadow-[0_0_40px_rgba(192,38,211,0.45)]"
              >
                <T en={h.primaryCta.label.en}>{h.primaryCta.label.de}</T>
              </a>
              <a
                href={h.secondaryCta.href}
                className="mono-label border border-white/15 hover:border-gold/60 text-bone px-6 py-3 rounded-sm transition-colors"
              >
                <T en={h.secondaryCta.label.en}>{h.secondaryCta.label.de}</T>
              </a>
            </motion.div>

            <motion.div
              custom={5}
              initial="hidden"
              animate="show"
              variants={line}
              className="mt-16 grid grid-cols-1 sm:grid-cols-4 gap-px bg-white/5 border border-white/10 rounded-xl overflow-hidden max-w-4xl"
            >
              {h.stats.map((s) => (
                <div key={s.label} className="bg-white/5 px-6 py-6 backdrop-blur-sm">
                  <div className="font-display font-bold text-3xl text-gold text-glow-gold">
                    {liveValue(s.label.de) ?? s.value.de}
                  </div>
                  <div className="mono-label text-bone/50 mt-2"><T en={s.label.en}>{s.label.de}</T></div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* 3D-Hologramm-Erde: absolut rechts, füllt die ganze Hero-Höhe inkl. unterem Teil (nur lg+) */}
      <div
        className="absolute inset-y-0 right-0 hidden lg:block w-[38%] xl:w-[34%] pointer-events-none -z-0"
        aria-hidden="true"
      >
        <HoloEarthLazy />
      </div>

      <motion.div
        style={{ y: useTransform(scrollY, [0, 800], [0, 60]) }}
        className="absolute bottom-8 right-8 hidden lg:block mono-label text-bone/30"
      >
        SCROLL ↓
      </motion.div>
    </section>
  )
}
