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
import { RigidBody } from '@react-three/rapier';

export function BoatControlledGLB() {
  const boatRef = useRef<THREE.Group>(null);
  const boatPhyRef = useRef<any>(null);
  const { scene } = useGLTF('/assets/row-boat.glb');
  const { camera, size } = useThree();

  const [angle, setAngle] = useState(0); // in radians
  const [timeOffset] = useState(() => Math.random() * 1000);

  const speed = 0.1;
  const turnSpeed = Math.PI / 60; // turning angle per frame
  const riverSize = { width: 100, length: 100 };
  // const movement = useRef({ ArrowUp: false, ArrowLeft: false, ArrowRight: false });
  const [movement, setMovement] = useState({ ArrowUp: false, ArrowLeft: false, ArrowRight: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // boatPhyRef.current.applyImpulse({ x: -8, y: 0, z: 0 });
      // if (e.key in movement.current) movement.current[e.key as keyof typeof movement.current] = true;
      if (e.key in movement) setMovement((m) => ({ ...m, [e.key]: true }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      // boatPhyRef.current.applyImpulse({ x:  8, y: 0, z: 0 });
      // if (e.key in movement.current) movement.current[e.key as keyof typeof movement.current] = false;
      if (e.key in movement) setMovement((m) => ({ ...m, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
  // useFrame(({ clock }, delta) => {
    if (!boatRef.current) return;

    const { ArrowUp, ArrowLeft, ArrowRight } = movement;

    // Handle turning
    if (ArrowLeft) { 
      console.log("left", angle + turnSpeed);
      boatRef.current.rotation.y = angle + turnSpeed;
      setAngle((a) => {  return a + turnSpeed })
    };
    if (ArrowRight) { 
      console.log("Right", angle - turnSpeed);
      boatRef.current.rotation.y = angle - turnSpeed;
      setAngle((a) => {  return a - turnSpeed })
    };

    // Update rotation
    boatRef.current.rotation.y = angle;

    // Handle forward movement
    if (ArrowUp) {
      // const moveDir = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
      // moveDir.multiplyScalar(speed * delta);
      // boatRef.current.position.add(moveDir);
      if (boatPhyRef.current) {
        const forward = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
        forward.normalize();
        // Apply impulse in the forward direction
        boatPhyRef.current.applyImpulse(
          { x: forward.x * speed, y: 0, z: forward.z * speed },
          true
        );
      }
    }

    // Clamp position within river
    // const halfW = riverSize.width / 2 - 2;
    // const halfL = riverSize.length / 2 - 2;
    // boatRef.current.position.x = THREE.MathUtils.clamp(boatRef.current.position.x, -halfW, halfW);
    // boatRef.current.position.z = THREE.MathUtils.clamp(boatRef.current.position.z, -halfL, halfL);

    // Camera follow
    // const offset = new THREE.Vector3(0, 5, 10);
    // const targetPosition = boatRef.current.position.clone().add(offset);
    // camera.position.lerp(targetPosition, 0.1);
    // camera.lookAt(boatRef.current.position);
    // camera.zoom = 6;
    // camera.updateProjectionMatrix();

    // Floating effect
    // const t = clock.getElapsedTime() + timeOffset;
    // boatRef.current.position.y = 0.01 + Math.sin(t * 1) * 0.01;
  },[movement]);

  return (<RigidBody ref={boatPhyRef} colliders="trimesh" type="dynamic" position={[0, 0, 0]} ><primitive ref={boatRef} object={scene} scale={5} position={[0, -1, 0]} /></RigidBody>);
}

