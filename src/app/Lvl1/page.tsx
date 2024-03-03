'use client'

import Image from 'next/image'
import styles from './page.module.css'

import { AppContext, reducer, StateType } from '../State'

import * as THREE from 'three'
import React, { useRef, useEffect, RefObject, createRef, useMemo, forwardRef, useState, createContext, useReducer, useContext } from 'react'
import { useFrame, useThree, Canvas } from '@react-three/fiber'
import { SoftShadows, useGLTF, KeyboardControls, useKeyboardControls, Stage, PerspectiveCamera, OrbitControls, CameraControls, Sky, Environment, SpotLight } from '@react-three/drei'
import { Physics, RigidBody, RapierRigidBody, useRevoluteJoint, useFixedJoint, CylinderCollider, CuboidCollider } from "@react-three/rapier"
import { GLTF } from 'three-stdlib'
import { Quaternion, Vector3, Vector3Tuple, Vector4Tuple } from 'three'
import { useControls } from 'leva'
import { Ramp } from '../Ramp'

import { Truck } from '../Truck'
import { Semi } from '../Semi'
import { PineTree } from '../PineTree'
import { LeafTree } from '../LeafTree'

import Ground from '../Ground'

const LEVA_KEY = 'rapier-revolute-joint-vehicle'

const RAPIER_UPDATE_PRIORITY = -50
const AFTER_RAPIER_UPDATE = RAPIER_UPDATE_PRIORITY - 1

let min = -15;
let max = 15;
let pine_random_number = Math.floor(Math.random() * (max - min + 1)) + min;
let leaf_random_number = Math.floor(Math.random() * (max - min + 1)) + min;

const CONTROLS = {
  forward: 'forward',
  back: 'back',
  left: 'left',
  right: 'right',
  brake: 'brake',
  shift: 'shift',
  tiltforward: 'tiltforward',
  tiltBackward: 'tiltBackward',
  tiltLeft: 'tiltLeft',
  tiltRight: 'tiltRight'
}

const CONTROLS_MAP = [
  { name: CONTROLS.forward, keys: ['ArrowUp', 'w', 'W'] },
  { name: CONTROLS.back, keys: ['ArrowDown', 's', 'S'] },
  { name: CONTROLS.left, keys: ['ArrowLeft', 'a', 'A'] },
  { name: CONTROLS.right, keys: ['ArrowRight', 'd', 'D'] },
  { name: CONTROLS.brake, keys: ['Space'] },
  { name: CONTROLS.shift, keys: ['ShiftLeft'] },
  { name: CONTROLS.tiltforward, keys: ['i', 'I'] },
  { name: CONTROLS.tiltBackward, keys: ['k', 'K'] },
  { name: CONTROLS.tiltLeft, keys: ['j', 'J'] },
  { name: CONTROLS.tiltRight, keys: ['l', 'L'] },
]

const initialState = {
  cameraView: 1,
  cameraViewUnlocked: true,
  elapsedTime: 0,
  showVehical: true
}

interface LvlProps {
  // Add any props you need for your component here
}

export default function Lvl1(props: LvlProps) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const providerValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('keyup', handleKeyUp, true)
  }, [state.cameraView, state.cameraViewUnlocked])



  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Shift':
        changeCameraView()
        break;
      case 'r' || 'R':
        dispatch({ type: 'removeVehical' })
        break
      default:
        break;
    }
  }
  const handleKeyUp = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Shift':
        dispatch({ type: 'unlockView' })
        break
      case 'r' || 'R':
        dispatch({ type: 'addVehical' })
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
      <div style={{ position: 'fixed', zIndex: 99999 }}>
        <p>{state.cameraView}</p>
        {/* <p>{state.elapsedTime}</p> */}
      </div>
      <Canvas style={{ background: '#C4E1FF' }} >
        <Physics
          // updatePriority={RAPIER_UPDATE_PRIORITY}
          debug={false}
          // maxStabilizationIterations={50}
          // maxVelocityFrictionIterations={50}
          maxVelocityIterations={100}
        >


          {/* Add HemisphereLight */}
          <hemisphereLight
            color={0xffffff}
            intensity={1.5} // adjust intensity as needed
          />
          <SoftShadows size={1} focus={1} samples={10} />
          {/* Add a DirectionalLight to simulate sunlight */}
          <directionalLight
            color={0xffffff} // white light
            castShadow // enable shadow casting
            intensity={2}
            position={[0, 100, 5]} // position the light source
            shadow-camera-left={-10} // default is -5
            shadow-camera-right={10} // default is 5
            shadow-camera-top={10} // default is 5
            shadow-camera-bottom={-20} // default is -5
            shadow-camera-near={0.5} // default
            shadow-camera-far={500} // default
          />
          {state.showVehical ?
            <KeyboardControls map={CONTROLS_MAP}>
              <Truck position={[10, 2, 0]} />
            </KeyboardControls> :
            null
          }

          {[...Array(11)].map((x, i) => {
            return (
              i === 0 ?
                <group>
                  <RigidBody colliders="cuboid" type="fixed" restitution={-1} key={i}>
                    <mesh position={[-50 * i, -5, 0]} receiveShadow>
                      <boxGeometry args={[50, 0.5, 50]} />
                      <meshStandardMaterial color='green' />
                    </mesh>
                  </RigidBody>
                  <LeafTree position={[-10, -5, -5]} />
                  <PineTree position={[-10, -5, 5]} />
                </group> : i < 10 ?
                  <group>
                    <RigidBody
                      colliders="cuboid"
                      type="fixed"
                      restitution={-1}
                      key={i}
                      name={`platform ${i}`}
                      friction={0.25}
                      onCollisionEnter={(props) => console.log(props?.target?.colliderObject?.name)}
                    >
                      <mesh position={[-50 * i, -10 * i, 0]} rotation={[0, 0, 0.18]} receiveShadow>
                        <boxGeometry args={[50, 0.5, 50]} />
                        <meshStandardMaterial color='green' />
                      </mesh>
                    </RigidBody>
                    <PineTree position={[(-50 * i) + pine_random_number, (-10 * i) * 1.05, pine_random_number]} />
                    <LeafTree position={[(-50 * i) + leaf_random_number, (-10 * i) * 1.05, leaf_random_number]} />
                  </group> :
                  <RigidBody type="fixed" restitution={-1} key={i} sensor onIntersectionEnter={(props) => console.log("Goal!")}>
                    <mesh position={[(-50 * i) + 50, (-10 * i) + 25, 0]} rotation={[0, 0, Math.PI / 2]} receiveShadow>
                      <boxGeometry args={[50, 0.5, 50]} />
                      <meshStandardMaterial transparent={true} opacity={0.5} />
                    </mesh>
                  </RigidBody>
            )
          })}
        </Physics>
      </Canvas>
    </AppContext.Provider>
  )
};