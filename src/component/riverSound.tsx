import { useRef, useEffect } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { AudioListener, AudioLoader, PositionalAudio } from 'three';

export function WaterSound() {
  const soundRef = useRef<any>(null);
  const { camera, scene } = useThree();
  const listener = useRef(new AudioListener());

  useEffect(() => {
    camera.add(listener.current);

    const audioLoader = new AudioLoader();
    const sound = new PositionalAudio(listener.current);
    soundRef.current = sound;

    audioLoader.load('/sounds/water-flow.mp3', (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
      sound.setRefDistance(20); // how far sound travels
      sound.play();
    });

    return () => {
      camera.remove(listener.current);
      if (soundRef.current) {
        soundRef.current.stop();
      }
    };
  }, [camera]);

  return (
    <primitive object={soundRef.current} position={[0, 0, 0]} />
  );
}
