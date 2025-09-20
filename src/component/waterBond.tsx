import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { Water } from 'three/examples/jsm/objects/Water.js';

export function WaterBondWithWall() {
  const waterGroup = useRef<THREE.Group>(null);
  const water = useRef<any>(null);

  // Ground wall texture
  const groundTex = useTexture('/assets/ground.jpg');
  groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping;
  groundTex.repeat.set(10, 10);

  // Water textures
  const [waterColor, waterNormal] = useTexture([
    '/assets/water-color.jpg',
    '/assets/water-normalgl.jpg',
  ]);
  [waterColor, waterNormal].forEach(tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(100, 100);
  });

  // Animate water shader
  useFrame((_, delta) => {
    if (water.current) {
      water.current.material.uniforms['time'].value += delta * 0.2; // control wave speed
    }
  });

  useEffect(() => {
    const geometry = new THREE.CircleGeometry(50, 128); // More segments = smoother waves

    const waterObj = new Water(geometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: waterNormal,
      alpha: 1.0,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3,
    });

    waterObj.rotation.x = -Math.PI / 2;
    water.current = waterObj;

    if (waterGroup.current) {
      waterGroup.current.add(waterObj);
    }

    return () => {
      if (waterGroup.current) {
        waterGroup.current.remove(waterObj);
      }
      waterObj.geometry.dispose();
      waterObj.material.dispose();
    };
  }, [waterNormal]);

  return (
    <>
      {/* Water */}
      <RigidBody type="fixed">
       <group ref={waterGroup} position={[0, -2, 0]} />
      </RigidBody>

      {/* Circular Wall */}
      <RigidBody type="fixed" colliders="trimesh">
        <mesh
          position={[0, -10, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          castShadow
          receiveShadow
        >
          <torusGeometry args={[50, 10, 200, 20]} />
          <meshStandardMaterial roughness={1} map={groundTex} clippingPlanes={[new THREE.Plane(new THREE.Vector3(1, 0, 0), 0)]} clipShadows />
        </mesh>
      </RigidBody>
    </>
  );
}
