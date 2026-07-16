import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { site } from "../../data/content"
import { asset } from "../../lib/asset"
import { EASE } from "../motion/variants"
import { T } from "../RunenText"

// Scroll-Linked Enthüllung mit PIN:
// Die Sektion pinnt sich (sticky), während man scrollt — die Seite "steht still",
// und der Effekt spielt sich vor Augen ab: der große, opake Text-Container wandert
// nach oben raus, das Herz-Bild (in einer gestapelten Spalte mit der Caption) wird
// darunter komplett sichtbar und bekommt den Fokus.
export default function SecretWeapon() {
  const s = site.secret
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  // Bild: subtil nach unten gleitend ("aus dem Container heraus"), wird scharf + sichtbar.
  const imgY = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "4%", "10%"])
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.03, 1.0])
  const imgOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.0, 0.7, 1])
  const imgBlur = useTransform(scrollYProgress, [0, 0.32], [18, 0])

  // Text-Container: groß + opak (Glass-Stil wie die anderen Blöcke), wandert nach oben raus.
  const panelY = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "-46%", "-58%"])
  const panelOpacity = useTransform(scrollYProgress, [0, 0.45, 0.7], [1, 0.9, 0])

  // Caption: erscheint unter dem (nun voll sichtbaren) Bild.
  const captionY = useTransform(scrollYProgress, [0.5, 1], ["36%", "0%"])
  const captionOpacity = useTransform(scrollYProgress, [0.55, 0.8, 1], [0, 0.6, 1])

  // Glow wächst mit Fokus.
  const glow = useTransform(scrollYProgress, [0.3, 0.7, 1], [0.15, 0.5, 0.72])
  const glowShadow = useTransform(glow, (g) => `0 0 ${30 + g * 80}px rgba(192,38,211,${g})`)
  const imgFilter = useTransform(imgBlur, (b) => `blur(${b}px)`)

  return (
    <section id="geheimwaffe" ref={ref} className="relative bg-ink border-y border-white/5">
      <div className="absolute inset-0 hud-grid opacity-40" aria-hidden="true" />

      {/* PIN-BÜHNE: sticky, füllt Viewport, läuft über lange Scroll-Strecke ab */}
      <div className="relative h-[320vh]">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-5xl mx-auto px-5 sm:px-8 h-full flex items-center justify-center">
            {/* REVEAL-SPALTE (unter dem Panel): Bild + Caption gestapelt, am Ende komplett sichtbar */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
              <p className="mono-label text-gold">// GEHEIMWAFFE // KLASSIFIZIERT</p>

              <motion.div
                style={{ y: imgY, scale: imgScale, opacity: imgOpacity, filter: imgFilter }}
                className="relative z-10 flex justify-center"
              >
                <motion.div
                  style={{ boxShadow: glowShadow }}
                  className="relative rounded-2xl overflow-hidden border border-white/10 w-full max-w-2xl"
                >
                  <img
                    src={asset("/erdbaer-herz.jpg")}
                    alt="Das goldene Herz — die geheime Waffe der Erdbären, ein rubinroter Mechanismus"
                    className="w-full h-[48vh] sm:h-[54vh] object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />
                  <div className="absolute inset-0 bg-gradient-to-br from-neon/10 via-transparent to-gold/10 mix-blend-screen" />
                </motion.div>
              </motion.div>

              <motion.div
                style={{ y: captionY, opacity: captionOpacity }}
                className="relative z-30 -mt-6 sm:-mt-8 text-center max-w-2xl"
              >
                <h3 className="font-display font-bold text-4xl sm:text-6xl neon-text">
                  <T en={s.name.en}>{s.name.de}</T>
                </h3>
                <p className="mt-3 text-bone/80 text-lg max-w-xl mx-auto"><T en={s.subtitle.en}>{s.subtitle.de}</T></p>
                <p className="mt-5 text-bone/65 leading-relaxed max-w-2xl mx-auto"><T en={s.body.en}>{s.body.de}</T></p>
              </motion.div>
            </div>

            {/* TEXT-CONTAINER: GROSS + OPAK (Glass-Stil), verdeckt das Bild, wandert nach oben raus */}
            <motion.div
              style={{ y: panelY, opacity: panelOpacity }}
              className="relative z-20 mx-auto max-w-3xl"
            >
              <div className="rounded-2xl neon-border glass sheen p-10 sm:p-14 text-center">
                <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight leading-[1.05]">
                  <T en={s.titleCover.en}>{s.titleCover.de}</T>
                </h2>
                <p className="mt-6 text-bone/75 leading-relaxed text-lg"><T en={s.coverBody.en}>{s.coverBody.de}</T></p>
                <p className="mono-label text-neon mt-8 text-sm tracking-[0.2em]">
                  ↓ SCROLLE, UM ZU ENTHÜLLEN
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
