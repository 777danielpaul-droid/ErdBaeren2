import { motion, useScroll, useTransform } from "framer-motion"
import { EASE } from "../motion/variants"
import { site } from "../../data/content"
import { useVotes } from "../../lib/votes"

const NEON = ["#c026d3", "#7c3aed", "#22d3ee", "#c9a227"]

function HeroGrid() {
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

export default function Hero() {
  const h = site.hero
  const [t1, t2] = h.title.split("\n")
  const votes = useVotes()

  // Live-Votes ersetzen die statischen Zähler: Widerstand=Erdbären, Unterdrücker=Milchmäuse.
  const liveValue = (label) => {
    if (label === "Der Widerstand") return String(votes.erdbaeren)
    if (label === "Unterdrücker") return String(votes.milchmaeuse)
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
        className="absolute top-24 right-[-6rem] w-[28rem] h-[28rem] rounded-full bg-neon/25 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-20 w-full pointer-events-none">
        <motion.p
          custom={0}
          initial="hidden"
          animate="show"
          variants={line}
          className="mono-label text-neon mb-6"
        >
          {h.eyebrow}
        </motion.p>

        <h1 className="font-display font-bold leading-[0.95] tracking-tight text-5xl sm:text-7xl lg:text-8xl max-w-4xl">
          <motion.span custom={1} initial="hidden" animate="show" variants={line} className="block">
            {t1}
          </motion.span>
          <motion.span
            custom={2}
            initial="hidden"
            animate="show"
            variants={line}
            className="block neon-text"
          >
            {t2}
          </motion.span>
        </h1>

        <motion.p
          custom={3}
          initial="hidden"
          animate="show"
          variants={line}
          className="mt-8 text-lg sm:text-xl text-bone/70 max-w-2xl leading-relaxed"
        >
          {h.lead}
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
            {h.primaryCta.label}
          </a>
          <a
            href={h.secondaryCta.href}
            className="mono-label border border-white/15 hover:border-gold/60 text-bone px-6 py-3 rounded-sm transition-colors"
          >
            {h.secondaryCta.label}
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
                {liveValue(s.label) ?? s.value}
              </div>
              <div className="mono-label text-bone/50 mt-2">{s.label}</div>
            </div>
          ))}
        </motion.div>
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
