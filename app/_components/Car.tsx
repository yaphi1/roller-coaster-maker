import * as THREE from 'three';
import { useContext, useEffect, useMemo, useRef } from "react";
import { globalSettings } from "../_scripts/globalSettings";
import { ColorContext } from './App';
import { getUpwardVectorFromProgress } from '../_scripts/trackBuilder/trackPieceBuilders/upwardVectorHelpers';

export default function Car({ progress, position, rotationTarget, upwardVectors, isFrontCar }: {
  progress: number,
  position: THREE.Vector3,
  rotationTarget: THREE.Vector3,
  upwardVectors: THREE.Vector3[],
  isFrontCar: boolean,
}) {
  const carRef = useRef<THREE.Group<THREE.Object3DEventMap>>(null);

  useEffect(() => {
    const upwardVector = getUpwardVectorFromProgress(progress, upwardVectors);
    if (!carRef.current) { return; }
    carRef.current.up = upwardVector;
    carRef.current.lookAt(rotationTarget);
  }, [progress, rotationTarget, upwardVectors]);

  return (
    <group ref={carRef} position={position}>
      <CarModel isFrontCar={isFrontCar} />
    </group>
  );
}

function generateBodyMaterial(color = '#0098db') {
  return (
    <meshStandardMaterial
      color={color}
      wireframe={globalSettings.isDebugMode}
    />
  );
}
const metalMaterial = (
  <meshStandardMaterial
    color="#ffffff"
    roughness={0.3}
    metalness={0.7}
    wireframe={globalSettings.isDebugMode}
  />
);
const darkMetalMaterial = (
  <meshStandardMaterial
    color="#888888"
    roughness={0.3}
    metalness={0.7}
    wireframe={globalSettings.isDebugMode}
  />
);
const seatMaterial = (
  <meshStandardMaterial
    color="gray"
    roughness={0.3}
    metalness={0.7}
    wireframe={globalSettings.isDebugMode}
  />
);

function CarModel({ isFrontCar = false }) {
  return (
    <group>
      <CarBody isFrontCar={isFrontCar} />
      <Seats />
      <Wheels />
      <Decorations />
    </group>
  );
}

function Decorations() {
  return (
    <group>
      <mesh scale-z={0.3} scale-x={0.4} rotation-x={Math.PI * 0.5} position={[-0.5, 0.5, 0]}>
        <capsuleGeometry args={[0.18, 0.4]} />
        {metalMaterial}
      </mesh>
      <mesh scale-z={0.3} scale-x={0.4} rotation-x={Math.PI * 0.5} position={[0.5, 0.5, 0]}>
        <capsuleGeometry args={[0.18, 0.4]} />
        {metalMaterial}
      </mesh>
    </group>
  );
}

function CarBody({ isFrontCar = false }) {
  const color = useContext(ColorContext)?.coasterColors[0]?.train;
  const bodyMaterial = useMemo(() => generateBodyMaterial(color), [color]);
  const bottom = (<mesh position-y={0.25}><boxGeometry args={[1, 0.1, 1]} />{bodyMaterial}</mesh>);
  const back = (<mesh position={[0, 0.45, -0.45]}><boxGeometry args={[1, 0.5, 0.1]} />{bodyMaterial}</mesh>);
  const front = (<mesh position={[0, 0.45, 0.45]}><boxGeometry args={[1, 0.5, 0.1]} />{bodyMaterial}</mesh>);
  const left = (<mesh position={[0.45, 0.45, 0]}><boxGeometry args={[0.1, 0.5, 1]} />{bodyMaterial}</mesh>);
  const right = (<mesh position={[-0.45, 0.45, 0]}><boxGeometry args={[0.1, 0.5, 1]} />{bodyMaterial}</mesh>);
  const connector = (<mesh position={[0, 0.35, 0.58]} rotation-x={Math.PI * 0.5}><cylinderGeometry args={[0.1, 0.1, 0.3]} />{darkMetalMaterial}</mesh>);

  return (
    <group>
      {bottom}
      {back}
      {front}
      {left}
      {right}
      {!isFrontCar && connector}
      {isFrontCar && <TrainFront bodyMaterial={bodyMaterial} />}
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

function TrainFront({ bodyMaterial }: { bodyMaterial: JSX.Element }) {
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
