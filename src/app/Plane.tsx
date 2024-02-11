import React, { useRef, useEffect, useMemo, useState } from 'react';
import {
  BufferGeometry,
  PlaneGeometry,
  Euler,
  Mesh,
  Vector3,
  Matrix4,
  DoubleSide
} from 'three';
import {
  TrimeshCollider,
  RigidBodyAutoCollider,
  MeshCollider,
  Physics,
  RigidBody,
  RapierRigidBody,
  useRevoluteJoint,
  useFixedJoint,
  CylinderCollider,
  CuboidCollider
} from "@react-three/rapier"

const Ground = () => {
  const ref = useRef<Mesh>(null);
  const [vertices, setVertices] = useState<number[]>([]);
  const [indices, setIndices] = useState<number[]>([]);

  // Create a plane geometry
  const geometry = new PlaneGeometry(50, 50, 4, 4);
  // Rotate the geometry 180 degrees around the x-axis
  geometry.rotateX(Math.PI / 2);

  useEffect(() => {
    if (ref.current) {
      // attach the plane to the mesh
      ref.current.geometry = geometry;
      console.log(ref.current.geometry.attributes.position.array);

      // Move the first vertex 1 unit along the z-axis
      ref.current.geometry.attributes.position.array[1] += 3;

      // Need to tell Three.js to update the vertices
      ref.current.geometry.attributes.position.needsUpdate = true;

      setVertices(Array.from(ref.current.geometry.attributes.position.array))
      setIndices(Array.from(ref.current.geometry.index ? ref.current.geometry.index.array : []))
    }
  }, []);

  // <RigidBody colliders="trimesh" type="fixed" restitution={-1}>

  return (
    <RigidBody type="fixed" position={[0,-5,0]}>
      {vertices.length > 0 && indices.length > 0 && (
        <TrimeshCollider args={[vertices, indices]} />
      )}
      <mesh ref={ref} position={[0, 0, 0]}>
        <meshStandardMaterial attach="material" color="green" side={DoubleSide} />
      </mesh>
    </RigidBody>
  );
};

export default Ground;