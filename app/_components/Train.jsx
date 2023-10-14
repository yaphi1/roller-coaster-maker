import * as THREE from 'three';
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  CubicBezierLine, CurveModifier, MotionPathControls, Box, useMotion,
  QuadraticBezierLine,
} from '@react-three/drei';
import { path } from '../_utils/trackBuilder.tsx';
import Car from './Car';

/*
TODO:
  - add cars to coaster
  - make track pieces
  - make velocity change based on changes in vertical position
*/

export default function Cart(props) {
  const carRef = useRef();
  const carRef2 = useRef();
  const carRef3 = useRef();
  const lineRef = useRef();
  const [progress, setProgress] = useState(0);
  // const [direction, setDirection] = useState(new THREE.Vector3(1, 0, 0));
  const speed = 10;

  const trackLength = useMemo(() => {
    return path.getLength();
  }, []);

  function getUpdatedProgress(delta) {
    const distanceTraveledThisIncrement = speed * (1 / trackLength) * delta;
    const updatedProgress = (progress + distanceTraveledThisIncrement) % 1;
    return updatedProgress;
  }

  function getOffsetProgress(updatedProgress, offset) {
    const fullAmount = 1; // add full amount to avoid problems with js modulus and negative numbers
    const offsetAsDistance = 30 * 1 / trackLength * offset;
    return (updatedProgress + offsetAsDistance + fullAmount) % 1;
  }

  function updatePosition(itemRef, updatedProgress, offset = 0) {
    const offsetProgress = getOffsetProgress(updatedProgress, offset);
    itemRef.current.position.copy(path.getPoint(offsetProgress));
  }
  
  function updateRotation(itemRef, updatedProgress, offset = 0, path) {
    const offsetProgress = getOffsetProgress(updatedProgress, offset);
    const tangent = path.getTangent(offsetProgress);

    window.cartCenter = itemRef.current.position.clone();
    itemRef.current.lookAt(cartCenter.add(tangent));
  }

  function updateCar(itemRef, updatedProgress, offset, path) {
    updatePosition(itemRef, updatedProgress, offset);
    updateRotation(itemRef, updatedProgress, offset, path);
  }

  useFrame((state, delta) => {
    const updatedProgress = getUpdatedProgress(delta);

    updateCar(carRef, updatedProgress, 0, path);
    updateCar(carRef2, updatedProgress, -0.04, path);
    updateCar(carRef3, updatedProgress, -0.08, path);

    setProgress(updatedProgress);
  });

  useLayoutEffect(() => {
    lineRef.current.geometry.setFromPoints(path.getPoints());
  }, []);
  return (
    <>
      <Car carRef={carRef} />
      <Car carRef={carRef2} />
      <Car carRef={carRef3} />

      <line ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="red" />
      </line>
    </>
  );
}
