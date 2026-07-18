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
import { ScrollProgress } from "./components/motion/ScrollFX"
import { TimelineProvider, useTimeline } from "./components/TimelineProvider"
import { LangProvider } from "./components/RunenContext"
import Intro from "./components/Intro"

function AppInner() {
  const { start } = useTimeline()
  return (
    <LangProvider>
      <Intro onDone={start} />
      <MoonLayer />
      <SpaceStage />
      <CloudVolume />
      <ScrollProgress />
      <Navbar />
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
