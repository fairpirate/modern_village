// import Temple from './models/Temple';
// import Hut from './models/Hut';
// import Tree from './models/Tree';
// import Ground from './components/Ground';
// import River from './components/River';

import { BoatControlledGLB } from "../component/boat";
import Ground from "../component/ground";
import { River } from "../component/river";

export default function VillageScene() {
  return (
    <>
      <Ground  />
      <River />
      <BoatControlledGLB />
      {/* Temples */}
      {/* <Temple position={[-8, 0, -5]} />
      <Temple position={[-4, 0, 2]} />
      <Temple position={[-10, 0, 3]} /> */}
      
      {/* Huts */}
      {/* <Hut position={[6, 0, -3]} />
      <Hut position={[10, 0, -2]} />
      <Hut position={[7, 0, 2]} />
      <Hut position={[11, 0, 3]} />
      <Hut position={[8, 0, 6]} /> */}

      {/* Trees (place multiple) */}
      {/* <Tree position={[2, 0, 4]} />
      <Tree position={[4, 0, -5]} />
      <Tree position={[-6, 0, 4]} /> */}
      {/* Add many more trees with random spread */}
    </>
  );
}
