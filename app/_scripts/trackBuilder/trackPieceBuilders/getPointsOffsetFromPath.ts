import * as THREE from 'three';
import { Path } from "../../types";
import { desiredLengthBetweenPathPoints } from "../trackConstants";

export function getPointsOffsetFromPath(path: Path, offsetHorizontal = 0, offsetVertical = 0) {
  const pointsCount = Math.ceil(path.getLength() / desiredLengthBetweenPathPoints);
  const points = path.getSpacedPoints(pointsCount);

  // For each of n points along the curve a Frenet Frame gives:
  //   - the tangent (direction)
  //   - the normal and binormal (perpendiculars)
  const frenetFrames = path.computeFrenetFrames(pointsCount);

  const isBinormalHorizontal = Math.abs(frenetFrames.binormals[0].y) < 0.001; // close enough to zero to avoid rounding errors

  const horizontalVectors = isBinormalHorizontal ? 'binormals' : 'normals';
  const verticalVectors = !isBinormalHorizontal ? 'binormals' : 'normals';

  const isVerticalOffsetReversed = frenetFrames[verticalVectors][0].y < 0;

  const horizontalPerpendiculars = flattenHorizontalPerpendiculars(frenetFrames[horizontalVectors]);
  const verticalPerpendiculars = frenetFrames[verticalVectors];
  const offsetVerticalCorrected = isVerticalOffsetReversed ? -offsetVertical : offsetVertical;

  const offsetPoints = points.map((point, i) => {
    const pointCopy = new THREE.Vector3().copy(point);
    const horizontalPerpendicular = new THREE.Vector3().copy(horizontalPerpendiculars[i]);
    const verticalPerpendicular = new THREE.Vector3().copy(verticalPerpendiculars[i]);
    const newPointOffsetHorizontal = horizontalPerpendicular.multiplyScalar(offsetHorizontal);
    const newPointOffsetVertical = verticalPerpendicular.multiplyScalar(offsetVerticalCorrected);
    const newPoint = pointCopy.add(newPointOffsetHorizontal).add(newPointOffsetVertical);

    return newPoint;
  });

  return offsetPoints;
}

// Avoid unwanted track warping, mainly in loops
// Update y to get banked turns later
// Also consider sending an array of Frenet vectors
// so cars can easily orient themselves
function flattenHorizontalPerpendiculars(horizontalPerpendiculars: THREE.Vector3[]): THREE.Vector3[] {
  return horizontalPerpendiculars.map(perp => {
    const originalLength = perp.length();
    const flattenedVector = new THREE.Vector3(perp.x, 0, perp.z);
    return flattenedVector.setLength(originalLength);
  });
}
