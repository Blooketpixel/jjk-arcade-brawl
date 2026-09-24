import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Fighter, GameState } from '../../game/types'

const ARENA_WIDTH = 800

function fighterX(fighter: Fighter) {
  return ((fighter.x / ARENA_WIDTH) - 0.5) * 14
}

function CharacterModel({ fighter, flip }: { fighter: Fighter; flip: boolean }) {
  const group = useRef<THREE.Group>(null)
  const isGojo = fighter.character.id === 'gojo'
  const isSukuna = fighter.character.id === 'sukuna'
  const isMegumi = fighter.character.id === 'megumi'
  const primary = fighter.character.colors.primary
  const body = isGojo ? '#160d24' : isMegumi ? '#17233b' : isSukuna ? '#f3f4f6' : '#263244'
  const hair = isGojo ? '#f8fafc' : isMegumi ? '#111827' : isSukuna ? '#fb7185' : '#111827'
  const skin = '#f6c7b7'

  useFrame(({ clock }) => {
    if (!group.current) return
    const bob = fighter.animState === 'walk' ? Math.sin(clock.elapsedTime * 12) * 0.08 : 0
    const attack = fighter.isAttacking ? Math.sin(Math.min(fighter.attackTimer * 18, Math.PI)) * 0.18 : 0
    group.current.position.y = 0.35 + bob
    group.current.rotation.y = flip ? Math.PI : 0
    group.current.rotation.z = fighter.animState === 'hurt' ? Math.sin(clock.elapsedTime * 40) * 0.08 : 0
    group.current.scale.setScalar(fighter.isUltimating ? 1.12 : 1)
    const punch = group.current.getObjectByName('punch')
    if (punch) punch.position.z = 0.55 + attack
  })

  return (
    <group ref={group} position={[fighterX(fighter), 0.35, 0]}>
      <mesh castShadow position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.42, 20, 16]} />
        <meshStandardMaterial color={skin} roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 2.08, 0]}>
        <sphereGeometry args={[0.48, 16, 12]} />
        <meshStandardMaterial color={hair} roughness={0.5} />
      </mesh>
      <mesh castShadow position={[0, 1.72, 0.39]}>
        <boxGeometry args={[0.7, 0.18, 0.08]} />
        <meshStandardMaterial color={isGojo ? '#111018' : '#172033'} emissive={isGojo ? '#180d2b' : '#000000'} emissiveIntensity={0.4} />
      </mesh>
      <mesh castShadow position={[0, 0.85, 0]}>
        <boxGeometry args={[0.9, 1.35, 0.5]} />
        <meshStandardMaterial color={body} roughness={0.8} />
      </mesh>
      {isGojo && (
        <mesh position={[0, 1.18, 0.28]}>
          <boxGeometry args={[0.98, 0.32, 0.12]} />
          <meshStandardMaterial color="#39234e" emissive="#5b2d86" emissiveIntensity={0.5} />
        </mesh>
      )}
      <mesh castShadow position={[-0.65, 0.9, 0]} rotation={[0, 0, -0.15]}>
        <capsuleGeometry args={[0.15, 0.9, 6, 12]} />
        <meshStandardMaterial color={body} />
      </mesh>
      <mesh castShadow name="punch" position={[0.62, 0.8, 0.5]} rotation={[0.2, 0, -0.15]}>
        <capsuleGeometry args={[0.15, 0.85, 6, 12]} />
        <meshStandardMaterial color={body} emissive={fighter.isAttacking ? primary : '#000000'} emissiveIntensity={fighter.isAttacking ? 1.5 : 0} />
      </mesh>
      <mesh castShadow position={[-0.27, -0.1, 0]}>
        <boxGeometry args={[0.27, 0.95, 0.35]} />
        <meshStandardMaterial color={isGojo ? '#0d0818' : '#111827'} />
      </mesh>
      <mesh castShadow position={[0.27, -0.1, 0]}>
        <boxGeometry args={[0.27, 0.95, 0.35]} />
        <meshStandardMaterial color={isGojo ? '#0d0818' : '#111827'} />
      </mesh>
      {isGojo && <pointLight color="#a855f7" intensity={fighter.isUltimating ? 2 : 0.25} distance={3} position={[0, 1, 0.5]} />}
    </group>
  )
}

function FighterEffects({ fighter }: { fighter: Fighter }) {
  if (!fighter.isUltimating && !fighter.isAttacking) return null
  const color = fighter.character.id === 'gojo' ? '#a855f7' : fighter.character.colors.special
  return (
    <mesh position={[fighterX(fighter), 1.3, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.5, fighter.isUltimating ? 1.7 : 0.9, 40]} />
      <meshBasicMaterial color={color} transparent opacity={fighter.isUltimating ? 0.45 : 0.25} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Domain({ active }: { active: boolean }) {
  const ring = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ring.current) ring.current.rotation.z = clock.elapsedTime * 0.7
  })
  if (!active) return null
  return (
    <group>
      <mesh position={[0, 2.6, -0.8]}>
        <sphereGeometry args={[5.2, 32, 20]} />
        <meshBasicMaterial color="#5b21b6" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
      <mesh ref={ring} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.2, 0.025, 8, 64]} />
        <meshBasicMaterial color="#d8b4fe" transparent opacity={0.8} />
      </mesh>
      <pointLight color="#9333ea" intensity={5} distance={12} position={[0, 2, 1]} />
    </group>
  )
}

function ArenaScene({ state }: { state: GameState }) {
  const gojoDomain = (state.p1.character.id === 'gojo' && state.p1.isUltimating) || (state.p2.character.id === 'gojo' && state.p2.isUltimating)
  return (
    <>
      <color attach="background" args={['#05030d']} />
      <fog attach="fog" args={['#05030d', 8, 22]} />
      <ambientLight intensity={0.8} color="#8b5cf6" />
      <directionalLight castShadow position={[2, 8, 5]} intensity={2.2} color="#f5eaff" />
      <pointLight position={[-6, 2, 3]} intensity={3} color="#ef4444" distance={10} />
      <pointLight position={[6, 2, 3]} intensity={3} color="#7c3aed" distance={10} />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.62, 0]}>
        <planeGeometry args={[18, 9]} />
        <meshStandardMaterial color="#0c0a18" metalness={0.65} roughness={0.35} />
      </mesh>
      <gridHelper args={[18, 18, '#4c1d95', '#17102a']} position={[0, -0.6, 0]} />
      <mesh position={[0, 3, -2.5]}>
        <boxGeometry args={[17, 6, 0.3]} />
        <meshStandardMaterial color="#090714" emissive="#160d2c" emissiveIntensity={0.7} />
      </mesh>
      <Domain active={gojoDomain} />
      <CharacterModel fighter={state.p1} flip={false} />
      <CharacterModel fighter={state.p2} flip />
      <FighterEffects fighter={state.p1} />
      <FighterEffects fighter={state.p2} />
    </>
  )
}

export default function GameArena3D({ state }: { state: GameState }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Canvas shadows camera={{ position: [0, 3.3, 10], fov: 42 }} dpr={[1, 2]}>
        <ArenaScene state={state} />
      </Canvas>
    </div>
  )
}
