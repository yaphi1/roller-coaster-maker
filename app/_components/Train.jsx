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
  - improve car graphics
  - make track visuals
  - add user controls
  - add scenery
  - decide on camera
  - add shareable url params for tracks
*/

export default function Train(props) {
  const carCount = 5;
  const spaceBetweenCarts = 0.04;

  const carRefs = (new Array(carCount)).fill().map(ref => useRef());
  const lineRef = useRef();
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(10);

  const trainMidpoint = (carRefs.length / 2) - 0.5;
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

  function updateSpeed(updatedProgress, path) {
    const verticalChange = path.getTangent(updatedProgress).y;
    const minSpeed = 3;
    const verticalDrag = verticalChange * 0.5;
    const horizontalDrag = 0.01;
    const newSpeed = Math.max(speed - verticalDrag - horizontalDrag, minSpeed);
    setSpeed(newSpeed);
  }

  function updateCar(itemRef, updatedProgress, offset, path) {
    updatePosition(itemRef, updatedProgress, offset);
    updateRotation(itemRef, updatedProgress, offset, path);
    updateSpeed(updatedProgress, path);
  }

  useFrame((state, delta) => {
    const updatedProgress = getUpdatedProgress(delta);

    carRefs.forEach((ref, i) => {
      const offset = spaceBetweenCarts * (i - trainMidpoint);
      updateCar(ref, updatedProgress, offset, path);
    });

    setProgress(updatedProgress);
  });

  useLayoutEffect(() => {
    lineRef.current.geometry.setFromPoints(path.getPoints());
  }, []);
  return (
    <>
      {carRefs.map((ref, i) => {
        return (<Car carRef={ref} key={i} />);
      })}

      <line ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="red" />
      </line>
    </>
  );
}
