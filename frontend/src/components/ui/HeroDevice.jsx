import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const FloatingParticle = ({ angle, radius, speed }) => {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed
    ref.current.position.x = Math.cos(t + angle) * radius
    ref.current.position.y = Math.sin(t * 0.7 + angle) * 0.8
    ref.current.position.z = Math.sin(t + angle) * 0.5
    ref.current.scale.setScalar(0.5 + Math.sin(t * 2) * 0.2)
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial color="#4fc3f7" emissive="#4fc3f7" emissiveIntensity={2} />
    </mesh>
  )
}

const Phone = () => {
  const groupRef = useRef()
  const { mouse } = useThree()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.12
    groupRef.current.rotation.y += 0.004
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, mouse.y * 0.2, 0.05
    )
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z, -mouse.x * 0.1, 0.05
    )
  })

  return (
    <group ref={groupRef}>
      {/* Phone body */}
      <mesh>
        <boxGeometry args={[1.2, 2.4, 0.12]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0, 0.065]}>
        <boxGeometry args={[1.0, 2.1, 0.01]} />
        <meshStandardMaterial color="#0f3460" emissive="#1a6fc4" emissiveIntensity={0.5} />
      </mesh>

      {/* Screen UI lines */}
      {[-0.6, -0.25, 0.1, 0.45].map((y, i) => (
        <mesh key={i} position={[i % 2 === 0 ? -0.1 : 0.05, y, 0.072]}>
          <boxGeometry args={[i % 2 === 0 ? 0.55 : 0.35, 0.035, 0.001]} />
          <meshStandardMaterial color="#4fc3f7" emissive="#4fc3f7" emissiveIntensity={1.5} transparent opacity={0.7} />
        </mesh>
      ))}

      {/* Screen image block */}
      <mesh position={[0, 0.7, 0.072]}>
        <boxGeometry args={[0.75, 0.55, 0.001]} />
        <meshStandardMaterial color="#0a2a4a" emissive="#1a4a7a" emissiveIntensity={0.4} />
      </mesh>

      {/* Camera dot */}
      <mesh position={[0, 1.0, 0.072]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color="#050510" />
      </mesh>

      {/* Home bar */}
      <mesh position={[0, -0.95, 0.072]}>
        <boxGeometry args={[0.32, 0.022, 0.001]} />
        <meshStandardMaterial color="#4fc3f7" emissive="#4fc3f7" emissiveIntensity={1.2} transparent opacity={0.8} />
      </mesh>

      {/* Right side button */}
      <mesh position={[0.625, 0.25, 0]}>
        <boxGeometry args={[0.03, 0.28, 0.06]} />
        <meshStandardMaterial color="#2a2a4e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Left volume buttons */}
      {[0.18, -0.12, -0.38].map((y, i) => (
        <mesh key={i} position={[-0.625, y, 0]}>
          <boxGeometry args={[0.03, i === 0 ? 0.14 : 0.2, 0.06]} />
          <meshStandardMaterial color="#2a2a4e" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Orbiting particles */}
      {[...Array(6)].map((_, i) => (
        <FloatingParticle
          key={i}
          angle={(i / 6) * Math.PI * 2}
          radius={1.7}
          speed={0.28 + i * 0.08}
        />
      ))}
    </group>
  )
}

const HeroDevice = () => (
  <div style={{ width: '100%', height: '520px' }}>
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#4fc3f7" />
      <pointLight position={[-5, -3, -4]} intensity={1} color="#7c3aed" />
      <pointLight position={[0, 2, 6]} intensity={0.6} color="#ffffff" />
      <Phone />
    </Canvas>
  </div>
)

export default HeroDevice