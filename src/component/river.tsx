import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { BoatControlledGLB } from './boat';

export function River() {
    const riverRef = useRef<any>(null);
    const [color, normal] = useTexture([
        '/assets/water-color.jpg',
        '/assets/water-normalgl.jpg',  // Not normalDX!
    ]);

    // Animate UVs for water flow
    useFrame((_, delta) => {
        if (riverRef.current) {
            riverRef.current.material.map.offset.y -= delta * 0.05;
        }
    });


    [color, normal].forEach(tex => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(100, 100);
    });

    return (
        <mesh receiveShadow position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} ref={riverRef}>
            {/* You can shape this with a custom geometry if needed */}
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial
                map={color}
                normalMap={normal}
                transparent
                opacity={0.7}
                color="skyblue"
                roughness={0.2}
                metalness={0.3}
            />
        </mesh>
    );
}
