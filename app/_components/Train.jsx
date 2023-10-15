import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Car from './Car';
import { globalSettings } from "../_utils/globalSettings";

/*
TODO:
  - improve car graphics
  - make track visuals
  - add user controls
  - add scenery
  - decide on camera
  - add shareable url params for tracks
  - check about using clock to regulate speed. it gets out of control when leaving the tab
*/

const minSpeed = 3;
const gravityStrength = 0.5;
const horizontalDrag = 0.02;

export default function Train({
  path,
  carCount = 5,
  spaceBetweenCarts = 1.2,
  startingProgress = 0,
}) {

  const carRefs = (new Array(carCount)).fill().map(ref => useRef());
  const [progress, setProgress] = useState(startingProgress);
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
    const maxProgress = 1; // add full amount to avoid problems with js modulus and negative numbers
    const offsetAsFractionOfWholeTrack = offset / trackLength;
    return (updatedProgress + offsetAsFractionOfWholeTrack + maxProgress) % 1;
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
    const verticalDrag = verticalChange * gravityStrength;
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

  return (
    <>
      {carRefs.map((ref, i) => {
        return (<Car carRef={ref} key={i} />);
      })}
    </>
  );
}
