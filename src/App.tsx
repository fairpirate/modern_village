import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import "./App.css";
import OceanScene from './scenes/oceanScene';
import { AppProvider } from './context/appcontext';

function App() {
  return (
    <AppProvider>
      <Canvas >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
        <Sky sunPosition={[100, 20, 100]} />
        <OceanScene />
        <OrbitControls enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[0, 0, 0]} />
      </Canvas>
    </AppProvider>
  );
}

export default App;
