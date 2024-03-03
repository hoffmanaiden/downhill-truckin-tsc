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
import { WebGLShadowMap } from 'three';


import { Truck } from '../Truck'
import { Semi } from '../Semi'
import { PineTree } from '../PineTree'
import { LeafTree } from '../LeafTree'

import Ground from '../Ground'
import Box from '../Box'

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

export default function Lvl2(props: LvlProps) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const providerValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    const onMouseMove = () => {
      document.body.style.cursor = 'auto';
      clearTimeout(timeout as NodeJS.Timeout);
      timeout = setTimeout(() => {
        document.body.style.cursor = 'none';
      }, 5000);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Shift':
          changeCameraView()
          break;
        case 'r':
        case 'R':
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
          break;
        case 'r':
        case 'R':
          dispatch({ type: 'addVehical' })
          break;
        default:
          break;
      }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('keyup', handleKeyUp, true)

    return () => {
      // Cleanup
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('keyup', handleKeyUp, true)
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [state.cameraView, state.cameraViewUnlocked]);

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

      <Canvas 
        style={{ background: '#C4E1FF' }}
        shadows
      >
        <Physics
          // updatePriority={RAPIER_UPDATE_PRIORITY}
          debug={false}
          // maxStabilizationIterations={50}
          // maxVelocityFrictionIterations={50}
          maxVelocityIterations={100}
        >


          {/* Add HemisphereLight */}
          {/* <hemisphereLight
            color={0xffffff}
            intensity={1.5} // adjust intensity as needed
          /> */}




          {state.showVehical ?
            <KeyboardControls map={CONTROLS_MAP}>
              <Truck position={[10, 2, 0]} />
            </KeyboardControls> :
            null
          }
          <Ground position={[0, -5, 0]} />
          <Ground position={[-200, -20, 0]} />
          <Ground position={[-400, -35, 0]} />
          <Ground position={[-600, -50, 0]} />
          <Ground position={[-800, -15, 0]} />
          <Ground position={[-1000, -17.5, 0]} />
        </Physics>
      </Canvas>
    </AppContext.Provider>
  )
};