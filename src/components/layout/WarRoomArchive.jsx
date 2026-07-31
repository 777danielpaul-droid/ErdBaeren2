import { useState, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue } from "framer-motion"
import Reveal from "../motion/Reveal"
import { site } from "../../data/content"
import { EASE } from "../motion/variants"
import { useVotes, castVote } from "../../lib/votes"
import RunenText, { T } from "../RunenText"
import { useLang } from "../RunenContext"
import { useArchiveCardPosition } from "../motion/useArchiveCardPosition"

const FACTIONS = {
  erdbaeren: {
    name: "ERDBÄREN",
    nameEn: "EARTHBEARS",
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
    nameEn: "MILKICE",
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

function InterceptCard({ msg, delay, z }) {
  const [open, setOpen] = useState(false)
  const { mode } = useLang()
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useLayoutEffect(() => {
    const card = ref.current
    const grid = card && card.parentElement
    if (!grid) return
    if (!window.matchMedia("(min-width: 640px)").matches) return
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
          <span className="mono-label text-bone/35">{open ? (mode === "en" ? "DECRYPTED" : "DECHIFFRIERT") : (mode === "en" ? "▸ DECRYPT" : "▸ DECHIFFRIEREN")}</span>
        </div>
        <RunenText text={msg.cipher} className="text-2xl sm:text-3xl min-h-[4rem] sm:min-h-[4.5rem]" />
        <AnimatePresence initial={false}>
          {open && (
            <motion.p
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden text-bone/80 font-display text-lg italic border-t border-white/10 pt-4"
            >
              „{mode === "en" ? msg.plain.en : msg.plain.de}“
            </motion.p>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  )
}

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
        <p className="mono-label text-cyan mb-3"><T en={data.eyebrow.en}>{data.eyebrow.de}</T></p>
        <h3 className="font-display font-bold text-3xl sm:text-4xl tracking-tight"><T en={data.title.en}>{data.title.de}</T></h3>
        <p className="mt-3 text-sm text-bone/50"><T en={data.hint.en}>{data.hint.de}</T></p>
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

function ArchiveCard({ entry, index, count, progress }) {
  const cardRef = useRef(null)
  const { x, rotate, opacity } = useArchiveCardPosition(cardRef, index, count, progress)

  return (
    <motion.article
      ref={cardRef}
      style={{ x, rotate, opacity, zIndex: count - index }}
      className="rounded-xl neon-border glass p-6 hover:border-gold/40 transition-colors"
    >
      <div className="mono-label text-neon">{entry.code}</div>
      <h3 className="font-display font-semibold text-lg mt-3 text-bone"><T en={entry.title.en}>{entry.title.de}</T></h3>
      <p className="mt-3 text-sm text-bone/60 leading-relaxed"><T en={entry.text.en}>{entry.text.de}</T></p>
    </motion.article>
  )
}

export default function WarRoomArchive() {
  const [active, setActive] = useState("erdbaeren")
  const [busy, setBusy] = useState(false)
  const votes = useVotes()
  const f = FACTIONS[active]

  const handleVote = async (key) => {
    if (busy) return
    setBusy(true)
    try {
      await castVote(key)
      setActive(key)
    } catch {
      /* Fehler still — Status bleibt unverändert */
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

  const sector2Y = useTransform(scrollYProgress, [0.2, 0.55], ["100%", "0%"])

  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.25, 0.7, 0.25])
  const glowShadow = useTransform(glow, (g) => `0 0 ${30 + g * 70}px rgba(192,38,211,${g})`)

  return (
    <section ref={ref} id="kriegskonsole" className="relative phase-gated">
      <div className="relative h-[280vh]">
        <div className="sticky top-0 h-screen overflow-y-auto sm:overflow-hidden">

          <div className="absolute inset-0 z-10 bg-ink-soft border-y border-white/5 overflow-y-auto sm:overflow-hidden">
            <div className="absolute inset-0 hud-grid opacity-50" aria-hidden="true" />
            <div className="relative min-h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-start sm:justify-center py-12">
              <Reveal className="mb-8 text-center">
                <p className="mono-label text-neon mb-4">// KRIEGSKONSOLE // ECHTZEIT-SIM</p>
                <h2 className="font-display font-bold text-4xl sm:text-6xl tracking-tight">
                  <span className="glitch" data-text="WÄHLE DEINE FRAKTION" role="img" aria-label="Wähle deine Fraktion">
                    <T en="CHOOSE YOUR FACTION">WÄHLE DEINE FRAKTION</T>
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
                    {<T en={fac.nameEn}>{fac.name}</T>}
                  </button>
                ))}
              </div>
              <Reveal className="mb-8 text-center">
                <p className="mono-label text-bone/30">
                  <T en={votes.mine ? "// YOUR VOTE IS COUNTED · VOTE AGAIN TO SWITCH" : "// ONE VOTE PER FIGHTER · CAST IT IN THE DOSSIER"}>
                    {votes.mine
                      ? "// DEINE STIMME IST GEZÄHLT · WÄHLE ERNEUT ZUM WECHSELN"
                      : "// EINE STIMME PRO KÄMPFER · GIB SIE IM DOSSIER AB"}
                  </T>
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
                      <T en={f.nameEn}>{f.name}</T>
                    </h3>
                    <span className="mono-label text-bone/40">COMBAT-MATRIX v2.4</span>
                  </div>

                  <div className="space-y-5">
                    {f.stats.map((s) => (
                      <StatBar key={s.k} {...s} color={f.color} />
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="mono-label text-bone/40 mb-2"><T en="FORECAST">PROGNOSE</T></p>
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
                    <T en={votes.mine === active ? "YOUR VOTE ✓" : `VOTE FOR ${f.nameEn}`}>
                      {votes.mine === active ? "DEINE STIMME ✓" : `STIMME FÜR ${f.name}`}
                    </T>
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

          <motion.div
            id="archiv"
            style={{ y: sector2Y }}
            className="absolute inset-0 z-20 bg-ink-soft/10 border-t border-white/10 overflow-y-auto overflow-x-hidden archiv-scroll"
          >
            <div className="min-h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-center py-12">
              <Reveal className="mb-12" variant="up">
                <p className="mono-label text-gold mb-4"><T en={site.archive.eyebrow.en}>{site.archive.eyebrow.de}</T></p>
                <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight"><T en={site.archive.title.en}>{site.archive.title.de}</T></h2>
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

              <Intercepts data={site.archive.intercepts} />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
