import * as THREE from 'three';
import { RefObject } from "react";
import { globalSettings } from "../_utils/globalSettings";
import { Group } from "three";

export default function Car({ carRef, isFrontCar }: { carRef: RefObject<Group>, isFrontCar: boolean }) {
  return (
    <group ref={carRef}>
      <CarModel isFrontCar={isFrontCar} />
    </group>
  );
}

const bodyMaterial = (
  <meshStandardMaterial
    color="#0098db"
    wireframe={globalSettings.isDebugMode}
  />
);
const metalMaterial = (
  <meshStandardMaterial
    color="silver"
    roughness={0.3}
    metalness={0.7}
    wireframe={globalSettings.isDebugMode}
  />
);
const darkMetalMaterial = (
  <meshStandardMaterial
    color="#888"
    roughness={0.3}
    metalness={0.7}
    wireframe={globalSettings.isDebugMode}
  />
);
const seatMaterial = (
  <meshStandardMaterial
    color="#0098db"
    roughness={0.3}
    metalness={0.7}
    wireframe={globalSettings.isDebugMode}
  />
);

function CarModel({ isFrontCar = false }) {
  const bottom = (<mesh position-y={0.25}><boxGeometry args={[1, 0.1, 1]} />{bodyMaterial}</mesh>);
  const back = (<mesh position={[0, 0.45, -0.45]}><boxGeometry args={[1, 0.5, 0.1]} />{bodyMaterial}</mesh>);
  const front = (<mesh position={[0, 0.45, 0.45]}><boxGeometry args={[1, 0.5, 0.1]} />{bodyMaterial}</mesh>);
  const left = (<mesh position={[0.45, 0.45, 0]}><boxGeometry args={[0.1, 0.5, 1]} />{bodyMaterial}</mesh>);
  const right = (<mesh position={[-0.45, 0.45, 0]}><boxGeometry args={[0.1, 0.5, 1]} />{bodyMaterial}</mesh>);

  return (
    <group>
      <CarBody isFrontCar={isFrontCar} />
      <Seats />
      <Wheels />
    </group>
  );
}

function CarBody({ isFrontCar = false }) {
  const bottom = (<mesh position-y={0.25}><boxGeometry args={[1, 0.1, 1]} />{bodyMaterial}</mesh>);
  const back = (<mesh position={[0, 0.45, -0.45]}><boxGeometry args={[1, 0.5, 0.1]} />{bodyMaterial}</mesh>);
  const front = (<mesh position={[0, 0.45, 0.45]}><boxGeometry args={[1, 0.5, 0.1]} />{bodyMaterial}</mesh>);
  const left = (<mesh position={[0.45, 0.45, 0]}><boxGeometry args={[0.1, 0.5, 1]} />{bodyMaterial}</mesh>);
  const right = (<mesh position={[-0.45, 0.45, 0]}><boxGeometry args={[0.1, 0.5, 1]} />{bodyMaterial}</mesh>);

  return (
    <group>
      {bottom}
      {back}
      {front}
      {left}
      {right}
      {isFrontCar && <TrainFront />}
    </group>
  );
};

function Seats() {
  return (
    <group>
      <Seat position={[0.2, 0.6, -0.32]} />
      <Seat position={[-0.2, 0.6, -0.32]} />
    </group>
  );
}

function Seat(
  { position }:
  { position: number[] }
) {
  const seatBack = (
    <mesh scale-z={0.3} rotation-x={Math.PI * -0.05}>
      <capsuleGeometry args={[0.18, 0.4]} />
      {seatMaterial}
    </mesh>
  );

  const seatBottom = (
    <mesh scale-z={0.4} rotation-x={Math.PI * 0.5} position={[0, -0.2, 0.15]}>
      <capsuleGeometry args={[0.18, 0.06]} />
      {seatMaterial}
    </mesh>
  );

  const restraintPath: THREE.CurvePath<THREE.Vector3> = new THREE.CurvePath();
  restraintPath.add(
    new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.1, 0.3, 0),
      new THREE.Vector3(-0.1, 0.3, 0.2),
      new THREE.Vector3(-0.1, 0, 0.2),
    )
  );
  restraintPath.add(
    new THREE.LineCurve3(
      new THREE.Vector3(-0.1, 0, 0.2),
      new THREE.Vector3(0.1, 0, 0.2),
    )
  );
  restraintPath.add(
    new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0.1, 0, 0.2),
      new THREE.Vector3(0.1, 0.3, 0.2),
      new THREE.Vector3(0.1, 0.3, 0),
    )
  );

  const restraint = (
    <mesh position-z={-0.03} position-y={-0.01}>
      <tubeGeometry args={[restraintPath, 40, 0.02]}/>
      {metalMaterial}
    </mesh>
  );

  return (
    <group position={new THREE.Vector3(...position)}>
      {seatBack}
      {seatBottom}
      {restraint}
    </group>
  );
}

function Wheels() {
  return (
    <group>
      <Wheel position={[-0.56, 0.18, 0.4]} />
      <Wheel position={[-0.56, 0.18, -0.4]} />
      <Wheel position={[0.56, 0.18, 0.4]} />
      <Wheel position={[0.56, 0.18, -0.4]} />
    </group>
  );
}

function Wheel(
  { position, rotationZ = Math.PI * 0.5 }:
  { position: number[], rotationZ?: number }
) {
  return (
    <group position={new THREE.Vector3(...position)}>
      <mesh rotation-z={rotationZ}>
        <cylinderGeometry args={[0.05, 0.05, 0.05]} />
        {darkMetalMaterial}
      </mesh>
      <mesh rotation-z={rotationZ} rotation-y={Math.PI * 0.5}>
        <torusGeometry args={[0.08, 0.03]} />
        {metalMaterial}
      </mesh>
    </group>
  );
}

function TrainFront() {
  const width = 0.81;
  const height = 0.3;
  const shape = new THREE.Shape();
  shape.moveTo(-width/2, 0);
  shape.lineTo(-width/2, height);
  shape.lineTo(width/2, height);
  shape.lineTo(width/2, 0);
  shape.lineTo(-width/2, 0);

  const extrudeSettings = {
    steps: 1,
    depth: 0,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: 0.2,
    bevelOffset: -0.1,
    bevelSegments: 50,
  };

  const trainFront = (
    <mesh position={[0, 0.3, 0.45]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      {bodyMaterial}
    </mesh>
  );

  return trainFront;
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
