import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { site } from "../../data/content"
import { getInitialTheme, toggleTheme } from "../../lib/theme"
import { useLang } from "../RunenContext"
import { useTimeline } from "../TimelineProvider"
import TerminalModal from "../TerminalModal"

// Neon-Palette wie im Hero-Grid, ABER ohne cyan — cyan ist der Default,
// sonst würde ein zufälliges cyan beim Hover keinen sichtbaren Wechsel ergeben.
const NEON = ["#c026d3", "#7c3aed", "#c9a227"]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [termOpen, setTermOpen] = useState(false)
  // Theme-State für den Toggle-Button (Initial aus DOM lesen).
  const [theme, setTheme] = useState(() => getInitialTheme())
  const { mode, cycle: cycleLang } = useLang()
  // Pro Link eine zufällige Neon-Farbe, die beim Hover gesetzt wird.
  const [hover, setHover] = useState({})

  const { phase } = useTimeline()

  const randomNeon = (key) => setHover((h) => ({ ...h, [key]: NEON[(Math.random() * NEON.length) | 0] }))
  // Verlassen -> Default (türkis) wiederherstellen.
  const resetNeon = (key) => setHover((h) => ({ ...h, [key]: "#22d3ee" }))
  const onToggle = () => setTheme(toggleTheme())

  if (phase < 5) return null

  const onOpen = () => setOpen((v) => !v)
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <nav className="backdrop-blur-md bg-ink/40 border-b border-white/10 glass">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3 group">
            <span className="relative grid place-items-center w-8 h-8 rounded-md bg-neon/15 border border-neon/40">
              <span className="text-base leading-none">🐻</span>
            </span>
            <span className="font-display font-bold tracking-[0.18em] text-sm">
              {site.brand.de}
            </span>
          </a>

          <ul className="flex items-center gap-4 md:gap-8">
            {site.nav.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onMouseEnter={() => randomNeon(n.href)}
                  onMouseLeave={() => resetNeon(n.href)}
                  style={{ color: hover[n.href] || "#22d3ee" }}
                  className="mono-label text-cyan hover:text-cyan transition-colors"
                >
                  {n.label.de}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setTermOpen(true)}
            className="hidden md:inline-flex mono-label bg-ink text-cyan border border-cyan/50 hover:bg-cyan/10 transition-colors px-4 py-2 rounded-sm"
          >
            Terminal
          </button>

          <button
            type="button"
            aria-label={
              mode === "de"
                ? "Auf Englisch umschalten"
                : mode === "en"
                ? "In fremder Schrift anzeigen"
                : "Zu Deutsch wechseln"
            }
            onClick={cycleLang}
            className={`hidden md:grid place-items-center w-10 h-10 rounded-md border text-bone transition-colors ${
              mode === "runes" ? "border-neon/60 text-neon" : "border-white/10 hover:border-neon/50"
            }`}
          >
            <span className="text-lg leading-none">
              {mode === "de" ? "⌘" : mode === "en" ? "EN" : "᛭"}
            </span>
          </button>

          <button
            type="button"
            aria-label={theme === "dark" ? "Zu Light Mode wechseln" : "Zu Dark Mode wechseln"}
            onClick={onToggle}
            className="hidden md:grid place-items-center w-10 h-10 rounded-md border border-white/10 hover:border-neon/50 text-bone transition-colors"
          >
            <span className="text-lg leading-none">{theme === "dark" ? "☀" : "☾"}</span>
          </button>
          <button
            type="button"
            aria-label="Menü"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden grid place-items-center w-10 h-10 rounded-md border border-white/20 text-bone hover:border-neon/50"
          >
            <span className="text-xl leading-none">{open ? "✕" : "≡"}</span>
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-white/5 bg-ink/95"
            >
              <ul className="px-5 py-4 flex flex-col gap-3">
                {site.nav.map((n) => (
                  <li key={n.href}>
                    <a
                      href={n.href}
                      onMouseEnter={() => randomNeon(n.href)}
                      onMouseLeave={() => resetNeon(n.href)}
                      onClick={() => setOpen(false)}
                      style={{ color: hover[n.href] || "#22d3ee" }}
                      className="mono-label text-cyan"
                    >
                      {n.label.de}
                    </a>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => { setOpen(false); setTermOpen(true) }}
                    className="mono-label text-cyan"
                  >
                    Terminal
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <TerminalModal open={termOpen} onClose={() => setTermOpen(false)} />
    </motion.header>
  )
}
