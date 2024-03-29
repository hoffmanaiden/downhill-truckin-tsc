/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 leafTree.glb -t 
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, KeyboardControls, useKeyboardControls, OrbitControls, CameraControls } from '@react-three/drei'
import { RigidBody, RapierRigidBody, useRevoluteJoint, useFixedJoint, CylinderCollider } from "@react-three/rapier"
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder: THREE.Mesh
    Sphere: THREE.Mesh
    Sphere001: THREE.Mesh
    Sphere002: THREE.Mesh
    Sphere003: THREE.Mesh
  }
  materials: {
    wood: THREE.MeshStandardMaterial
    Green: THREE.MeshStandardMaterial
    ['Green.001']: THREE.MeshStandardMaterial
    ['Green.002']: THREE.MeshStandardMaterial
    ['Green.003']: THREE.MeshStandardMaterial
  }
}

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

export function LeafTree(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/leafTree.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <RigidBody colliders="trimesh" type='fixed'>
        <mesh geometry={nodes.Cylinder.geometry} material={materials.wood} scale={[0.699, 1, 0.699]} />
        <mesh geometry={nodes.Sphere.geometry} material={materials.Green} position={[-0.039, 6.206, 0.317]} scale={[3.625, 2.152, 3.625]} />
        <mesh geometry={nodes.Sphere001.geometry} material={materials['Green.001']} position={[0.62, 7.013, -1.564]} scale={[2.761, 2.021, 2.761]} />
        <mesh geometry={nodes.Sphere002.geometry} material={materials['Green.002']} position={[-0.039, 8.642, 0.427]} scale={[2.295, 1.319, 2.295]} />
        <mesh geometry={nodes.Sphere003.geometry} material={materials['Green.003']} position={[1.442, 9.088, 0.768]} scale={[1.184, 1.701, 1.184]} />
      </RigidBody>
    </group>
  )
}

useGLTF.preload('/leafTree.glb')
