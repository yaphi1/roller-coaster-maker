import { useFrame } from "@react-three/fiber";
import { RefObject, useMemo, useRef, useState } from "react";
import Car from './Car';
import { Group } from "three";
import { TrackPath } from "../_utils/types";

const minSpeed = 3;
const gravityStrength = 0.5;
const horizontalDrag = 0.02;

export default function Train({
  path,
  carCount = 5,
  spaceBetweenCarts = 1.2,
  startingProgress = 0,
}: {
  path: TrackPath,
  carCount?: number,
  spaceBetweenCarts?: number,
  startingProgress?: number,
}) {

  const carRefs = (new Array(carCount)).fill(null).map(ref => useRef<Group>(null));
  const [progress, setProgress] = useState(startingProgress);
  const [speed, setSpeed] = useState(10);

  const trainMidpoint = (carRefs.length / 2) - 0.5;
  const trackLength = useMemo(() => {
    return path.getLength();
  }, [path]);

  function getUpdatedProgress(delta: number) {
    const distanceTraveledThisIncrement = speed * (1 / trackLength) * delta;
    const updatedProgress = (progress + distanceTraveledThisIncrement) % 1;
    return updatedProgress;
  }

  function getOffsetProgress(updatedProgress: number, offset: number) {
    const maxProgress = 1; // add full amount to avoid problems with js modulus and negative numbers
    const offsetAsFractionOfWholeTrack = offset / trackLength;
    return (updatedProgress + offsetAsFractionOfWholeTrack + maxProgress) % 1;
  }

  function updatePosition(itemRef: RefObject<Group>, updatedProgress: number, offset = 0) {
    if (!itemRef?.current) { return; }
    const offsetProgress = getOffsetProgress(updatedProgress, offset);
    itemRef.current.position.copy(path.getPoint(offsetProgress));
  }
  
  function updateRotation(itemRef: RefObject<Group>, updatedProgress: number, offset = 0, path: TrackPath) {
    if (!itemRef.current) { return; }
    const offsetProgress = getOffsetProgress(updatedProgress, offset);
    const tangent = path.getTangent(offsetProgress);

    const cartCenter = itemRef.current.position.clone();
    itemRef.current.lookAt(cartCenter.add(tangent));
  }

  function updateSpeed(updatedProgress: number, path: TrackPath) {
    const verticalChange = path.getTangent(updatedProgress).y;
    const verticalDrag = verticalChange * gravityStrength;
    const newSpeed = Math.max(speed - verticalDrag - horizontalDrag, minSpeed);
    setSpeed(newSpeed);
  }

  function updateCar(itemRef: RefObject<Group>, updatedProgress: number, offset: number, path: TrackPath) {
    updatePosition(itemRef, updatedProgress, offset);
    updateRotation(itemRef, updatedProgress, offset, path);
    updateSpeed(updatedProgress, path);
  }

  useFrame((state, delta) => {
    // Why cleanDelta instead of delta?
    //   When tab loses focus, animation callbacks may be throttled or paused
    //   When going back to the tab, delta might be huge!
    //   That gap throws off the position and speed since they build on previous info.
    //   For this reason, we'll hardcode an approximate delta of 0.06 to pick up roughly where we left off.
    //   0.06 was chosen based on experimentation. Large enough to be useful but small enough to be safe.
    const cleanDelta = Math.min(delta, 0.06);
    const updatedProgress = getUpdatedProgress(cleanDelta);

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
