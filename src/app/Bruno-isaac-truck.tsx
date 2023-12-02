/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.15 .\bruno-isaac-truck.glb -t 
*/

import * as THREE from 'three'
import React, { useRef, useEffect, RefObject, createRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, KeyboardControls, useKeyboardControls } from '@react-three/drei'
import { RigidBody, RapierRigidBody, useRevoluteJoint, useFixedJoint, CylinderCollider } from "@react-three/rapier"
import { GLTF } from 'three-stdlib'
import { Quaternion, Vector3, Vector3Tuple, Vector4Tuple } from 'three'

type GLTFResult = GLTF & {
  nodes: {
    ['left-headlight']: THREE.Mesh
    ['right-headlight']: THREE.Mesh
    toplight4: THREE.Mesh
    toplight3: THREE.Mesh
    toplight2: THREE.Mesh
    toplight1: THREE.Mesh
    shadeBlack_002: THREE.Mesh
    shadeBlack_007: THREE.Mesh
    shadeBlack_004: THREE.Mesh
    shadeBlack_005: THREE.Mesh
    shadeBlack_006: THREE.Mesh
    shadeBlack_008: THREE.Mesh
    shadeBlack_009: THREE.Mesh
    shadeBlack_010: THREE.Mesh
    shadeBlack_013: THREE.Mesh
    shadeBlack_014: THREE.Mesh
    shadeBlack_015: THREE.Mesh
    shadeBlack_011: THREE.Mesh
    shadeBlack_023: THREE.Mesh
    shadeBlack_012: THREE.Mesh
    shadeBlack_016: THREE.Mesh
    shadeBlack_019: THREE.Mesh
    shadeBlack_020: THREE.Mesh
    shadeBlack_021: THREE.Mesh
    shadeBlack_022: THREE.Mesh
    shadeRed_002: THREE.Mesh
    shadeWhite001: THREE.Mesh
    shadeWhite_002001: THREE.Mesh
    shadeWhite_003001: THREE.Mesh
    shadeWhite_007: THREE.Mesh
    tireFL1: THREE.Mesh
    shadeWhite_006: THREE.Mesh
    axelBlockFL1: THREE.Mesh
    tireFR2: THREE.Mesh
    shadeWhite_006001: THREE.Mesh
    axelBlockFR2: THREE.Mesh
    tireRR3: THREE.Mesh
    shadeWhite_006002: THREE.Mesh
    axelBlockRR3: THREE.Mesh
    tireRl4: THREE.Mesh
    shadeWhite_006003: THREE.Mesh
    axelBlockRL4: THREE.Mesh
  }
  materials: {
    light: THREE.MeshStandardMaterial
    blacktrim: THREE.MeshStandardMaterial
    chasses: THREE.MeshStandardMaterial
    white: THREE.MeshStandardMaterial
    ['blacktrim.004']: THREE.MeshStandardMaterial
    ['blacktrim.005']: THREE.MeshStandardMaterial
    ['blacktrim.006']: THREE.MeshStandardMaterial
  }
}

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

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

