'use client'

import Image from 'next/image'
import styles from './page.module.css'

import { reducer } from './State'

import * as THREE from 'three'
import React, { useRef, useEffect, RefObject, createRef, useMemo, forwardRef, useState, createContext, useReducer, useContext } from 'react'
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
  shift: 'shift'
}

const CONTROLS_MAP = [
  { name: CONTROLS.forward, keys: ['ArrowUp', 'w', 'W'] },
  { name: CONTROLS.back, keys: ['ArrowDown', 's', 'S'] },
  { name: CONTROLS.left, keys: ['ArrowLeft', 'a', 'A'] },
  { name: CONTROLS.right, keys: ['ArrowRight', 'd', 'D'] },
  { name: CONTROLS.brake, keys: ['Space'] },
  { name: CONTROLS.shift, keys: ['ShiftLeft'] },
]

const initialState = {
  cameraView: 1,
  cameraViewUnlocked: true
}
export const AppContext = createContext(null)

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const providerValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('keyup', handleKeyUp, true)
  }, [state.cameraView, state.cameraViewUnlocked])

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Shift':
        changeCameraView()
        break;
      default:
        break;
    }
  }
  const handleKeyUp = (e) => {
    switch (e.key) {
      case 'Shift':
        dispatch({ type: 'unlockView' })
        break
      default:
        break
    }
  }

  const changeCameraView = () => {
    if (state.cameraViewUnlocked) {
      if (state.cameraView == 1) {
        dispatch({ type: 'changeView', value: 2 })
      }
      if (state.cameraView == 2) {
        dispatch({ type: 'changeView', value: 3 })
      }
      if (state.cameraView == 3) {
        dispatch({ type: 'changeView', value: 1 })
      }
    }
  }

  return (
    <AppContext.Provider value={providerValue}>
      <div style={{ position: 'fixed', zIndex: 99999 }}>{state.cameraView}</div>
      <Canvas>
        <Physics
          // updatePriority={RAPIER_UPDATE_PRIORITY}
          debug={true}
          // maxStabilizationIterations={50}
          // maxVelocityFrictionIterations={50}
          maxVelocityIterations={100}

        >
          <Stage intensity={0.5} shadows={false}>
            {/* <PerspectiveCamera makeDefault /> */}
            <ambientLight />
            <pointLight position={[10, 10, 10]} />

            <KeyboardControls map={CONTROLS_MAP}>
              {/* <BrunoIsaac /> */}
              <Truck />
            </KeyboardControls>

            <RigidBody colliders="cuboid" type="fixed">
              <mesh position={[0, -10, 0]} receiveShadow>
                <boxGeometry args={[300, 0.5, 50]} />
                <meshStandardMaterial color='green' />
              </mesh>
            </RigidBody>
          </Stage>
        </Physics>
      </Canvas>
    </AppContext.Provider>
  )
}
