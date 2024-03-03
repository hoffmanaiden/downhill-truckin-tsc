import React, { useRef, useEffect, useMemo, useState } from 'react';
import {
  BufferGeometry,
  PlaneGeometry,
  Euler,
  Mesh,
  Vector3,
  Matrix4,
  DoubleSide,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  WireframeGeometry
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
import Box from './Box';

const Ground = ({ position }: { position: any }) => {
  const ref = useRef<Mesh>(null);
  const [vertices, setVertices] = useState<number[]>([]);
  const [indices, setIndices] = useState<number[]>([]);

  // Create a plane geometry
  const geometry = new PlaneGeometry(200, 200, 20, 20);
  // Rotate the geometry 180 degrees around the x-axis
  geometry.rotateX(Math.PI / 2);
  geometry.rotateY(-Math.PI / 2);
  let i = 1

  useEffect(() => {
    if (ref.current) {
      // attach the plane to the mesh
      ref.current.geometry = geometry;

      // Move the first vertex 1 unit along the z-axis
      // ref.current.geometry.attributes.position.array[1] += 3;
      // ref.current.geometry.attributes.position.array[61] += 3;
      // ref.current.geometry.attributes.position.array[541] += 3;
      // ref.current.geometry.attributes.position.array[544] += 3;
      // ref.current.geometry.attributes.position.array[547] += 3;
      console.log(ref.current.geometry.attributes.position.array.length)
      while (i < ref.current.geometry.attributes.position.array.length) {
        let randomNumber: number = Math.random() / 2;
        if (i <= 121) {
          ref.current.geometry.attributes.position.array[i] -= (randomNumber);
        }
        if (i <= 241) {
          ref.current.geometry.attributes.position.array[i] -= (.5 + randomNumber);
        }
        if (i <= 361) {
          ref.current.geometry.attributes.position.array[i] -= (1 + randomNumber);
        }
        if (i <= 481) {
          ref.current.geometry.attributes.position.array[i] -= (1.5 + randomNumber);
        }
        if (i <= 601) {
          ref.current.geometry.attributes.position.array[i] -= (2 + randomNumber);
        }
        if (i <= 721) {
          ref.current.geometry.attributes.position.array[i] -= (2.5 + randomNumber);
        }
        i += 3
      }

      // Create a wireframe geometry from the plane geometry
      const wireframeGeometry = new WireframeGeometry(geometry);
      // Create a line segments from the wireframe geometry
      const wireframe = new LineSegments(wireframeGeometry, new LineBasicMaterial({ color: 0xffffff }));

      // Add the wireframe to the mesh
      ref.current.add(wireframe);


      // Need to tell Three.js to update the vertices
      ref.current.geometry.attributes.position.needsUpdate = true;

      setVertices(Array.from(ref.current.geometry.attributes.position.array))
      setIndices(Array.from(ref.current.geometry.index ? ref.current.geometry.index.array : []))
    }
  }, []);

  // <RigidBody colliders="trimesh" type="fixed" restitution={-1}>

  return (
    <group position={position}>
      <group position={[0, 100, 0]}>
        <directionalLight
          color={0xffffff} // white light
          castShadow // enable shadow casting
          intensity={1}
          shadow-camera-left={-100} // Adjust the left boundary of the shadow camera frustum
          shadow-camera-right={100} // Adjust the right boundary of the shadow camera frustum
          shadow-camera-top={100} // Adjust the top boundary of the shadow camera frustum
          shadow-camera-bottom={-100} // Adjust the bottom boundary of the shadow camera frustum
          shadow-camera-near={0.5} // Adjust the near clipping plane of the shadow camera frustum
          shadow-camera-far={200} // Adjust the far clipping plane of the shadow camera frustum
        />
        <Box visible={false}/>
      </group>
      <RigidBody type="fixed"  restitution={-5} friction={0.2}>
        <mesh ref={ref} receiveShadow={true}>
          {vertices.length > 0 && indices.length > 0 && (<TrimeshCollider args={[vertices, indices]} />)}
          <meshStandardMaterial attach="material" color="green" side={DoubleSide} />
        </mesh>
      </RigidBody>
    </group>
  );
};

export default Ground;