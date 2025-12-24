import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { Water } from 'three/examples/jsm/objects/Water.js';

export function OceanView() {
  const waterGroup = useRef<THREE.Group>(null);
  const water = useRef<any>(null);

  // Water textures
  const [waterColor, waterNormal] = useTexture([
    '/assets/water-color.jpg',
    '/assets/water-normalgl.jpg',
  ]);
  [waterColor, waterNormal].forEach(tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1000, 1000);
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
         <group ref={waterGroup} position={[0, -0.5, 0]} />
      </RigidBody>
    </>
  );
}
