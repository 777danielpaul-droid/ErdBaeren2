import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { site } from "../../data/content"
import { asset } from "../../lib/asset"
import { stagger, EASE } from "../motion/variants"
import { T } from "../PhyrexianText"

// Statische Klassen-Map (Tailwind v4 JIT erkennt keine dynamischen Template-Strings)
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

// STACKING-PUSH: Sektor 1 (Fraktionen) liegt anfangs voll sichtbar/opak.
// Beim Scrollen schiebt sich Sektor 2 (Doktrin) von unten hoch und landet
// VOR Sektor 1 (z-20 > z-10) — komplett opak, OHNE Blur/Fade.
export default function FactionsDoctrine() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  // Sektor 2: von unten (100%) hoch auf 0% — Start/Ende je kurz gehalten.
  const sector2Y = useTransform(scrollYProgress, [0.1, 0.9], ["100%", "0%"])

  return (
    <section ref={ref} id="fraktionen" className="relative">
      {/* PIN-BÜHNE */}
      <div className="relative h-[200vh]">
        <div className="sticky top-0 h-screen overflow-y-auto sm:overflow-hidden">

          {/* SEKTOR 1 — FRAKTIONEN (Basis, z-10, opak) */}
          <div className="absolute inset-0 z-10 bg-ink overflow-y-auto sm:overflow-hidden">
            <div className="min-h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-start sm:justify-center py-12">
              <p className="mono-label text-gold mb-4">// FRAKTIONEN</p>
              <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-12">
                <T>Zwei Mächte. Eine Erde.</T>
              </h2>

              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {site.factions.map((f) => {
                  const a = ACCENT[f.accent]
                  return (
                    <motion.article
                      key={f.id}
                      variants={{
                        hidden: { opacity: 0, y: 36 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                      }}
                      whileHover={{ y: -6, transition: { duration: 0.4, ease: EASE } }}
                      className={`group relative rounded-2xl neon-border glass sheen overflow-hidden hover:${a.border} transition-colors`}
                    >
                      <div className="relative h-60 sm:h-72 overflow-hidden">
                        <img
                          src={asset(f.image)}
                          alt={f.name}
                          loading="lazy"
                          className="w-full h-full object-cover opacity-90 group-hover:scale-[1.04] transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/30 to-transparent" />
                        <div
                          className={`absolute top-4 left-4 mono-label ${a.tag} px-3 py-1 rounded-sm bg-ink/60`}
                        >
                          {f.id.toUpperCase()}
                        </div>
                      </div>

                      <div className="p-7">
                        <h3 className="font-display font-bold text-2xl tracking-tight"><T>{f.name}</T></h3>
                        <p className={`mono-label ${a.tag} mt-1`}><T>{f.role}</T></p>
                        <p className={`mt-4 text-bone/70 italic border-l-2 ${a.border} pl-4`}>
                          „<T>{f.quote}</T>“
                        </p>
                        <ul className="mt-5 space-y-2.5">
                          {f.traits.map((t) => (
                            <li key={t} className="flex gap-3 text-sm text-bone/75">
                              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${a.dot} shrink-0`} />
                              <T>{t}</T>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.article>
                  )
                })}
              </motion.div>
            </div>
          </div>

          {/* SEKTOR 2 — DOKTRIN (schiebt von unten hoch, z-20, opak, KEINE Transparenz) */}
          <motion.div
            id="doktrin"
            style={{ y: sector2Y }}
            className="absolute inset-0 z-20 bg-ink-soft border-t border-white/10"
          >
            <div className="h-full max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 flex flex-col justify-center py-12">
              <div className="lg:col-span-5">
                <p className="mono-label text-neon mb-4"><T>{site.doctrine.eyebrow}</T></p>
                <h2 className="font-display font-bold text-4xl sm:text-5xl leading-[1.02] tracking-tight whitespace-pre-line">
                  <T>{site.doctrine.title}</T>
                </h2>
                <p className="mt-6 text-bone/65 leading-relaxed"><T>{site.doctrine.body}</T></p>
              </div>

              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="lg:col-span-7 space-y-4"
              >
                {site.doctrine.points.map((p) => (
                  <motion.div
                    key={p.k}
                    variants={{
                      hidden: { opacity: 0, x: 32 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
                    }}
                    whileHover={{ x: 6, transition: { duration: 0.35, ease: EASE } }}
                    className="flex gap-5 rounded-xl neon-border glass p-6"
                  >
                    <span className="font-display font-bold text-2xl text-gold/80 shrink-0 w-12">
                      {p.k}
                    </span>
                    <div>
                      <h3 className="font-display font-semibold text-lg text-bone"><T>{p.t}</T></h3>
                      <p className="mt-1.5 text-bone/65 text-sm leading-relaxed"><T>{p.d}</T></p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
