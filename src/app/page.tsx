'use client'

import Image from 'next/image'
import styles from './page.module.css'

import * as THREE from 'three'
import React, { useRef, useEffect, RefObject, createRef, useMemo } from 'react'
import { useFrame, useThree, Canvas } from '@react-three/fiber'
import { useGLTF, KeyboardControls, useKeyboardControls, Stage, PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { Physics, RigidBody, RapierRigidBody, useRevoluteJoint, useFixedJoint, CylinderCollider, CuboidCollider } from "@react-three/rapier"
import { GLTF } from 'three-stdlib'
import { Quaternion, Vector3, Vector3Tuple, Vector4Tuple } from 'three'
import { useControls } from 'leva'

import { BrunoIsaac } from './Bruno-isaac-truck'
import { Truck } from './Truck'

const LEVA_KEY = 'rapier-revolute-joint-vehicle'

const CONTROLS = {
  forward: 'forward',
  back: 'back',
  left: 'left',
  right: 'right',
  brake: 'brake',
}

const CONTROLS_MAP = [
  { name: CONTROLS.forward, keys: ['ArrowUp', 'w', 'W'] },
  { name: CONTROLS.back, keys: ['ArrowDown', 's', 'S'] },
  { name: CONTROLS.left, keys: ['ArrowLeft', 'a', 'A'] },
  { name: CONTROLS.right, keys: ['ArrowRight', 'd', 'D'] },
  { name: CONTROLS.brake, keys: ['Space'] },
]



export default function Home() {
  // const chassisRef = useRef<RapierRigidBody>(null)

  return (
    <Canvas>
      <Physics
        // updatePriority={RAPIER_UPDATE_PRIORITY}
        debug={true}
        // maxStabilizationIterations={50}
        // maxVelocityFrictionIterations={50}
        maxVelocityIterations={100}
        
      >
        <Stage intensity={0.5} shadows="contact">
        <PerspectiveCamera makeDefault position={[20, 20, -20]} zoom={1} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls target={[0,-10,0]}/>

        <KeyboardControls map={CONTROLS_MAP}>
          {/* <BrunoIsaac /> */}
          <Truck/>
        </KeyboardControls>

        <CuboidCollider position={[0, -10, 0]} args={[30, 0.5, 50]} />
{/* 
        <RigidBody>
          <mesh position={[0, -10, 0]}>
            <boxGeometry args={[20, 0.5, 20]} />
            <meshStandardMaterial color='green' />
          </mesh>
        </RigidBody> */}
        </Stage>
      </Physics>
    </Canvas>
  )
}
