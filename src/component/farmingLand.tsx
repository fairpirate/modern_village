import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

function FarmingGround() {
  const [color] = useTexture(['/assets/brown_mud.jpg']);
  [color/* , normal, roughness */].forEach(tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(500, 500);
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[5, 5]} />
      <meshStandardMaterial map={color} />
    </mesh>
  );
}

export default FarmingGround;