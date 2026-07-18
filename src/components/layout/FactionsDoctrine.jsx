import { useRef } from "react"
import { motion } from "framer-motion"
import { site } from "../../data/content"
import { asset } from "../../lib/asset"
import { stagger, EASE } from "../motion/variants"
import { T } from "../RunenText"

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

// Normale Section, KEIN Sticky — verhindert Scroll-Blockade für darunterliegende Reveal-Sektionen.
export default function FactionsDoctrine() {
  const ref = useRef(null)

  return (
    <section ref={ref} id="fraktionen" className="relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
        <p className="mono-label text-gold mb-4">// FRAKTIONEN</p>
        <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-12">
          <T en="Two powers. One Earth.">Zwei Mächte. Eine Erde.</T>
        </h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {site.factions.map((f, index) => {
            const a = ACCENT[f.accent]
            return (
              <motion.article
                key={f.id}
                variants={{
                  hidden: { opacity: 0, y: 48 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
                }}
                whileHover={{ y: -6, transition: { duration: 0.4, ease: EASE } }}
                className={`group relative rounded-2xl neon-border glass sheen overflow-hidden hover:${a.border} transition-colors`}
              >
                <div className="relative h-60 sm:h-72 overflow-hidden">
                  <img
                    src={asset(f.image)}
                    alt={f.name.de}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-90 group-hover:scale-[1.04] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/30 to-transparent" />
                  <div className={`absolute top-4 left-4 mono-label ${a.tag} px-3 py-1 rounded-sm bg-ink/60`}>
                    {f.id.toUpperCase()}
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="font-display font-bold text-2xl tracking-tight"><T en={f.name.en}>{f.name.de}</T></h3>
                  <p className={`mono-label ${a.tag} mt-1`}><T en={f.role.en}>{f.role.de}</T></p>
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
