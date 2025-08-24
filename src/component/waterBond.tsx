import * as THREE from 'three';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

export function WaterBondWithWall() {
  const waterBondRef = useRef<any>(null);
  const [color2] = useTexture(['/assets/ground.jpg']);

  const [color, normal] = useTexture([
    '/assets/water-color.jpg',
    '/assets/water-normalgl.jpg',
  ]);

  // Animate UVs for water flow
  useFrame((_, delta) => {
    if (waterBondRef.current) {
      waterBondRef.current.material.map.offset.y -= delta * 0.05;
    }
  });

  [color, normal].forEach(tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(100, 100);
  });

  color2.wrapS = color2.wrapT = THREE.RepeatWrapping;
  color2.repeat.set(10, 10); // Tune this to your liking

  return (
    <>
      {/* Water Plane */}
      <RigidBody  position={[0, -2, 0]} colliders="hull" type="fixed">
        <mesh
          ref={waterBondRef}
          receiveShadow
          position={[0, 0, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[50, 50]} />
          <meshStandardMaterial
            transparent
            map={color}
            normalMap={normal}
            opacity={0.7}
            color="skyblue"
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="trimesh">
        <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[50, 1.5, 100, 20]} />
          <meshStandardMaterial roughness={1} map={color2} />
        </mesh>
      </RigidBody>
    </>
  );
}
