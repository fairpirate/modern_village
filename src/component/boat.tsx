import { useRef, useState, useEffect } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';

export function BoatControlledGLB({ }: {}) {
  const boatRef = useRef<THREE.Group>(null);
  const manRef = useRef<THREE.Group>(null);
  const boatPhyRef = useRef<RapierRigidBody>(null);
  const { scene, animations } = useGLTF('/assets/woodenBoat.glb');
  const { scene: manScene, animations: manAnimations } = useGLTF('/assets/xbotanimated.glb');
  const { actions } = useAnimations(manAnimations, manScene)
  const angleRef = useRef(0);
  const speed = 2;
  const turnSpeed = Math.PI / 60;
  const [movement, setMovement] = useState({ ArrowUp: false, ArrowLeft: false, ArrowRight: false });
  const headOffset = new THREE.Vector3(0, 4.9, -1); // height of eyes
  const { camera } = useThree();
  const boatQuatRef = useRef(new THREE.Quaternion());

  // Handle keyboard input
  useEffect(() => {
    console.log("manAnimations:", manAnimations,actions);
    actions.sitting?.play()
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

  useFrame(({ clock }) => {
    if (!boatRef.current || !boatPhyRef.current || !manRef.current) return;

    const { ArrowUp, ArrowLeft, ArrowRight } = movement;
    const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, angleRef.current, 0));

    // TURN
    if (ArrowLeft) angleRef.current += turnSpeed;
    if (ArrowRight) angleRef.current -= turnSpeed;

    boatQuatRef.current.setFromEuler(
      new THREE.Euler(0, angleRef.current, 0)
    );

    // MOVE
    if (ArrowUp) {
      const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(quat).normalize();
      
      boatPhyRef.current.setLinvel({ x: forward.x * speed, y: 0, z: forward.z * speed, }, true);
    }

    const pos = boatPhyRef.current.translation();
    
    boatRef.current.rotation.z = Math.sin(clock.elapsedTime + pos.x) * 0.05;
    boatRef.current.rotation.x = Math.cos(clock.elapsedTime + pos.z) * 0.05;

    boatPhyRef.current.setRotation(quat, true);
    // --- CAMERA POV (FIXED) ---

    const headPos = new THREE.Vector3();
    const headQuat = new THREE.Quaternion();

    // get man world transform
    manRef.current.getWorldPosition(headPos);
    manRef.current.getWorldQuaternion(headQuat);

    // apply local offset correctly
    const camOffset = headOffset.clone().applyQuaternion(headQuat);
    headPos.add(camOffset);

    // smooth camera position
    // camera.position.lerp(headPos, 0.2);

    // forward direction (-Z is forward in Three.js)
    const forward = new THREE.Vector3(0, -1, -1).applyQuaternion(headQuat).normalize();

    // look forward
    // camera.lookAt(
    //   headPos.x + forward.x,
    //   headPos.y + forward.y,
    //   headPos.z + forward.z
    // );
  });

  return (
    <RigidBody
      ref={boatPhyRef}
      type="dynamic"
      linearDamping={1.5}
      angularDamping={2.0}
    >
      <group ref={boatRef}>
        {/* Boat */}
        <primitive object={scene} scale={1} />

        {/* Man inside boat */}
        <primitive
          ref={manRef}
          object={manScene}
          scale={2}
          position={[0, 0.5, -0.5]}  // adjust to sit in boat
          rotation={[0, Math.PI/8, 0]} // face forward
        />
      </group>
    </RigidBody>
  );
}
