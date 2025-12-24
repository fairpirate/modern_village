import { Physics, RigidBody } from "@react-three/rapier";
import { BoatControlledGLB } from "../component/boat";
import {  OceanView } from "../component/waterBond";

export default function VillageScene() {
  return (
    <Physics gravity={[0, -9.81, 0]}>
      <BoatControlledGLB />
      <OceanView />
    </Physics>
  );
}
