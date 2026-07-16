import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PhyrexianText from "./PhyrexianText"

// Terminal-Gimmick: Klick auf „Terminal" öffnet ein Overlay. Der User tippt
// Klartext — jede Zeile wird LIVE als Runenschrift (PhyrexianText-Renderer)
// übersetzt. Enter = Zeile ins Log; Escape / X schließt.
export default function TerminalModal({ open, onClose }) {
  const [lines, setLines] = useState([])
  const [current, setCurrent] = useState("")
  const inputRef = useRef(null)
  const logRef = useRef(null)

  // Autofokus beim Öffnen + Escape schließt + beim Schließen Eingabe zurücksetzen.
  useEffect(() => {
    if (!open) {
      setLines([])
      setCurrent("")
      return
    }
    const t = setTimeout(() => inputRef.current?.focus(), 60)
    const onKey = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey) }
  }, [open, onClose])

  // Autoscroll ans Ende (bei neuer Zeile + live beim Tippen).
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [lines, current, open])

  const submit = () => {
    const v = current.trim()
    if (!v) return
    // Geheimbefehl: öffnet das verborgene Bild in einem neuen Tab.
    if (v.toLowerCase() === "jesus is the shepherd") {
      window.open(`${import.meta.env.BASE_URL}shepherd-secret.jpg`, "_blank", "noopener")
    }
    setLines((l) => [...l, v])
    setCurrent("")
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl h-[70vh] rounded-xl border border-cyan/30 bg-ink-soft shadow-2xl overflow-hidden flex flex-col"
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Titelzeile */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-ink">
              <span className="mono-label text-cyan text-xs tracking-[0.2em]">TERMINAL</span>
              <button
                onClick={onClose}
                aria-label="Terminal schließen"
                className="text-bone/60 hover:text-bone text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {/* Log + live Eingabe */}
            <div
              ref={logRef}
              onClick={() => inputRef.current?.focus()}
              className="flex-1 overflow-y-auto px-4 py-3 font-mono text-sm space-y-3 cursor-text"
            >
              {lines.length === 0 && (
                <p className="text-bone/30 text-xs leading-relaxed">
                  //Knack den Code um das uralte Geheimnis zu offenbaren//
                </p>
              )}
              <p className="text-cyan text-xs leading-relaxed mt-2">User/Secret:</p>
              {lines.map((l, i) => (
                <div key={i} className="flex gap-3 items-center flex-wrap">
                  <PhyrexianText text={l} className="text-xl sm:text-2xl" />
                </div>
              ))}
              {/* Aktuelle Eingabe (live als Runen) + Cursor */}
              <div className="flex gap-3 items-center flex-wrap">
                <PhyrexianText text={current} className="text-xl sm:text-2xl" />
                <span className="inline-block w-2.5 h-5 bg-cyan/80 animate-pulse ml-0.5" />
              </div>
            </div>

            {/* Verstecktes Eingabefeld: fängt Tastatur/Cursor ab, Rendering läuft oben als Runen. */}
            <input
              ref={inputRef}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit() } }}
              className="absolute opacity-0 -z-10 pointer-events-none"
              aria-label="Runen-Eingabe"
              autoComplete="off"
              spellCheck={false}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
