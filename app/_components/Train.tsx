import * as THREE from 'three';
import { useFrame, useThree } from "@react-three/fiber";
import { RefObject, useContext, useMemo, useRef, useState } from "react";
import Car from './Car';
import { Group } from "three";
import { CameraType, Path } from "../_utils/types";
import { CameraContext } from "../page";

const stopForDebugging = false;

const minSpeed = stopForDebugging ? 0 : 3;
const gravityStrength = 0.5;
const horizontalDrag = stopForDebugging ? 0.22 : 0.02;

function updateCamera(cameraType: CameraType | null, path: Path, progress:number) {
  const camera = useThree().camera;
  if (!cameraType || cameraType === 'orbital') { return; }

  const coasterPosition = path.getPointAt(progress);

  if (cameraType === 'coasterFocus') {
    const cameraPosition = new THREE.Vector3(
      coasterPosition.x + 7,
      coasterPosition.y + 10,
      coasterPosition.z + 20,
    );
    camera.position.copy(cameraPosition);
    camera.lookAt(coasterPosition);
  }
  
  if (cameraType === 'firstPerson') {
    const tangent = path.getTangentAt(progress);
    const cameraPosition = new THREE.Vector3(
      coasterPosition.x,
      coasterPosition.y + 2,
      coasterPosition.z,
    );
    const cameraDirection = new THREE.Vector3(
      tangent.x,
      tangent.y - 0.2,
      tangent.z,
    );
    camera.position.copy(cameraPosition);
    camera.lookAt(cameraPosition.add(cameraDirection));
  }
}

export default function Train({
  path,
  carCount = 5,
  spaceBetweenCarts = 1.2,
  startingProgress = 0,
}: {
  path: Path,
  carCount?: number,
  spaceBetweenCarts?: number,
  startingProgress?: number,
}) {
  const carRefs = (new Array(carCount)).fill(null).map(ref => useRef<Group>(null));
  const [progress, setProgress] = useState(startingProgress);
  const [speed, setSpeed] = useState(10);

  const cameraType = useContext(CameraContext);
  updateCamera(cameraType, path, progress);

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
    itemRef.current.position.copy(path.getPointAt(offsetProgress));
  }
  
  function updateRotation(itemRef: RefObject<Group>, updatedProgress: number, offset = 0, path: Path) {
    if (!itemRef.current) { return; }
    const offsetProgress = getOffsetProgress(updatedProgress, offset);
    const tangent = path.getTangentAt(offsetProgress);

    const cartCenter = itemRef.current.position.clone();
    itemRef.current.lookAt(cartCenter.add(tangent));
  }

  function updateSpeed(updatedProgress: number, path: Path) {
    const verticalChange = path.getTangentAt(updatedProgress).y;
    const verticalDrag = verticalChange * gravityStrength;
    const newSpeed = Math.max(speed - verticalDrag - horizontalDrag, minSpeed);
    setSpeed(newSpeed);
  }

  function updateCar(itemRef: RefObject<Group>, updatedProgress: number, offset: number, path: Path) {
    updatePosition(itemRef, updatedProgress, offset);
    updateRotation(itemRef, updatedProgress, offset, path);
    updateSpeed(updatedProgress, path);
  }

  useFrame((state, delta) => {
    // Why cleanDelta instead of delta?
    //   When tab loses focus, animation callbacks may be throttled or paused.
    //   When going back to the tab, delta might be huge!
    //   As a result, the position changes a lot, but the speed stays the same because
    //   the speed missed out on the cumulative buildup of moving to the new position.
    //   For this reason, we'll hardcode an approximate delta of 0.033 to pick up roughly where we left off.
    //   0.033 was chosen based to approximate a lower limit of 30fps
    const cleanDelta = Math.min(delta, 0.033);
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
        return (<Car carRef={ref} isFrontCar={i === carRefs.length - 1} key={i} />);
      })}
    </>
  );
}
