import { useEffect, useRef } from "react"
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion"
import RunenText from "./RunenText"
import { useTerminalCommands } from "./motion/useTerminalCommands"

// Runen-Text-Klasse für Terminal-Ausgabe (größer als die Mini-Runen in Cards)
const RUNEN_TEXT_CLASS = "text-xl sm:text-2xl"

export default function TerminalCard({ open, onClose }) {
  const shouldReduce = useReducedMotion()
  const {
    lines,
    current,
    setCurrent,
    warPrompt,
    reset,
    submit,
  } = useTerminalCommands()

  const inputRef = useRef(null)
  const logRef = useRef(null)

  // Autofokus beim Öffnen + Escape schließt + Reset beim Schließen.
  useEffect(() => {
    if (!open) {
      reset()
      return
    }
    const t = setTimeout(() => inputRef.current?.focus(), 60)
    const onKey = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey) }
  }, [open, onClose, reset])

  // Autoscroll ans Ende (bei neuer Zeile + live beim Tippen).
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [lines, current, open, warPrompt])

  const handleSubmit = () => {
    const result = submit()
    if (result === "close") onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <MotionConfig
          transition={{
            duration: shouldReduce ? 0 : 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            layout
            initial={{ height: 0, opacity: 0, y: -12 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -12 }}
            className="overflow-hidden"
          >
          <div
            className={
              "mx-5 sm:mx-8 mb-6 rounded-xl neon-border glass sheen " +
              "terminal-scanlines text-bone font-mono text-sm " +
              "flex flex-col h-[60vh] max-h-[70vh]"
            }
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-ink/40 mono-label text-cyan text-xs tracking-[0.2em]">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" aria-hidden="true" />
                <span>// TERMINAL //</span>
              </div>
              <button
                type="submit"
                aria-label="Terminal schließen"
                onClick={onClose}
                className="grid place-items-center w-6 h-6 rounded border border-white/15 text-bone/60 hover:text-bone hover:border-neon/50 transition-all"
              >
                <span className="text-xs leading-none">✕</span>
              </button>
            </div>

            {/* Log */}
            <div
              ref={logRef}
              onClick={() => inputRef.current?.focus()}
              className="flex-1 overflow-y-auto px-4 py-3 relative"
            >
              {lines.length === 0 && (
                <p className="text-bone/30 text-xs leading-relaxed">
                  // Knack den Code um das uralte Geheimnis zu offenbaren //
                </p>
              )}

              {/* Status-Zeile (runic) */}
              {lines.length > 0 && (
                <div className="flex items-center gap-2 text-cyan text-xs mono-label mb-2">
                  <span className="text-bone/40">bär</span>
                  <span className="text-bone/50">@</span>
                  <span className="text-bone/40">erdbären</span>
                  <span className="text-bone/60">:~ $</span>
                </div>
              )}

              {lines.map((l, i) => (
                <div key={i} className="flex items-center gap-2 mb-1">
                  {l.startsWith("go to war?") ? (
                    <span className="text-cyan text-lg font-bold tracking-wider animate-pulse">
                      {l}
                    </span>
                  ) : (
                    <RunenText text={l} className={RUNEN_TEXT_CLASS} />
                  )}
                </div>
              ))}

              {/* Aktuelle Eingabe (live als Runen) + Cursor */}
              <div className="flex items-center gap-1.5 mt-1">
                <RunenText text={current} className={RUNEN_TEXT_CLASS} />
                <span
                  className={
                    "inline-block bg-cyan rounded-sm animate-blink " +
                    (warPrompt ? "w-[0.6em] h-5" : "w-2.5 h-5")
                  }
                />
              </div>
            </div>

            {/* Verstecktes Eingabefeld: fängt Tastatur/Cursor ab, Rendering läuft oben als Runen. */}
            <input
              ref={inputRef}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
              onClick={(e) => e.currentTarget.select()}
              className="absolute opacity-0 -z-10 pointer-events-none"
              aria-label="Runen-Eingabe"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </motion.div>
        </MotionConfig>
      )}
    </AnimatePresence>
  )
}
