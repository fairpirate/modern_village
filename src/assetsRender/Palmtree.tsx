
// import React, { useEffect, useRef } from "react";
// import { useGLTF } from "@react-three/drei";
// import * as THREE from "three";

// export function PalmForest({ count = 500 }) {
//   const { nodes, materials }: any = useGLTF("/assets/palmtree.glb");

//   // refs for instanced meshes
//   const instancedRefs = useRef<Record<string, THREE.InstancedMesh>>({});

//   useEffect(() => {
//     const dummy = new THREE.Object3D();

//     for (let i = 0; i < count; i++) {
//       const x = (Math.random() - 0.5) * 5;
//       const z = (Math.random() - 0.5) * 5;
//       const y = 0;

//       dummy.position.set(x, y, z);
//       dummy.rotation.y = Math.random() * Math.PI * 2;
//       dummy.scale.setScalar(0.1 * Math.random());
//       dummy.updateMatrix();

//       // update all instanced parts with same transform
//       Object.values(instancedRefs.current).forEach((inst) => {
//         inst.setMatrixAt(i, dummy.matrix);
//       });
//     }

//     Object.values(instancedRefs.current).forEach((inst) => {
//       inst.instanceMatrix.needsUpdate = true;
//     });
//   }, [count]);

//   return (
//     <group>
//       {/* Example: You must repeat this pattern for every geometry+material */}
//       <instancedMesh
//         ref={(ref) => (instancedRefs.current["Trunk"] = ref!)}
//         args={[nodes.Trunk.geometry, materials.Palm_Bark, count]}
//       />
//       <instancedMesh
//         ref={(ref) => (instancedRefs.current["Leaves"] = ref!)}
//         args={[nodes.Leaves.geometry, materials.Palm_Leaves, count]}
//       />
//       <instancedMesh
//         ref={(ref) => (instancedRefs.current["Coconut"] = ref!)}
//         args={[nodes["Model-335-lp"].geometry, materials.Coconut, count]}
//       />
//       {/* ...add all the other node/material pairs you want to include... */}
//     </group>
//   );
// }

// useGLTF.preload("/palmtree.glb");

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useFBX, useTexture } from "@react-three/drei";
import * as THREE from "three";

export function PalmTree() {
  const fbx = useFBX("/assets/palmtree/palma.fbx"); // place FBX in /public/models/

  const [
    barkAO,
    barkDisp,
    barkNormal,
    leafAO,
    leafNormal,
    leafSpecular,
  ] = useTexture([
    "/assets/palmtree/Bark_Tex_AO.png",
    "/assets/palmtree/Bark_Tex_Dis.png",
    "/assets/palmtree/Bark_Tex_N.png",
    "/assets/palmtree/palm_leaf_ao.png",
    "/assets/palmtree/palm_leaf_n.png",
    "/assets/palmtree/palm_leaf_specul.png",
  ]);

  // Configure texture wrapping for bark
  [barkAO, barkDisp, barkNormal].forEach((tex) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 4);
  });

  fbx.traverse((child) => {
   console.log("Mesh name:", child.name);
});

  // Traverse FBX and assign materials
  fbx.traverse((child) => {
    if (child.name === "Light") {
    fbx.remove(child);
  }
    if (child.name === "Light001") {
    fbx.remove(child);
  }
    
    if (child instanceof THREE.Mesh) {
      // child.castShadow = true;
      // child.receiveShadow = true;

      // if (child.name.toLowerCase().includes("trunk")) {
        child.material = new THREE.MeshStandardMaterial({
          aoMap: barkAO,
          displacementMap: barkDisp,
          displacementScale: 0.15,
          normalMap: barkNormal,
          roughness: 0.9,
          metalness: 0.8,
        });
      // }

      // if (child.name.toLowerCase().includes("leaf")) {
        child.material = new THREE.MeshStandardMaterial({
          map: leafAO, // AO as diffuse, can tint with "color"
          aoMap: leafAO,
          normalMap: leafNormal,
          // transparent: true,
          alphaTest: 0.5,
          side: THREE.DoubleSide,
          color: new THREE.Color("#2b7a2b"), // green tint
          displacementMap: barkDisp,
        });
      // }
    }
  });

  return <primitive object={fbx} scale={0.01} position={[0, 0, 0]} />;
}