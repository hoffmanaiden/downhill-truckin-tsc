'use client'

import Image from 'next/image'
import styles from './page.module.css'

import { reducer } from './State'

import * as THREE from 'three'
import React, { useRef, useEffect, RefObject, createRef, useMemo, forwardRef, useState, createContext, useReducer } from 'react'
import { useFrame, useThree, Canvas } from '@react-three/fiber'
import { useGLTF, KeyboardControls, useKeyboardControls, Stage, PerspectiveCamera, OrbitControls, CameraControls } from '@react-three/drei'
import { Physics, RigidBody, RapierRigidBody, useRevoluteJoint, useFixedJoint, CylinderCollider, CuboidCollider } from "@react-three/rapier"
import { GLTF } from 'three-stdlib'
import { Quaternion, Vector3, Vector3Tuple, Vector4Tuple } from 'three'
import { useControls } from 'leva'

import { BrunoIsaac } from './Bruno-isaac-truck'
import { Truck } from './Truck'

const LEVA_KEY = 'rapier-revolute-joint-vehicle'

const RAPIER_UPDATE_PRIORITY = -50
const AFTER_RAPIER_UPDATE = RAPIER_UPDATE_PRIORITY - 1

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

const initialState = {
  mouseDown: false,
}
export const AppContext = createContext(null)

export default function Home() {
  const chassisRef = useRef<RefObject<RapierRigidBody>>(null)

  const [state, dispatch] = useReducer(reducer, initialState)

  const providerValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return (
    <AppContext.Provider value={providerValue}>
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
            {/* <OrbitControls target={[0,-10,0]}/> */}

            <KeyboardControls map={CONTROLS_MAP}>
              {/* <BrunoIsaac /> */}
              <Truck />
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
    </AppContext.Provider>
  )
}
