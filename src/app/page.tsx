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

const RAPIER_UPDATE_PRIORITY = -50
const AFTER_RAPIER_UPDATE = RAPIER_UPDATE_PRIORITY - 1

const AXLE_TO_CHASSIS_JOINT_STIFFNESS = 150000
const AXLE_TO_CHASSIS_JOINT_DAMPING = 20

const DRIVEN_WHEEL_FORCE = 600
const DRIVEN_WHEEL_DAMPING = 5


type FixedJointProps = {
  body: RefObject<RapierRigidBody>
  wheel: RefObject<RapierRigidBody>
  body1Anchor: Vector3Tuple
  body1LocalFrame: Vector4Tuple
  body2Anchor: Vector3Tuple
  body2LocalFrame: Vector4Tuple
}

const FixedJoint = ({ body, wheel, body1Anchor, body1LocalFrame, body2Anchor, body2LocalFrame }: FixedJointProps) => {
  useFixedJoint(body, wheel, [body1Anchor, body1LocalFrame, body2Anchor, body2LocalFrame])

  return null
}

type AxleJointProps = {
  body: RefObject<RapierRigidBody>
  wheel: RefObject<RapierRigidBody>
  bodyAnchor: Vector3Tuple
  wheelAnchor: Vector3Tuple
  rotationAxis: Vector3Tuple
  isDriven: boolean
}

const AxleJoint = ({ body, wheel, bodyAnchor, wheelAnchor, rotationAxis, isDriven }: AxleJointProps) => {
  const joint = useRevoluteJoint(body, wheel, [bodyAnchor, wheelAnchor, rotationAxis])

  const forwardPressed = useKeyboardControls((state) => state.forward)
  const backwardPressed = useKeyboardControls((state) => state.back)

  useEffect(() => {
    if (!isDriven) return

    let forward = 0
    if (forwardPressed) forward += 1
    if (backwardPressed) forward -= 1

    forward *= DRIVEN_WHEEL_FORCE

    if (forward !== 0) {
      wheel.current?.wakeUp()
    }

    joint.current?.configureMotorVelocity(forward, DRIVEN_WHEEL_DAMPING)
  }, [forwardPressed, backwardPressed])

  return null
}

type SteeredJointProps = {
  body: RefObject<RapierRigidBody>
  wheel: RefObject<RapierRigidBody>
  bodyAnchor: Vector3Tuple
  wheelAnchor: Vector3Tuple
  rotationAxis: Vector3Tuple
}

const SteeredJoint = ({ body, wheel, bodyAnchor, wheelAnchor, rotationAxis }: SteeredJointProps) => {
  const joint = useRevoluteJoint(body, wheel, [bodyAnchor, wheelAnchor, rotationAxis])

  const left = useKeyboardControls((state) => state.left)
  const right = useKeyboardControls((state) => state.right)
  const targetPos = left ? 0.2 : right ? -0.2 : 0

  useEffect(() => {
    joint.current?.configureMotorPosition(targetPos, AXLE_TO_CHASSIS_JOINT_STIFFNESS, AXLE_TO_CHASSIS_JOINT_DAMPING)
  }, [left, right])

  return null
}

type WheelInfo = {
  axlePosition: Vector3Tuple
  wheelPosition: Vector3Tuple
  isSteered: boolean
  side: 'left' | 'right'
  isDriven: boolean
}


