import Navbar from "./components/layout/Navbar"
import Hero from "./components/layout/Hero"
import FactionsDoctrine from "./components/layout/FactionsDoctrine"
import Conflict from "./components/layout/Conflict"
import SecretWeapon from "./components/layout/SecretWeapon"
import Battle from "./components/layout/Battle"
import WarRoomArchive from "./components/layout/WarRoomArchive"
import Footer from "./components/layout/Footer"
import SpaceStage from "./components/SpaceStage"
import MoonLayer from "./components/MoonLayer"
import CloudVolume from "./components/CloudVolume"
import TerminalCard from "./components/TerminalCard"
import { ScrollProgress } from "./components/motion/ScrollFX"
import { TimelineProvider, useTimeline } from "./components/TimelineProvider"
import { LangProvider } from "./components/RunenContext"
import Intro from "./components/Intro"
import { useState } from "react"

function AppInner() {
  const { start } = useTimeline()
  const [termOpen, setTermOpen] = useState(false)
  return (
    <LangProvider>
      <Intro onDone={start} />
      <MoonLayer />
      <SpaceStage />
      <CloudVolume />
      <ScrollProgress />
      <Navbar termOpen={termOpen} setTermOpen={setTermOpen} />
      <TerminalCard open={termOpen} onClose={() => setTermOpen(false)} />
      <main>
        <Hero />
        <FactionsDoctrine />
        <Conflict />
        <SecretWeapon />
        <Battle />
        <WarRoomArchive />
      </main>
      <Footer />
    </LangProvider>
  )
}

export default function App() {
  return (
    <TimelineProvider>
      <AppInner />
    </TimelineProvider>
  )
}
