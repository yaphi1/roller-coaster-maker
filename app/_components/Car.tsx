import { RefObject } from "react";
import { globalSettings } from "../_utils/globalSettings";
import { Group } from "three";

// export default function Car({ carRef }: { carRef: Ref<Group> }) {
export default function Car({ carRef }: { carRef: RefObject<Group> }) {
  return (
    <group ref={carRef}>
      <CarModel />
    </group>
  );
}

function CarModel() {
  return (
    <group>
      <mesh position-y={0.25}>
        <boxGeometry args={[1, 0.5, 1]} />
        <meshStandardMaterial color="#0088cb" wireframe={globalSettings.isDebugMode} />
      </mesh>
    </group>
  );
}

function CarModelDebugVersion() {
  return (
    <group>
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="lightgreen" />
      </mesh>
      <mesh position-y={1} scale={0.2}>
        <coneGeometry />
        <meshStandardMaterial color="yellow" />
      </mesh>
      <mesh position-z={1} scale={0.2}>
        <sphereGeometry />
        <meshStandardMaterial color="red" />
      </mesh>
      <mesh position-x={1} scale={0.2}>
        <sphereGeometry />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}
