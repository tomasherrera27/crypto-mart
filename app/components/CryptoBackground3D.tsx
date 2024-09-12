'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere, Line, Text, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
type NodeProps = {
  position: [number, number, number];
  color: string;
}

const Node: React.FC<NodeProps> = ({ position, color }) => {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.2
      ref.current.rotation.y += delta * 0.3
    }
  })

  return (
    <group position={position}>
      <Sphere ref={ref} args={[0.3, 32, 32]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </Sphere>
      <Text
        position={[0, 0.4, 0]}
        fontSize={0.2}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {Math.random().toString(16).substr(2, 8)}
      </Text>
    </group>
  )
}

// Custom type to include dashOffset
interface CustomLineDashedMaterial extends THREE.LineDashedMaterial {
  dashOffset: number;
}

type ConnectionProps = {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}

const Connection: React.FC<ConnectionProps> = ({ start, end, color }) => {
  // @ts-ignore
  const ref = useRef<THREE.Line>(null)

  useFrame(() => {
    if (ref.current && ref.current.material instanceof THREE.LineDashedMaterial) {
      const material = ref.current.material as CustomLineDashedMaterial;
      material.dashOffset -= 0.01;
    }
  })

  return (
    // @ts-ignore
    <Line
      ref={ref}
      points={[start, end]}
      color={color}
      lineWidth={2}
      dashed
      dashScale={50}
      dashSize={0.5}
      dashOffset={0}
    />
  )
}

const CryptoNetwork: React.FC = () => {
  const { size } = useThree()
  const scale = Math.min(size.width, size.height) / 25

  const nodes: NodeProps[] = useMemo(() => {
    return Array(50).fill(null).map(() => ({
      position: [
        (Math.random() - 0.5) * 20 * scale,
        (Math.random() - 0.5) * 20 * scale,
        (Math.random() - 0.5) * 20 * scale
      ] as [number, number, number],
      color: ['#ff9900', '#627eea', '#345d9d', '#26a17b'][Math.floor(Math.random() * 4)]
    }))
  }, [scale])

  const connections: ConnectionProps[] = useMemo(() => {
    return Array(75).fill(null).map(() => {
      const startIndex = Math.floor(Math.random() * nodes.length)
      let endIndex
      do {
        endIndex = Math.floor(Math.random() * nodes.length)
      } while (endIndex === startIndex)

      return {
        start: nodes[startIndex].position,
        end: nodes[endIndex].position,
        color: new THREE.Color().setHSL(Math.random(), 1, 0.5).getHexString()
      }
    })
  }, [nodes])

  return (
    <>
      {nodes.map((node, index) => (
        <Node key={index} {...node} />
      ))}
      {connections.map((connection, index) => (
        <Connection key={index} {...connection} />
      ))}
    </>
  )
}

const AnimatedCamera: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  useFrame(({ clock }) => {
    if (cameraRef.current) {
      cameraRef.current.position.x = Math.sin(clock.elapsedTime * 0.1) * 35
      cameraRef.current.position.z = Math.cos(clock.elapsedTime * 0.1) * 35
      cameraRef.current.lookAt(0, 0, 0)
    }
  })

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 35]} fov={60} />
}

const CryptoBackground3D: React.FC = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
      <Canvas>
        <color attach="background" args={['#000000']} />
        <AnimatedCamera />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <CryptoNetwork />
        <fog attach="fog" args={['#000000', 15, 55]} />
      </Canvas>
    </div>
  )
}

export default CryptoBackground3D