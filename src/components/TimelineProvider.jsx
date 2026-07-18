import { createContext, useContext, useState, useEffect, useCallback } from "react"

const TimelineContext = createContext({ phase: -1, start: () => {} })

export function TimelineProvider({ children }) {
  const [phase, setPhase] = useState(-1)
  const [started, setStarted] = useState(false)

  const start = useCallback(() => {
    setStarted(true)
    const delays = [0, 350, 700, 1050, 1450, 1850]
    const ids = delays.map((d) => setTimeout(() => setPhase((p) => p + 1), d))
    return () => ids.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (!started) return
    return start()
  }, [started, start])

  return (
    <TimelineContext.Provider value={{ phase, start }}>
      {children}
    </TimelineContext.Provider>
  )
}

export function useTimeline() {
  return useContext(TimelineContext)
}
