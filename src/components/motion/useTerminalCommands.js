import { useState, useCallback } from "react"

// Terminal-Befehle und deren Verarbeitung.
// Trennt die Command-Logik von der UI-Komponente für bessere Testbarkeit.
const KNOWN_COMMANDS = ["jesus"]

const GAME_URL = `${import.meta.env.BASE_URL}erdbaerdefense/`
const SHEPHERD_URL = `${import.meta.env.BASE_URL}shepherd.html`

export function useTerminalCommands() {
  const [lines, setLines] = useState([])
  const [current, setCurrent] = useState("")
  const [wrongCount, setWrongCount] = useState(0)
  const [warPrompt, setWarPrompt] = useState(false)

  const pushLines = useCallback((arr) => setLines((l) => [...l, ...arr]), [])

  const reset = useCallback(() => {
    setLines([])
    setCurrent("")
    setWrongCount(0)
    setWarPrompt(false)
  }, [])

  const submit = useCallback(() => {
    const v = current.trim().toLowerCase()
    if (!v) return

    // --- "go to war?" beantworten ---
    if (warPrompt) {
      if (v === "y") {
        window.open(GAME_URL, "_blank", "noopener")
        pushLines(["go to war? [y/n]", `> ${v}`, "// SPIEL WIRD GESTARTET... //"])
        setWarPrompt(false)
        setCurrent("")
        return
      }
      if (v === "n") {
        return "close"
      }
      // nur y/n gelten im War-Prompt
      setCurrent("")
      return
    }

    // --- bekannte Befehle ---
    if (v === "jesus") {
      window.open(SHEPHERD_URL, "_blank", "noopener")
      pushLines([v, "// geheimnis offenbart //"])
      setCurrent("")
      return
    }

    // --- unbekannter Befehl -> Zähler hoch ---
    if (!KNOWN_COMMANDS.includes(v)) {
      const next = wrongCount + 1
      setWrongCount(next)
      if (next >= 3) {
        pushLines([v, "// ZUGRIFF VERWEIGERT //", "go to war? [y/n]"])
        setWarPrompt(true)
      } else {
        pushLines([v, `// unbekannter befehl (${next}/3) //`])
      }
      setCurrent("")
      return
    }

    // valide (erweiterbar)
    pushLines([v])
    setCurrent("")
  }, [current, wrongCount, warPrompt, pushLines])

  return {
    lines,
    current,
    setCurrent,
    wrongCount,
    warPrompt,
    pushLines,
    reset,
    submit,
  }
}
