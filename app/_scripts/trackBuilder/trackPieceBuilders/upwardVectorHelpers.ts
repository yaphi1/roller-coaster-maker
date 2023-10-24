import * as THREE from 'three';
import { Path } from "../../types";
import { getPointsOffsetFromPath } from "./getPointsOffsetFromPath";

export function buildUpwardVectors(path: Path) {
  const pointsMultiplier = 20;
  const trackPoints = getPointsOffsetFromPath(path, 0, 0, pointsMultiplier);

  // last point of current track piece is first point of
  // next track piece so we slice to remove redundant point
  const nonRedundantPoints = trackPoints.slice(0, -1);
  const pointsAboveTrack = getPointsOffsetFromPath(path, 0, 1, pointsMultiplier);

  const upwardVectors = nonRedundantPoints.map((point, i) => {
    const upwardVector = new THREE.Vector3();
    upwardVector.subVectors(pointsAboveTrack[i], point).normalize();
    return upwardVector;
  });

  return upwardVectors;
}

export function getUpwardVectorFromProgress(
  progress: number,
  upwardVectors: THREE.Vector3[]
) {
  const index = Math.floor(progress * upwardVectors.length);
  return new THREE.Vector3().copy(upwardVectors[index]);
}
