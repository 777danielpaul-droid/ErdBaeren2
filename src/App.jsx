import Navbar from "./components/layout/Navbar"
import Hero from "./components/layout/Hero"
import FactionsDoctrine from "./components/layout/FactionsDoctrine"
import Conflict from "./components/layout/Conflict"
import SecretWeapon from "./components/layout/SecretWeapon"
import Battle from "./components/layout/Battle"
import WarRoomArchive from "./components/layout/WarRoomArchive"
import Footer from "./components/layout/Footer"
import MilkyWay from "./components/MilkyWay"
import { ScrollProgress } from "./components/motion/ScrollFX"
import { LangProvider } from "./components/RunenContext"

export default function App() {
  return (
    <LangProvider>
      <MilkyWay />
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
