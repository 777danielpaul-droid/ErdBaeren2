import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { useGLTF, useAnimations, OrbitControls, Float } from "@react-three/drei"

// Lädt die animierte Erde (GLTF + Loop-Animation) aus /public/models.
function EarthModel({ glitch }) {
  const group = useRef(null)
  const { scene, animations } = useGLTF("/ErdBaeren2/models/scene.gltf")
  const { actions } = useAnimations(animations, group)
  const actionRef = useRef(null)

  useEffect(() => {
    if (actions && actions.Scene) {
      const action = actions.Scene.reset().play()
      actionRef.current = action
    }
  }, [actions])

  useEffect(() => {
    if (!glitch || !actionRef.current) return
    const action = actionRef.current

    // Glitch-Sequenz: pausiert die Animation zu bestimmten Zeitpunkten
    const seq = [
      { after: 0, pause: 45 },
      { after: 95, pause: 40 },
      { after: 190, pause: 35 },
      { after: 280, pause: 55 },
    ]

    const timeouts = seq.map(({ after, pause }) => [
      setTimeout(() => { action.paused = true }, after),
      setTimeout(() => { action.paused = false }, after + pause),
    ]).flat()

    const end = setTimeout(() => { action.paused = false }, 370)

    return () => {
      timeouts.forEach(id => clearTimeout(id))
      clearTimeout(end)
    }
  }, [glitch])

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} scale={1.1} />
    </group>
  )
}

// Sichtbarkeits-Sequenzen für Boot- und Glitch-Effekte
const BOOT_SEQUENCE = [
  { after: 0, visible: false },
  { after: 45, visible: true },
  { after: 90, visible: false },
  { after: 120, visible: true },
  { after: 160, visible: false },
  { after: 200, visible: true },
  { after: 240, visible: false },
  { after: 320, visible: true },
  { after: 360, visible: false },
  { after: 520, visible: true },
  { after: 570, visible: false },
  { after: 700, visible: true },
  { after: 730, visible: false },
  { after: 780, visible: true },
]

const GLITCH_SEQUENCE = [
  { after: 0, visible: false },
  { after: 30, visible: true },
  { after: 60, visible: false },
  { after: 90, visible: true },
  { after: 120, visible: false },
  { after: 150, visible: true },
  { after: 180, visible: false },
  { after: 210, visible: true },
]

// Hilfsfunktion: führt eine Sichtbarkeits-Sequenz aus (blinken ein/aus)
function runVisibilitySequence(seq, setVisible, onEnd) {
  const timeouts = seq.map(({ after, visible }) =>
    setTimeout(() => setVisible(visible), after)
  )
  const end = setTimeout(() => {
    setVisible(true)
    onEnd()
  }, seq[seq.length - 1].after + 50)

  return () => {
    timeouts.forEach(id => clearTimeout(id))
    clearTimeout(end)
  }
}

// Echtes 3D-Canvas mit der Hologramm-Erde. Nur auf Desktop eingebunden
// (lg+); auf schwachen Geräten render wir stattdessen einen CSS-Fallback.
export default function HoloEarth() {
  // State-Maschine: 'booting' → 'ready' → 'idle' → 'glitching' (periodisch)
  const [status, setStatus] = useState("booting")
  const [containerVisible, setContainerVisible] = useState(true)

  // Boot-Sequenz: 1.2s Verzögerung, dann in 'ready' wechseln
  useEffect(() => {
    if (status !== "booting") return
    const t = setTimeout(() => setStatus("ready"), 1200)
    return () => clearTimeout(t)
  }, [status])

  // Boot-Glitch: initiales Blinken beim Übergang booting → ready
  useEffect(() => {
    if (status !== "ready") return
    return runVisibilitySequence(BOOT_SEQUENCE, setContainerVisible, () => {
      setStatus("idle")
    })
  }, [status])

  // Periodischer Glitch: alle 12s ein kurzer Störimpuls (nur im 'idle' Status)
  useEffect(() => {
    if (status !== "idle") return

    const id = setInterval(() => {
      setStatus("glitching")
      runVisibilitySequence(GLITCH_SEQUENCE, setContainerVisible, () => {
        setStatus("idle")
      })
    }, 12000)

    return () => clearInterval(id)
  }, [status])

  const booted = status !== "booting"
  const glitch = status === "glitching"

  return (
    <div
      className="relative w-full h-full min-h-[360px] pointer-events-none"
      style={{
        opacity: booted && containerVisible ? 1 : 0,
        transform: booted ? "none" : "scale(1.06)",
        filter: booted ? "none" : "blur(1px)",
        transition:
          "opacity 0.04s linear, transform 0.25s ease, filter 0.25s ease",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.0], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 5]} intensity={1.1} color="#c9a227" />
        <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#22d3ee" />
        <Suspense fallback={null}>
          <Float speed={1.1} rotationIntensity={0.4} floatIntensity={0.6}>
            <EarthModel glitch={glitch} />
          </Float>
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          rotateSpeed={0.4}
        />
      </Canvas>
      {/* dezenter Glow-Halo hinter der Erde */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-full blur-[120px]"
      />
    </div>
  )
}

useGLTF.preload("/ErdBaeren2/models/scene.gltf")
