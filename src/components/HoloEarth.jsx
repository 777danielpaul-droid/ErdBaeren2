import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { useGLTF, useAnimations, OrbitControls, Float } from "@react-three/drei"
import * as THREE from "three"

// Lädt die animierte Erde (GLTF + Loop-Animation) aus /public/models.
// Die Animation (Erde dreht sich, Strahlen rotateiren seltenen Störsequenzen aus.
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

    const seq = [
      { after: 0, pause: 40 },
      { after: 80, pause: 35 },
      { after: 170, pause: 30 },
      { after: 250, pause: 45 },
    ]

    const timeouts = seq.map(({ after, pause }) => [
      setTimeout(() => {
        action.paused = true
      }, after),
      setTimeout(() => {
        action.paused = false
      }, after + pause),
    ]).flat()

    const end = setTimeout(() => {
      action.paused = false
    }, 340)

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

// Echtes 3D-Canvas mit der Hologramm-Erde. Nur auf Desktop eingebunden
// (lg+); auf schwachen Geräten render wir stattdessen einen CSS-Fallback.
export default function HoloEarth() {
  const [booted, setBooted] = useState(false)
  const [glitch, setGlitch] = useState(false)
  const [containerVisible, setContainerVisible] = useState(true)

  useEffect(() => {
    if (booted) return
    const t1 = setTimeout(() => setBooted(true), 1200)
    return () => clearTimeout(t1)
  }, [booted])

  useEffect(() => {
    if (!glitch) return

    const seq = [
      { after: 0, visible: false },
      { after: 40, visible: true },
      { after: 80, visible: false },
      { after: 115, visible: true },
      { after: 170, visible: false },
      { after: 200, visible: true },
      { after: 250, visible: false },
      { after: 295, visible: true },
    ]

    const timeouts = seq.map(({ after, visible }) =>
      setTimeout(() => setContainerVisible(visible), after)
    )

    const end = setTimeout(() => {
      setContainerVisible(true)
      setGlitch(false)
    }, 340)

    return () => {
      timeouts.forEach(id => clearTimeout(id))
      clearTimeout(end)
    }
  }, [glitch])

  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true)
    }, 12000)
    return () => clearInterval(id)
  }, [])

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
