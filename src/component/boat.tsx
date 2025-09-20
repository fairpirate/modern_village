// import { useRef, useState, useEffect } from 'react';
// import { useGLTF } from '@react-three/drei';
// import { useFrame, useThree } from '@react-three/fiber';
// import * as THREE from 'three';
// import { RigidBody } from '@react-three/rapier';

// export function BoatControlledGLB() {
//   const boatRef = useRef<THREE.Group>(null);
//   const boatPhyRef = useRef<any>(null);
//   const { scene } = useGLTF('/assets/row-boat.glb');
//   const { camera, size } = useThree();

//   const [angle, setAngle] = useState(0); // in radians
//   const [timeOffset] = useState(() => Math.random() * 1000);

//   const speed = 0.1;
//   const turnSpeed = Math.PI / 60; // turning angle per frame
//   const riverSize = { width: 100, length: 100 };
//   // const movement = useRef({ ArrowUp: false, ArrowLeft: false, ArrowRight: false });
//   const [movement, setMovement] = useState({ ArrowUp: false, ArrowLeft: false, ArrowRight: false });

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       // boatPhyRef.current.applyImpulse({ x: -8, y: 0, z: 0 });
//       // if (e.key in movement.current) movement.current[e.key as keyof typeof movement.current] = true;
//       if (e.key in movement) setMovement((m) => ({ ...m, [e.key]: true }));
//     };
//     const handleKeyUp = (e: KeyboardEvent) => {
//       // boatPhyRef.current.applyImpulse({ x:  8, y: 0, z: 0 });
//       // if (e.key in movement.current) movement.current[e.key as keyof typeof movement.current] = false;
//       if (e.key in movement) setMovement((m) => ({ ...m, [e.key]: false }));
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, []);

//   useEffect(() => {
//   // useFrame(({ clock }, delta) => {
//     if (!boatRef.current) return;

//     const { ArrowUp, ArrowLeft, ArrowRight } = movement;

//     // Handle turning
//     if (ArrowLeft) { 
//       console.log("left", angle + turnSpeed);
//       boatRef.current.rotation.y = angle + turnSpeed;
//       setAngle((a) => {  return a + turnSpeed })
//     };
//     if (ArrowRight) { 
//       console.log("Right", angle - turnSpeed);
//       boatRef.current.rotation.y = angle - turnSpeed;
//       setAngle((a) => {  return a - turnSpeed })
//     };

//     // Update rotation
//     boatRef.current.rotation.y = angle;

//     // Handle forward movement
//     if (ArrowUp) {
//       // const moveDir = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
//       // moveDir.multiplyScalar(speed * delta);
//       // boatRef.current.position.add(moveDir);
//       if (boatPhyRef.current) {
//         const forward = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
//         forward.normalize();
//         // Apply impulse in the forward direction
//         boatPhyRef.current.applyImpulse(
//           { x: forward.x * speed, y: 0, z: forward.z * speed },
//           true
//         );
//       }
//     }

//     // Clamp position within river
//     // const halfW = riverSize.width / 2 - 2;
//     // const halfL = riverSize.length / 2 - 2;
//     // boatRef.current.position.x = THREE.MathUtils.clamp(boatRef.current.position.x, -halfW, halfW);
//     // boatRef.current.position.z = THREE.MathUtils.clamp(boatRef.current.position.z, -halfL, halfL);

//     // Camera follow
//     // const offset = new THREE.Vector3(0, 5, 10);
//     // const targetPosition = boatRef.current.position.clone().add(offset);
//     // camera.position.lerp(targetPosition, 0.1);
//     // camera.lookAt(boatRef.current.position);
//     // camera.zoom = 6;
//     // camera.updateProjectionMatrix();

//     // Floating effect
//     // const t = clock.getElapsedTime() + timeOffset;
//     // boatRef.current.position.y = 0.01 + Math.sin(t * 1) * 0.01;
//   },[movement]);

//   return (<RigidBody ref={boatPhyRef} colliders="trimesh" type="dynamic" position={[0, 0, 0]} ><primitive ref={boatRef} object={scene} scale={5} position={[0, -1, 0]} /></RigidBody>);
// }

import { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';

export function BoatControlledGLB({  }: { }) {
  const boatRef = useRef<THREE.Group>(null);
  const boatPhyRef = useRef<RapierRigidBody>(null);
  const { scene } = useGLTF('/assets/row-boat.glb');

  const [angle, setAngle] = useState(0);
  const speed = 0.05;
  const turnSpeed = Math.PI / 60;
  const [movement, setMovement] = useState({ ArrowUp: false, ArrowLeft: false, ArrowRight: false });

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key in movement) setMovement(m => ({ ...m, [e.key]: true }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key in movement) setMovement(m => ({ ...m, [e.key]: false }));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Update physics each frame
  useFrame(({ clock }, delta) => {
    if (!boatRef.current || !boatPhyRef.current) return;

    const { ArrowUp, ArrowLeft, ArrowRight } = movement;

    // turning
    if (ArrowLeft) setAngle(a => a + turnSpeed);
    if (ArrowRight) setAngle(a => a - turnSpeed);
    boatRef.current.rotation.y = angle;

    // forward impulse
    if (ArrowUp) {
      const forward = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
      forward.normalize();
      boatPhyRef.current.applyImpulse(
        { x: forward.x * speed, y: 0, z: forward.z * speed },
        true
      );
    }

    // --- FLOATING / BUOYANCY ---
    const pos = boatPhyRef.current.translation();

    // Simple fake wave function (replace with your shader's height if needed)
    const waterHeight =
      Math.sin(pos.x * 0.2 + clock.elapsedTime) * 0.3 +
      Math.cos(pos.z * 0.2 + clock.elapsedTime) * 0.3;

    const depth = waterHeight - pos.y;

    if (depth > -0.2) {
      // apply upward force proportional to depth
      // boatPhyRef.current.applyImpulse({ x: 0, y: depth * 0.2, z: 0 }, true);

      // Optional rocking effect
      boatRef.current.rotation.z = Math.sin(clock.elapsedTime + pos.x) * 0.05;
      boatRef.current.rotation.x = Math.cos(clock.elapsedTime + pos.z) * 0.05;
    }
  });

  return (
    <RigidBody
      ref={boatPhyRef}
      // colliders="trimesh"
      type="dynamic"
      position={[0, 0, 0]}
      // mass={100}
      linearDamping={1.5} // slows down drift
      angularDamping={2.0} // slows down spin
    >
      <primitive ref={boatRef} object={scene} scale={5}  />
    </RigidBody>
  );
}
