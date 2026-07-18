import { useRef } from "react"
import { motion } from "framer-motion"
import { site } from "../../data/content"
import { asset } from "../../lib/asset"
import { EASE } from "../motion/variants"
import { useScrollRevealStage } from "../motion/ScrollRevealStage"
import { T } from "../RunenText"

// Scroll-Linked Enthüllung mit PIN (gleiche Technik wie SecretWeapon):
// Die Sektion pinnt sich (sticky), während man scrollt — die Seite "steht still",
// und der Effekt spielt sich vor Augen ab: der große, opake Text-Container wandert
// nach oben raus, das Schlacht-Bild (in einer gestapelten Spalte mit der Figcaption)
// wird darunter komplett sichtbar. Die Figcaption liegt immer VOR dem Bild (z-30 > z-10).
export default function Battle() {
  const s = site.battleMeta
  const ref = useRef(null)
  const {
    imgY,
    imgScale,
    imgOpacity,
    panelY,
    panelOpacity,
    captionY,
    captionOpacity,
    glowShadow,
    imgFilter,
  } = useScrollRevealStage(ref)

  return (
    <section id="schlacht" ref={ref} className="relative bg-ink/10 border-y border-white/5">
      <div className="absolute inset-0 hud-grid opacity-40" aria-hidden="true" />

      {/* PIN-BÜHNE: sticky, füllt Viewport, läuft über lange Scroll-Strecke ab */}
      <div className="relative h-[320vh]">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-5xl mx-auto px-5 sm:px-8 h-full flex items-center justify-center">
            {/* REVEAL-SPALTE (unter dem Panel): Bild + Figcaption gestapelt, am Ende komplett sichtbar */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
              <p className="mono-label text-neon"><T en={s.eyebrow.en}>{s.eyebrow.de}</T></p>

              <motion.div
                style={{ y: imgY, scale: imgScale, opacity: imgOpacity, filter: imgFilter }}
                className="relative z-10 flex justify-center"
              >
                <motion.div
                  style={{ boxShadow: glowShadow }}
                  className="relative rounded-2xl overflow-hidden border border-white/10 w-full max-w-3xl"
                >
                  <img
                    src={asset(site.battle)}
                    alt="Epic battle scene: white mouse mechs vs. red bear mechs in a devastated metropolis"
                    className="w-full h-[48vh] sm:h-[54vh] object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />
                  <div className="absolute inset-0 bg-gradient-to-br from-neon/10 via-transparent to-cyan/10 mix-blend-screen" />

                  {/* HUD-Fraktions-Marker */}
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 mono-label text-bone/90 border border-white/20 bg-ink/50 backdrop-blur px-3 py-1.5 rounded-sm">
                    <span className="w-2 h-2 rounded-full bg-neon" /> MILCHMÄUSE — LINKS
                  </div>
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 mono-label text-bone/90 border border-white/20 bg-ink/50 backdrop-blur px-3 py-1.5 rounded-sm">
                    ERDBÄREN — RECHTS <span className="w-2 h-2 rounded-full bg-neon" />
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                style={{ y: captionY, opacity: captionOpacity }}
                className="relative z-30 -mt-6 sm:-mt-8 text-center max-w-3xl"
              >
                <p className="battle-caption text-bone/80 text-sm sm:text-base max-w-3xl leading-relaxed">
                  <T en={s.caption.en}>{s.caption.de}</T>
                </p>
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
