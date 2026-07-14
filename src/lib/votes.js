// Live-Vote-Store: teilt Zählerstand zwischen Hero (Anzeige) und WarRoom (Buttons).
// Backend = Cloudflare Worker, Dedup serverseitig per IP-Hash.
import { useEffect, useState } from "react"

const API = "https://erdbaeren-votes.erdbaeren.workers.dev"

let state = { erdbaeren: 0, milchmaeuse: 0, mine: null, loaded: false }
const subs = new Set()
const set = (next) => {
  state = { ...state, ...next }
  subs.forEach((fn) => fn(state))
}

export async function loadCounts() {
  try {
    const r = await fetch(`${API}/counts`)
    const d = await r.json()
    set({ erdbaeren: d.erdbaeren, milchmaeuse: d.milchmaeuse, mine: d.mine, loaded: true })
  } catch {
    set({ loaded: true })
  }
  return state
}

export async function castVote(faction) {
  const r = await fetch(`${API}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ faction }),
  })
  const d = await r.json()
  if (!r.ok) throw new Error(d.error || "vote failed")
  set({ erdbaeren: d.erdbaeren, milchmaeuse: d.milchmaeuse, mine: d.mine, loaded: true })
  return state
}

export function useVotes() {
  const [s, setS] = useState(state)
  useEffect(() => {
    subs.add(setS)
    if (!state.loaded) loadCounts()
    else setS(state)
    return () => subs.delete(setS)
  }, [])
  return s
}