export function BrunoIsaac(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/bruno-isaac-truck.glb') as GLTFResult

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
    if (!chassisRef.current) {
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
    <group {...props} dispose={null}>
      <RigidBody ref={chassisRef} colliders='hull' mass={2000}>
        <group rotation={[0, Math.PI, 0]} scale={1.75}>
          <mesh geometry={nodes['left-headlight'].geometry} material={materials.light} position={[0.88, 0.214, -0.313]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.422} />
          <mesh geometry={nodes['right-headlight'].geometry} material={materials.light} position={[0.88, 0.215, 0.292]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.422} />
          <mesh geometry={nodes.toplight4.geometry} material={materials.light} position={[-0.204, 0.777, -0.304]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.536} />
          <mesh geometry={nodes.toplight3.geometry} material={materials.light} position={[-0.204, 0.777, -0.112]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.536} />
          <mesh geometry={nodes.toplight2.geometry} material={materials.light} position={[-0.204, 0.778, 0.08]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.536} />
          <mesh geometry={nodes.toplight1.geometry} material={materials.light} position={[-0.204, 0.778, 0.272]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.536} />
          <mesh geometry={nodes.shadeBlack_002.geometry} material={materials.blacktrim} position={[0.882, 0.214, -0.313]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.342} />
          <mesh geometry={nodes.shadeBlack_007.geometry} material={materials.blacktrim} position={[0.882, 0.215, 0.292]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.342} />
          <mesh geometry={nodes.shadeBlack_004.geometry} material={materials.blacktrim} position={[-0.109, 0.292, -0.461]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.342} />
          <mesh geometry={nodes.shadeBlack_005.geometry} material={materials.blacktrim} position={[0.255, 0.451, -0.198]} rotation={[-1.712, -0.409, -0.056]} scale={0.342} />
          <mesh geometry={nodes.shadeBlack_006.geometry} material={materials.blacktrim} position={[0.255, 0.451, 0.158]} rotation={[-1.712, -0.409, -0.056]} scale={0.342} />
          <mesh geometry={nodes.shadeBlack_008.geometry} material={materials.blacktrim} position={[0.875, 0.214, -0.009]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.342} />
          <mesh geometry={nodes.shadeBlack_009.geometry} material={materials.blacktrim} position={[-0.492, 0.493, -0.039]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.342} />
          <mesh geometry={nodes.shadeBlack_010.geometry} material={materials.blacktrim} position={[-0.233, 0.772, -0.304]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.434} />
          <mesh geometry={nodes.shadeBlack_013.geometry} material={materials.blacktrim} position={[-0.233, 0.772, -0.112]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.434} />
          <mesh geometry={nodes.shadeBlack_014.geometry} material={materials.blacktrim} position={[-0.233, 0.773, 0.08]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.434} />
          <mesh geometry={nodes.shadeBlack_015.geometry} material={materials.blacktrim} position={[-0.233, 0.773, 0.272]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.434} />
          <mesh geometry={nodes.shadeBlack_011.geometry} material={materials.blacktrim} position={[0.356, 0.397, -0.505]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.342} />
          <mesh geometry={nodes.shadeBlack_023.geometry} material={materials.blacktrim} position={[0.356, 0.399, 0.476]} rotation={[1.569, 0, -Math.PI / 2]} scale={-0.342} />
          <mesh geometry={nodes.shadeBlack_012.geometry} material={materials.blacktrim} position={[-0.109, 0.294, 0.434]} rotation={[1.569, 0, -Math.PI / 2]} scale={-0.342} />
          <mesh geometry={nodes.shadeBlack_016.geometry} material={materials.blacktrim} position={[0.758, 0.407, 0.238]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.342} />
          <mesh geometry={nodes.shadeBlack_019.geometry} material={materials.blacktrim} position={[-0.994, 0.199, -0.014]} rotation={[-0.157, -1.565, -1.737]} scale={0.445} />
          <mesh geometry={nodes.shadeBlack_020.geometry} material={materials.blacktrim} position={[-0.91, 0.214, -0.339]} rotation={[-1.573, 0, -Math.PI / 2]} scale={0.342} />
          <mesh geometry={nodes.shadeBlack_021.geometry} material={materials.blacktrim} position={[-0.91, 0.215, 0.319]} rotation={[-1.573, 0, -Math.PI / 2]} scale={0.342} />
          <mesh geometry={nodes.shadeBlack_022.geometry} material={materials.blacktrim} position={[-0.07, 0.095, -0.02]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.342} />
          <mesh geometry={nodes.shadeRed_002.geometry} material={materials.chasses} position={[0.002, 0.424, -0.002]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.342} />
          <mesh geometry={nodes.shadeWhite001.geometry} material={materials.white} position={[0.063, 0.533, -0.014]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.342} />
          <mesh geometry={nodes.shadeWhite_002001.geometry} material={materials.white} position={[0.35, 0.421, -0.528]} rotation={[-1.573, 0, Math.PI / 2]} scale={0.342} />
          <mesh geometry={nodes.shadeWhite_003001.geometry} material={materials.white} position={[0.35, 0.424, 0.499]} rotation={[1.569, 0, -Math.PI / 2]} scale={-0.342} />
          <mesh geometry={nodes.shadeWhite_007.geometry} material={materials.white} position={[-1.095, 0.199, -0.014]} rotation={[-0.157, -1.565, -1.737]} scale={0.445} />
        </group>
      </RigidBody>
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

            <CylinderCollider mass={0.5} friction={5} args={[0.125, 0.25]} rotation={[-Math.PI / 2, 0, 0]} />
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

      {/* <mesh geometry={nodes.tireFL1.geometry} material={materials.blacktrim} position={[0.536, -0.193, -0.479]} rotation={[3.141, -0.006, -1.582]} scale={0.445} />
      <mesh geometry={nodes.shadeWhite_006.geometry} material={nodes.shadeWhite_006.material} position={[0.536, -0.193, -0.479]} rotation={[3.141, -0.006, -1.582]} scale={0.445} />
      <mesh geometry={nodes.axelBlockFL1.geometry} material={materials.blacktrim} position={[1.099, 0, -0.534]} />
      <mesh geometry={nodes.tireFR2.geometry} material={materials.blacktrim} position={[0.535, -0.193, 0.474]} rotation={[0, 0, 1.559]} scale={0.445} />
      <mesh geometry={nodes.shadeWhite_006001.geometry} material={nodes.shadeWhite_006001.material} position={[0.535, -0.193, 0.474]} rotation={[0, 0, 1.559]} scale={0.445} />
      <mesh geometry={nodes.axelBlockFR2.geometry} material={materials['blacktrim.004']} position={[1.099, 0, 0.009]} />
      <mesh geometry={nodes.tireRR3.geometry} material={materials.blacktrim} position={[-0.568, -0.193, 0.474]} rotation={[0, 0, 1.559]} scale={0.445} />
      <mesh geometry={nodes.shadeWhite_006002.geometry} material={nodes.shadeWhite_006002.material} position={[-0.568, -0.193, 0.474]} rotation={[0, 0, 1.559]} scale={0.445} />
      <mesh geometry={nodes.axelBlockRR3.geometry} material={materials['blacktrim.005']} position={[-0.004, 0, 0.009]} />
      <mesh geometry={nodes.tireRl4.geometry} material={materials.blacktrim} position={[-0.567, -0.193, -0.479]} rotation={[3.141, -0.006, -1.582]} scale={0.445} />
      <mesh geometry={nodes.shadeWhite_006003.geometry} material={nodes.shadeWhite_006003.material} position={[-0.567, -0.193, -0.479]} rotation={[3.141, -0.006, -1.582]} scale={0.445} />
      <mesh geometry={nodes.axelBlockRL4.geometry} material={materials['blacktrim.006']} position={[-0.004, 0, -0.529]} /> */}
    </group>
  )
}

useGLTF.preload('/bruno-isaac-truck.glb')
