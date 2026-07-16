import { motion, useScroll, useTransform } from "framer-motion"
import { site } from "../../data/content"
import { T } from "../PhyrexianText"

export default function Footer() {
  const f = site.footer

  // Scroll-Linked: Border-Glow wächst, wenn man zum Footer scrollt.
  const { scrollYProgress } = useScroll({ offset: ["start end", "end end"] })
  const borderGlow = useTransform(
    scrollYProgress,
    [0, 1],
    ["0 0 0px rgba(192,38,211,0)", "0 0 30px rgba(192,38,211,0.6)"]
  )

  return (
    <motion.footer
      style={{ borderTopColor: "rgba(192,38,211,1)", boxShadow: borderGlow }}
      className="border-t-4 bg-ink"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl leading-none" aria-hidden="true">🐻</span>
          <span className="font-display font-bold tracking-[0.18em] text-sm">
            <T en={site.brand.en}>{site.brand.de}</T>
          </span>
        </div>

        <nav className="flex items-center gap-6 sm:gap-10" aria-label="Footer">
          {f.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-bone/70 hover:text-neon transition-colors text-sm font-medium tracking-wide"
            >
              <T en={l.label.en}>{l.label.de}</T>
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/5">
        <p className="max-w-7xl mx-auto px-5 sm:px-8 py-5 mono-label text-bone/35">
          <T en={f.note.en}>{f.note.de}</T>
        </p>
      </div>
    </motion.footer>
  )
}
