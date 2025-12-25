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
  const turnSpeed = Math.PI / 500;
  const [movement, setMovement] = useState({ ArrowUp: false, ArrowLeft: false, ArrowRight: false });
  const headOffset = new THREE.Vector3(0, 4.9, -1); // height of eyes
  const { camera } = useThree();
  const boatQuatRef = useRef(new THREE.Quaternion());
  const headBoneRef = useRef<any>(null);
  const quat = useRef(new THREE.Quaternion());
  const headPos = useRef(new THREE.Vector3());
  const headQuat = useRef(new THREE.Quaternion());


  // Handle keyboard input
  useEffect(() => {
    console.log(manAnimations, actions);
    manRef.current?.traverse(obj => {
    if (
      obj.type === 'Bone' &&
      obj.name.toLowerCase().includes('head')
    ) {
      headBoneRef.current = obj;
      console.log('Head bone found:', obj.name);
    }
    
  });
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

    quat.current.setFromEuler(
      new THREE.Euler(0, angleRef.current, 0)
    );

    // TURN
    if (ArrowLeft) angleRef.current += turnSpeed;
    if (ArrowRight) angleRef.current -= turnSpeed;

    boatQuatRef.current.setFromEuler(
      new THREE.Euler(0, angleRef.current, 0)
    );

    // MOVE
    if (ArrowUp) {
      const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(quat.current).normalize();

      boatPhyRef.current.setLinvel({ x: forward.x * speed, y: 0, z: forward.z * speed, }, true);
    }

    const pos = boatPhyRef.current.translation();

    boatRef.current.rotation.z = Math.sin(clock.elapsedTime + pos.x) * 0.05;
    boatRef.current.rotation.x = Math.cos(clock.elapsedTime + pos.z) * 0.05;

    boatPhyRef.current.setRotation(quat.current, true);
    // --- CAMERA POV (FIXED) ---

   

    // get man world transform
    headBoneRef.current?.updateWorldMatrix(true, false);
    headBoneRef.current?.getWorldPosition(headPos.current);
    headBoneRef.current?.getWorldQuaternion(headQuat.current);

    // manRef.current.getWorldPosition(headPos);
    // manRef.current.getWorldQuaternion(headQuat);

    // apply local offset correctly
    // const camOffset = headOffset.clone().applyQuaternion(headQuat.current);
    // headPos.current.add(camOffset);

    // smooth camera position
    camera.position.lerp(headPos.current, 0.2);

    const forward = new THREE.Vector3(0,0,-1).applyQuaternion(headQuat.current).normalize();
    const backward = forward.clone().multiplyScalar(-1);

    // look forward
    camera.lookAt(
      headPos.current.x + backward.x,
      headPos.current.y + backward.y,
      headPos.current.z + backward.z
    );
  });

  return (
    <RigidBody
      ref={boatPhyRef}
      type="dynamic"
      colliders="hull"
      linearDamping={1.5}
      angularDamping={2.0}
      gravityScale={0}
    >
      <group ref={boatRef} position={[0, -0.5, 0]}>
        {/* Boat */}
        <primitive object={scene} scale={1} />

        {/* Man inside boat */}
        <primitive
          ref={manRef}
          object={manScene}
          scale={2}
          position={[0, 0, 0]}  // adjust to sit in boat
          // rotation={[0, Math.PI / 8, 0]} // face forward
        />
      </group>
    </RigidBody>
  );
}