function Car() {
  const { cameraMode } = useControls(`${LEVA_KEY}-camera`, {
    cameraMode: {
      value: 'follow',
      options: ['follow', 'orbit'],
    },
  })

  const camera = useThree((state) => state.camera)
  const currentCameraPosition = useRef(new Vector3(15, 15, 0))
  const currentCameraLookAt = useRef(new Vector3())

  const chassisRef = useRef<RapierRigidBody>(null)

  const wheels: WheelInfo[] = [
    {
      axlePosition: [-1.2, -0.6, 0.7],
      wheelPosition: [-1.2, -0.4, 1],
      isSteered: true,
      side: 'left',
      isDriven: false,
    },
    {
      axlePosition: [-1.2, -0.6, -0.7],
      wheelPosition: [-1.2, -0.4, -1],
      isSteered: true,
      side: 'right',
      isDriven: false,
    },
    {
      axlePosition: [1.2, -0.6, 0.7],
      wheelPosition: [1.2, -0.4, 1],
      isSteered: false,
      side: 'left',
      isDriven: true,
    },
    {
      axlePosition: [1.2, -0.6, -0.7],
      wheelPosition: [1.2, -0.4, -1],
      isSteered: false,
      side: 'right',
      isDriven: true,
    },
  ]

  const wheelRefs = useRef<RefObject<RapierRigidBody>[]>(wheels.map(() => createRef()))

  const axleRefs = useRef<RefObject<RapierRigidBody>[]>(wheels.map(() => createRef()))

  useFrame((_, delta) => {
    if (!chassisRef.current || cameraMode !== 'follow') {
      return
    }

    const t = 1.0 - Math.pow(0.01, delta)

    const idealOffset = new Vector3(10, 5, 0)
    idealOffset.applyQuaternion(chassisRef.current.rotation() as Quaternion)
    idealOffset.add(chassisRef.current.translation() as Vector3)
    if (idealOffset.y < 0) {
      idealOffset.y = 0
    }

    const idealLookAt = new Vector3(0, 1, 0)
    idealLookAt.applyQuaternion(chassisRef.current.rotation() as Quaternion)
    idealLookAt.add(chassisRef.current.translation() as Vector3)

    currentCameraPosition.current.lerp(idealOffset, t)
    currentCameraLookAt.current.lerp(idealLookAt, t)

    camera.position.copy(currentCameraPosition.current)
    camera.lookAt(currentCameraLookAt.current)
  }, AFTER_RAPIER_UPDATE)

  return (
    <>
      {cameraMode === 'orbit' ? <OrbitControls /> : null}

      <group>
        {/* chassis */}
        <RigidBody ref={chassisRef} colliders="cuboid" mass={1}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.5, 0.5, 1.5]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        </RigidBody>

        {/* wheels */}
        {wheels.map((wheel, i) => (
          <React.Fragment key={i}>
            {/* axle */}
            <RigidBody ref={axleRefs.current[i]} position={wheel.axlePosition} colliders="cuboid">
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                <meshStandardMaterial color="#999" />
              </mesh>
            </RigidBody>

            {/* wheel */}
            <RigidBody ref={wheelRefs.current[i]} position={wheel.wheelPosition} colliders={false}>
              <mesh rotation-x={-Math.PI / 2} castShadow receiveShadow>
                <cylinderGeometry args={[0.25, 0.25, 0.24, 32]} />
                <meshStandardMaterial color="#666" />
              </mesh>

              <mesh rotation-x={-Math.PI / 2}>
                <cylinderGeometry args={[0.251, 0.251, 0.241, 16]} />
                <meshStandardMaterial color="#000" wireframe />
              </mesh>

              <CylinderCollider mass={0.5} friction={1.5} args={[0.125, 0.25]} rotation={[-Math.PI / 2, 0, 0]} />
            </RigidBody>

            {/* axle to chassis joint */}
            {!wheel.isSteered ? (
              <FixedJoint
                body={chassisRef}
                wheel={axleRefs.current[i]}
                body1Anchor={wheel.axlePosition}
                body1LocalFrame={[0, 0, 0, 1]}
                body2Anchor={[0, 0, 0]}
                body2LocalFrame={[0, 0, 0, 1]}
              />
            ) : (
              <SteeredJoint
                body={chassisRef}
                wheel={axleRefs.current[i]}
                bodyAnchor={wheel.axlePosition}
                wheelAnchor={[0, 0, 0]}
                rotationAxis={[0, 1, 0]}
              />
            )}

            {/* wheel to axle joint */}
            <AxleJoint
              body={axleRefs.current[i]}
              wheel={wheelRefs.current[i]}
              bodyAnchor={[0, 0, wheel.side === 'left' ? 0.35 : -0.35]}
              wheelAnchor={[0, 0, 0]}
              rotationAxis={[0, 0, 1]}
              isDriven={wheel.isDriven}
            />
          </React.Fragment>
        ))}
      </group>
    </>
  )
}
export default function Home() {

  return (
    <Canvas>
      <Physics
        // updatePriority={RAPIER_UPDATE_PRIORITY}
        debug={true}
        // maxStabilizationIterations={50}
        // maxVelocityFrictionIterations={50}
        maxVelocityIterations={100}
      >
        {/* <Stage intensity={0.5} shadows="contact" environment="city"> */}
        <PerspectiveCamera makeDefault position={[20, 20, -20]} zoom={1} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {/* <OrbitControls /> */}

        <KeyboardControls map={CONTROLS_MAP}>
          <BrunoIsaac />
        </KeyboardControls>

        {/* <CuboidCollider position={[0, -10, 0]} args={[20, 0.5, 20]} /> */}

        <RigidBody>
          <mesh position={[0, -10, 0]}>
            <boxGeometry args={[20, 0.5, 20]} />
            <meshStandardMaterial color='green' />
          </mesh>
        </RigidBody>
        {/* </Stage> */}
      </Physics>
    </Canvas>
  )
}
