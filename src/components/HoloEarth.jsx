import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { useGLTF, useAnimations, OrbitControls, Float } from "@react-three/drei"
import * as THREE from "three"

// Lädt die animierte Erde (GLTF + Loop-Animation) aus /public/models.
// Die Animation (Erde dreht sich, Strahlen rotateiren seltenen Störsequenzen aus.
function EarthModel() {
  const group = useRef(null)
  const { scene, animations } = useGLTF("/ErdBaeren2/models/scene.gltf")
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    if (actions && actions.Scene) {
      actions.Scene.reset().play()
    }
  }, [actions])

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
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (booted) return
    const t1 = setTimeout(() => setBooted(true), 1200)
    return () => clearTimeout(t1)
  }, [booted])

  useEffect(() => {
    const id = setInterval(() => {
      // Sequenz: erst kurz weg, dann 2-3x an/aus
      const t1 = setTimeout(() => setVisible(false), 0)
      const t2 = setTimeout(() => setVisible(true), 120)
      const t3 = setTimeout(() => setVisible(false), 220)
      const t4 = setTimeout(() => setVisible(true), 300)
      const t5 = setTimeout(() => setVisible(false), 380)
      const t6 = setTimeout(() => setVisible(true), 460)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        clearTimeout(t4)
        clearTimeout(t5)
        clearTimeout(t6)
      }
    }, 8000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="relative w-full h-full min-h-[360px] pointer-events-none"
      style={{
        opacity: booted && visible ? 1 : 0,
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
            <EarthModel />
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
