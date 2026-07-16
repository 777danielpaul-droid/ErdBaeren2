import { Suspense, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { useGLTF, useAnimations, OrbitControls, Float } from "@react-three/drei"
import * as THREE from "three"

// Lädt die animierte Erde (GLTF + Loop-Animation) aus /public/models.
// Die Animation (Erde dreht sich, Strahlen rotieren) läuft automatisch via useAnimations.
function EarthModel() {
  const group = useRef()
  const { scene, animations } = useGLTF("/ErdBaeren2/models/scene.gltf")
  const { actions } = useAnimations(animations, group)

  // Animation sofort abspielen (Loop ist im Clip definiert).
  if (actions && actions.Scene) {
    actions.Scene.reset().play()
  }

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} scale={1.1} />
    </group>
  )
}

// Echtes 3D-Canvas mit der Hologramm-Erde. Nur auf Desktop eingebunden
// (lg+); auf schwachen Geräten render wir stattdessen einen CSS-Fallback.
export default function HoloEarth() {
  return (
    <div className="relative w-full h-full min-h-[360px] pointer-events-none">
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
        className="absolute inset-0 -z-10 rounded-full bg-neon/10 blur-[120px]"
      />
    </div>
  )
}

useGLTF.preload("/ErdBaeren2/models/scene.gltf")
