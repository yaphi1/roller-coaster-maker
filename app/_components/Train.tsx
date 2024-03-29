import * as THREE from 'three';
import { useFrame, useThree } from "@react-three/fiber";
import { useContext, useMemo, useState } from "react";
import Car from './Car';
import { Path, Track } from "../_scripts/types";
import { CameraContext } from './App';
import { updateCamera } from '../_scripts/cameraHelpers';
import { produce } from 'immer';

const stopForDebugging = false;

const minSpeed = stopForDebugging ? 0 : 3;
const gravityStrength = 0.5;
const horizontalDrag = stopForDebugging ? 0.22 : 0.02;

export default function Train({
  track,
  carCount = 5,
  spaceBetweenCarMidpoints = 1.2,
  startingProgress = 0,
}: {
  track: Track,
  carCount?: number,
  spaceBetweenCarMidpoints?: number,
  startingProgress?: number,
}) {
  const offsetStartingProgress = getOffsetStartingProgress(startingProgress, carCount, spaceBetweenCarMidpoints, track.path);
  const { path, upwardVectors } = track;
  const zeroVectors: THREE.Vector3[] = new Array(carCount).fill(new THREE.Vector3());
  const [carPositions, setCarPositions] = useState(zeroVectors);
  const [carRotationTargets, setCarRotationTargets] = useState(zeroVectors);
  const [progress, setProgress] = useState(offsetStartingProgress);
  const [speed, setSpeed] = useState(10);

  const camera = useThree().camera;
  const cameraContext = useContext(CameraContext);
  updateCamera(camera, cameraContext?.cameraType, path, progress, upwardVectors);

  const [trackLength, trainMidpoint] = useMemo(() => {
    return [path.getLength(), (carCount / 2) - 0.5];
  }, [path, carCount]);

  function updateCar(carIndex: number, updatedProgress: number, offset: number, path: Path) {
    const newPosition = getNextPosition(path, updatedProgress, offset);
    const rotationTarget = getNextRotationTarget(carIndex, updatedProgress, offset, path, carPositions);
    const newSpeed = getNewSpeed(speed, updatedProgress, path);

    setCarPositions(produce((draft) => { draft[carIndex] = newPosition; }));
    setCarRotationTargets(produce((draft) => { draft[carIndex] = rotationTarget; }));
    setSpeed(newSpeed);
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
    const updatedProgress = getUpdatedProgress(cleanDelta, progress, speed, trackLength);

    carPositions.forEach((_, carIndex) => {
      const offset = spaceBetweenCarMidpoints * (carIndex - trainMidpoint);
      updateCar(carIndex, updatedProgress, offset, path);
    });

    setProgress(updatedProgress);
  });

  const arePositionsPrepping = carPositions === zeroVectors;
  return arePositionsPrepping ? (<></>) : (
    <>
      {carPositions.map((carPosition, carIndex) => {
        const offset = spaceBetweenCarMidpoints * (carIndex - trainMidpoint);
        const offsetProgress = getOffsetProgress(path, progress, offset);

        return (
          <Car
            key={carIndex}
            progress={offsetProgress}
            position={carPosition}
            rotationTarget={carRotationTargets[carIndex]}
            upwardVectors={upwardVectors}
            isFrontCar={carIndex === carCount - 1}
          />
        );
      })}
    </>
  );
}

function getOffsetStartingProgress(
  startingProgress: number,
  carCount: number,
  spaceBetweenCarMidpoints: number,
  path: Path,
) {
  const offset = spaceBetweenCarMidpoints * carCount / 2;
  const trackLength = path.getLength();
  const startingPosition = startingProgress * trackLength;
  const carLengthAllowance = 0.5;
  const adjustedPosition = startingPosition + offset + carLengthAllowance;
  const offsetStartingProgress = adjustedPosition / trackLength;

  return offsetStartingProgress;
}

function getNextPosition(path: Path, updatedProgress: number, offset = 0) {
  const offsetProgress = getOffsetProgress(path, updatedProgress, offset);
  const newPosition = path.getPointAt(offsetProgress);
  return newPosition;
}

function getOffsetProgress(path: Path, updatedProgress: number, offset: number) {
  const trackLength = path.getLength();
  const maxProgress = 1; // add full amount to avoid problems with js modulus and negative numbers
  const offsetAsFractionOfWholeTrack = offset / trackLength;
  return (updatedProgress + offsetAsFractionOfWholeTrack + maxProgress) % 1;
}

function getNextRotationTarget(carIndex: number, updatedProgress: number, offset = 0, path: Path, carPositions: THREE.Vector3[]) {
  const offsetProgress = getOffsetProgress(path, updatedProgress, offset);
  const tangent = path.getTangentAt(offsetProgress);
  const cartCenter = carPositions[carIndex].clone();
  const rotationTarget = cartCenter.add(tangent);
  return rotationTarget;
}

function getNewSpeed(currentSpeed: number, updatedProgress: number, path: Path) {
  const verticalChange = path.getTangentAt(updatedProgress).y;
  const verticalDrag = verticalChange * gravityStrength;
  const newSpeed = Math.max(currentSpeed - verticalDrag - horizontalDrag, minSpeed);
  return newSpeed;
}

function getUpdatedProgress(delta: number, progress: number, speed: number, trackLength: number) {
  const distanceTraveledThisIncrement = speed * (1 / trackLength) * delta;
  const updatedProgress = (progress + distanceTraveledThisIncrement) % 1;
  return updatedProgress;
}
