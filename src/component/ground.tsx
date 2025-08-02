import { useTexture } from '@react-three/drei';
import { RepeatWrapping, DoubleSide } from 'three';

export default function Ground() {
    const [color/* , normal, roughness */] = useTexture([
        '/assets/ground.jpg',
        // '/assets/grass-normalgl.jpg',  // Not normalDX!
        // '/assets/grass-roughness.jpg'
    ]);
    [color/* , normal, roughness */].forEach(tex => {
        tex.wrapS = tex.wrapT = RepeatWrapping;
        tex.repeat.set(200, 200);
    });

    return (
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial
                map={color}
                // normalMap={normal}
                // roughnessMap={roughness}
                roughness={1}
            />
        </mesh>
    );
}


