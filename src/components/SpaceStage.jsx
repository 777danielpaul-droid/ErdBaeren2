import MilkyWayBackground from "./MilkyWayBackground"
import SectorCanvas from "./SectorCanvas"

export default function SpaceStage() {
  return (
    <div style={{ position: "relative" }}>
      <MilkyWayBackground />
      <SectorCanvas />
    </div>
  )
}
