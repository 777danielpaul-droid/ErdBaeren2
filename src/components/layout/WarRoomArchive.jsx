import { useState, useRef, useLayoutEffect, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue } from "framer-motion"
import Reveal from "../motion/Reveal"
import { site } from "../../data/content"
import { EASE } from "../motion/variants"
import { useVotes, castVote } from "../../lib/votes"
import PhyrexianText, { T } from "../PhyrexianText"

const FACTIONS = {
  erdbaeren: {
    name: "ERDBÄREN",
    color: "#c026d3",
    stats: [
      { k: "WIDERSTAND", v: 98 },
      { k: "WENDE-KRAFT", v: 100 },
      { k: "BEFREIUNGSTEMPO", v: 97 },
      { k: "GEHORSAM", v: 9 },
    ],
    verdict: "DIE WENDE — DIE HERREN SIND ZU LANGSAM",
  },
  milchmaeuse: {
    name: "MILCHMÄUSE",
    color: "#22d3ee",
    stats: [
      { k: "ALTE HERRSCHAFT", v: 99 },
      { k: "MUSTER-TREUE", v: 96 },
      { k: "REAKTIONS-VERZUG", v: 88 },
      { k: "NEUER WEG", v: 3 },
    ],
    verdict: "DAS ALTE BRICHT — WO NICHTS NEUES REGT",
  },
}

function StatBar({ k, v, color }) {
  return (
    <div>
      <div className="flex justify-between mono-label text-bone/60 mb-1">
        <span>{k}</span>
        <span style={{ color }}>{v}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${v}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="h-full rounded-full bar-pulse"
          style={{ background: color }}
        />
      </div>
    </div>
  )
}

