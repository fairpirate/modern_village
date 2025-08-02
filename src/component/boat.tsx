// import * as THREE from 'three';
// import { useRef, useEffect, useState } from 'react';
// import { useFrame, useThree } from '@react-three/fiber';
// import { useGLTF } from '@react-three/drei';

// export function BoatControlledGLB() {
//   const boatRef = useRef<THREE.Group>(null);
//   const { camera } = useThree();
//   const { scene } = useGLTF('/assets/row-boat.glb');

//   const [velocity, setVelocity] = useState({ x: 0, z: 0 });

//   // Handle keyboard controls
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       setVelocity((prev) => {
//         switch (e.key.toLowerCase()) {
//           case 'w': return { ...prev, z: -0.2 };
//           case 's': return { ...prev, z: 0.2 };
//           case 'a': return { ...prev, x: -0.2 };
//           case 'd': return { ...prev, x: 0.2 };
//           default: return prev;
//         }
//       });
//     };
//     const handleKeyUp = () => {
//       setVelocity({ x: 0, z: 0 });
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, []);

//   useFrame(() => {
//     if (!boatRef.current) return;

//     const boat = boatRef.current;
//     boat.position.x += velocity.x;
//     boat.position.z += velocity.z;

//     if (velocity.x !== 0 || velocity.z !== 0) {
//       const angle = Math.atan2(velocity.x, velocity.z);
//       boat.rotation.y = angle;
//     }

//     // Smooth camera follow
//     const targetPos = new THREE.Vector3(
//       boat.position.x,
//       boat.position.y + 5,
//       boat.position.z + 10
//     );
//     camera.position.lerp(targetPos, 0.1);
//     camera.lookAt(boat.position);
//     camera.zoom = 6;
//     // camera.rotation.y = boat.rotation.y;
//     camera.updateProjectionMatrix();
//   });

//   return (
//     <primitive
//       ref={boatRef}
//       object={scene}
//       scale={2}
//       position={[10, 0.01, 0]}
//     />
//   );
// }

import { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function BoatControlledGLB() {
  const boatRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/assets/row-boat.glb');
  const { camera, size } = useThree();
  const [direction, setDirection] = useState<[number, number]>([0, 0]);
  const [timeOffset] = useState(() => Math.random() * 1000);

  const speed = 1;
  const riverSize = { width: 100, length: 100 };

  // Touch / mouse event handlers
  useEffect(() => {
    let startX = 0, startY = 0;

    const handleStart = (e: TouchEvent | MouseEvent) => {
      const point = 'touches' in e ? e.touches[0] : e;
      startX = point.clientX;
      startY = point.clientY;
    };

    const handleMove = (e: TouchEvent | MouseEvent) => {
      const point = 'touches' in e ? e.touches[0] : e;
      const dx = point.clientX - startX;
      const dy = point.clientY - startY;
      setDirection([dx / size.width, dy / size.height]);
    };

    const handleEnd = () => setDirection([0, 0]);

    window.addEventListener('touchstart', handleStart);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);
    // window.addEventListener('mousedown', handleStart);
    // window.addEventListener('mousemove', handleMove);
    // window.addEventListener('mouseup', handleEnd);

    return () => {
      window.removeEventListener('touchstart', handleStart);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('mousedown', handleStart);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
    };
  }, [size.width, size.height]);

  useFrame(({clock}, delta) => {
    if (!boatRef.current) return;

    const [dx, dy] = direction;
    const move = new THREE.Vector3(dx, 0, dy).normalize().multiplyScalar(speed * delta);
    boatRef.current.position.add(move);

    // Clamp within river area
    const halfW = riverSize.width / 2 - 2;
    const halfL = riverSize.length / 2 - 2;
    boatRef.current.position.x = THREE.MathUtils.clamp(boatRef.current.position.x, -halfW, halfW);
    boatRef.current.position.z = THREE.MathUtils.clamp(boatRef.current.position.z, -halfL, halfL);

    // Camera follow
    const offset = new THREE.Vector3(0, 5, 10);
    const targetPosition = boatRef.current.position.clone().add(offset);
    camera.position.lerp(targetPosition, 0.1);
    camera.lookAt(boatRef.current.position);
    camera.zoom = 6;
    camera.updateProjectionMatrix();
    const t = clock.getElapsedTime() + timeOffset;
    boatRef.current.position.y = 0.01 + Math.sin(t * 1) * 0.01;
  });

  return <primitive ref={boatRef} object={scene} scale={5} position={[0, 0.01, 0]} />;
}