// Eine abgefangene Nachricht: zeigt Phyrexian-Glyphen; Klick klappt Klartext auf.
// Beim Sichtbarwerden "dealt" sich die Karte ein einmal aus der Grid-Mitte in
// ihr Feld. x/y = Start-Versatz zur Grid-Mitte (nur sm+, mobil kein Deal).
function InterceptCard({ msg, delay, z }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useLayoutEffect(() => {
    const card = ref.current
    const grid = card && card.parentElement
    if (!grid) return
    if (!window.matchMedia("(min-width: 640px)").matches) return // mobil: kein Deal
    // offsetLeft/Top sind layout-basiert → unabhängig vom Transform.
    const gcx = grid.clientWidth / 2
    const gcy = grid.clientHeight / 2
    const ccx = card.offsetLeft + card.offsetWidth / 2
    const ccy = card.offsetTop + card.offsetHeight / 2
    x.set(gcx - ccx)
    y.set(gcy - ccy)
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      style={{ x, y, zIndex: z }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left rounded-xl neon-border glass p-6 transition-colors hover:border-cyan/40 focus:outline-none focus:border-cyan/60"
        aria-expanded={open}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="mono-label text-cyan">{msg.code}</span>
          <span className="mono-label text-bone/35">{open ? "DECHIFFRIERT" : "▸ DECHIFFRIEREN"}</span>
        </div>
        <PhyrexianText text={msg.cipher} className="text-2xl sm:text-3xl min-h-[4rem] sm:min-h-[4.5rem]" />
        <AnimatePresence initial={false}>
          {open && (
            <motion.p
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden text-bone/80 font-display text-lg italic border-t border-white/10 pt-4"
            >
              „{msg.plain}“
            </motion.p>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  )
}

// Deal-Reihenfolge (einmalig beim Sichtbarwerden):
// 118 zuerst (nach oben), dann 207 + 451 gleichzeitig (nach rechts) und 338
// formiert das Schema. z: 118 liegt HINTER 338 im gestapelten Start.
const DEAL = {
  "INT-118": { delay: 0.2, z: 10 },
  "INT-207": { delay: 0.95, z: 15 },
  "INT-338": { delay: 0.95, z: 20 },
  "INT-451": { delay: 0.95, z: 15 },
}

function Intercepts({ data }) {
  if (!data) return null
  return (
    <div className="mt-16">
      <Reveal className="mb-8" variant="up">
        <p className="mono-label text-cyan mb-3"><T>{data.eyebrow}</T></p>
        <h3 className="font-display font-bold text-3xl sm:text-4xl tracking-tight"><T>{data.title}</T></h3>
        <p className="mt-3 text-sm text-bone/50"><T>{data.hint}</T></p>
      </Reveal>
      <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.messages.map((m) => {
          const d = DEAL[m.code] || { delay: 0.4, z: 10 }
          return <InterceptCard key={m.code} msg={m} delay={d.delay} z={d.z} />
        })}
      </div>
    </div>
  )
}

// FÄCHER-EFFEKT (nur lg+): Die 4 Archiv-Karten liegen anfangs KOMPLETT übereinander
// (nur die oberste sichtbar), nachdem der Archiv-Sektor voll steht (ab 55%). Beim
// Weiterscrollen (62→98%) fahren die Karten von der Container-Mitte in ihre
// Grid-Positionen auseinander. Zentrierung in px (kein %-Overflow → keine Scrollbar).
function ArchiveCard({ entry, index, count, progress }) {
  const cardRef = useRef(null)
  const x = useMotionValue(0)
  const opacity = useMotionValue(0)

  // Scroll-gebundener Fächer (nur lg+): gestapelt (x=center) bis 0.62, dann in
  // Grid-Slot (0) bis 0.98. Eigener scroll-Listener + progress.get() → robust
  // gegen framer-motion Transform-Timing. center = px-Versatz zur Grid-Mitte.
  useEffect(() => {
    let raf = 0
    const apply = () => {
      raf = 0
      const card = cardRef.current
      const grid = card && card.parentElement
      if (!grid) return
      const stacked = window.matchMedia("(min-width: 1024px)").matches
      // Natürliche Kartenposition (ohne aktuellen Transform x).
      let center = 0
      if (stacked) {
        const g = grid.getBoundingClientRect()
        const r = card.getBoundingClientRect()
        const naturalLeft = r.left - x.get()
        center = g.left + g.width / 2 - (naturalLeft + r.width / 2)
      }
      const p = progress.get()
      // Stapel bis 0.70 halten, dann sanft (ease-out) bis 0.97 auseinanderfahren.
      // Mehr Scroll-Raum (Pin-Bühne 280vh) + Ease → wirkt deutlich langsamer.
      let factor
      if (p < 0.70) factor = 1
      else if (p > 0.97) factor = 0
      else {
        const t = (p - 0.70) / (0.97 - 0.70) // 0..1 linear
        factor = 1 - Math.pow(t, 0.6)        // ease-out: langsam startend
      }
      x.set(factor * center)
      opacity.set(p < 0.62 ? Math.max(0, (p - 0.55) / 0.07) : 1)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }
    window.addEventListener("scroll", onScroll, { passive: true })
    apply() // initial
    window.addEventListener("resize", apply)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", apply)
    }
  }, [progress, x, opacity])

  const rel = index - (count - 1) / 2
  const rotate = useTransform(progress, [0.70, 0.97], [rel * 3, 0])
  return (
    <motion.article
      ref={cardRef}
      style={{ x, rotate, opacity, zIndex: count - index }}
      className="rounded-xl neon-border glass p-6 hover:border-gold/40 transition-colors"
    >
      <div className="mono-label text-neon">{entry.code}</div>
      <h3 className="font-display font-semibold text-lg mt-3 text-bone"><T>{entry.title}</T></h3>
      <p className="mt-3 text-sm text-bone/60 leading-relaxed"><T>{entry.text}</T></p>
    </motion.article>
  )
}

// STACKING-PUSH: Sektor 1 (Kriegskonsole) liegt anfangs voll sichtbar/opak.
// Beim Scrollen schiebt sich Sektor 2 (Archiv) von unten hoch und landet
// VOR Sektor 1 (z-20 > z-10) — komplett opak, OHNE Blur/Fade.
export default function WarRoomArchive() {
  const [active, setActive] = useState("erdbaeren")
  const [busy, setBusy] = useState(false)
  const votes = useVotes()
  const f = FACTIONS[active]

  // Klick = Fraktion wählen + Stimme abgeben. Server dedupliziert per IP
  // (eine Stimme; erneuter Klick auf andere Fraktion bucht um).
  const handleVote = async (key) => {
    setActive(key)
    if (busy) return
    setBusy(true)
    try {
      await castVote(key)
    } catch {
      /* Fehler still: Anzeige bleibt beim letzten bekannten Stand */
    } finally {
      setBusy(false)
    }
  }

  const ref = useRef(null)
  const archiveGridRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  // Sektor 2: von unten (100%) hoch auf 0% — früh fertig (bei 55%), damit der
  // Archiv-Sektor voll sichtbar steht, BEVOR der Fächer-Effekt einsetzt.
  const sector2Y = useTransform(scrollYProgress, [0.2, 0.55], ["100%", "0%"])

  // Scroll-Linked Glow der Combat-Matrix.
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.25, 0.7, 0.25])
  const glowShadow = useTransform(glow, (g) => `0 0 ${30 + g * 70}px rgba(192,38,211,${g})`)

  return (
    <section ref={ref} id="kriegskonsole" className="relative">
      {/* PIN-BÜHNE */}
      <div className="relative h-[280vh]">
        <div className="sticky top-0 h-screen overflow-y-auto sm:overflow-hidden">

          {/* SEKTOR 1 — KRIEGSKONSOLE (Basis, z-10, opak) */}
          <div className="absolute inset-0 z-10 bg-ink-soft border-y border-white/5 overflow-y-auto sm:overflow-hidden">
            <div className="absolute inset-0 hud-grid opacity-50" aria-hidden="true" />
            <div className="relative min-h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-start sm:justify-center py-12">
              <Reveal className="mb-8 text-center">
                <p className="mono-label text-neon mb-4">// KRIEGSKONSOLE // ECHTZEIT-SIM</p>
                <h2 className="font-display font-bold text-4xl sm:text-6xl tracking-tight">
                  <span className="glitch" data-text="WÄHLE DEINE FRAKTION" role="img" aria-label="Wähle deine Fraktion">
                    WÄHLE DEINE FRAKTION
                  </span>
                </h2>
              </Reveal>

              <div className="flex flex-wrap justify-center gap-4 mb-4">
                {Object.entries(FACTIONS).map(([key, fac]) => (
                  <button
                    key={key}
                    onClick={() => setActive(key)}
                    className={`mono-label px-6 py-3 rounded-sm border transition-all ${
                      active === key
                        ? "border-neon bg-neon/15 text-bone"
                        : "border-white/15 text-bone/50 hover:text-bone/80"
                    }`}
                    style={active === key ? { boxShadow: `0 0 30px ${fac.color}55` } : {}}
                  >
                    {fac.name}
                  </button>
                ))}
              </div>
              <Reveal className="mb-8 text-center">
                <p className="mono-label text-bone/30">
                  <T>{votes.mine
                    ? "// DEINE STIMME IST GEZÄHLT · WÄHLE ERNEUT ZUM WECHSELN"
                    : "// EINE STIMME PRO KÄMPFER · GIB SIE IM DOSSIER AB"}</T>
                </p>
              </Reveal>

              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="max-w-3xl mx-auto w-full rounded-2xl neon-border glass sheen p-8 relative overflow-hidden"
                style={{ boxShadow: glowShadow }}
              >
                <div
                  className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-40"
                  style={{ background: f.color }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-display font-bold text-2xl" style={{ color: f.color }}>
                      {f.name}
                    </h3>
                    <span className="mono-label text-bone/40">COMBAT-MATRIX v2.4</span>
                  </div>

                  <div className="space-y-5">
                    {f.stats.map((s) => (
                      <StatBar key={s.k} {...s} color={f.color} />
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="mono-label text-bone/40 mb-2"><T>PROGNOSE</T></p>
                    <p
                      className="font-display font-bold text-lg glitch"
                      data-text={f.verdict}
                      style={{ color: f.color }}
                    >
                      {f.verdict}
                    </p>
                  </div>

                  <button
                    onClick={() => handleVote(active)}
                    disabled={busy}
                    className="mt-8 w-full mono-label px-6 py-4 rounded-sm border transition-all disabled:opacity-60 flex items-center justify-center gap-3"
                    style={{
                      borderColor: f.color,
                      color: f.color,
                      background: `${f.color}12`,
                      boxShadow: votes.mine === active ? `0 0 30px ${f.color}55` : "none",
                    }}
                  >
                    <T>{votes.mine === active ? "DEINE STIMME ✓" : `STIMME FÜR ${f.name}`}</T>
                    <span className="tabular-nums text-bone/90">
                      {active === "erdbaeren" ? votes.erdbaeren : votes.milchmaeuse}
                    </span>
                  </button>
                </div>
              </motion.div>

              <Reveal className="mt-8 text-center">
                <p className="mono-label text-bone/30">
                  &gt;&gt; SIMULATION LÄUFT · AKTUALISIERUNG ALLE 0.3s · ERDE-SEKTOR 0 «
                </p>
              </Reveal>
            </div>
          </div>

          {/* SEKTOR 2 — ARCHIV (schiebt von unten hoch, z-20, opak, KEINE Transparenz) */}
          <motion.div
            id="archiv"
            style={{ y: sector2Y }}
            className="absolute inset-0 z-20 bg-ink-soft border-t border-white/10 overflow-y-auto overflow-x-hidden archiv-scroll"
          >
            <div className="min-h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-center py-12">
              <Reveal className="mb-12" variant="up">
                <p className="mono-label text-gold mb-4"><T>{site.archive.eyebrow}</T></p>
                <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight">
                  <T>{site.archive.title}</T>
                </h2>
              </Reveal>

              <div ref={archiveGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {site.archive.entries.map((e, i) => (
                  <ArchiveCard
                    key={e.code}
                    entry={e}
                    index={i}
                    count={site.archive.entries.length}
                    progress={scrollYProgress}
                  />
                ))}
              </div>

              {/* ABGEFANGENE TRANSMISSIONEN (Phyrexian-Schrift, Klick dechiffriert) */}
              <Intercepts data={site.archive.intercepts} />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
