import * as THREE from 'three';
import { Path } from "../../types";
import { desiredLengthBetweenPathPoints } from "../trackConstants";

export function getPointsOffsetFromPath(path: Path, offsetHorizontal = 0, offsetVertical = 0, pointsMultiplier = 1) {
  const standardPointsCount = Math.ceil(path.getLength() / desiredLengthBetweenPathPoints);
  const pointsCount = Math.ceil(pointsMultiplier * standardPointsCount);
  const points = path.getSpacedPoints(pointsCount);

  // For each of n points along the curve a Frenet Frame gives:
  //   - the tangent (direction)
  //   - the normal and binormal (perpendiculars)
  const frenetFrames = path.computeFrenetFrames(pointsCount);

  const isBinormalHorizontal = Math.abs(frenetFrames.binormals[0].y) < 0.001; // close enough to zero to avoid rounding errors

  const horizontalVectors = isBinormalHorizontal ? 'binormals' : 'normals';
  const verticalVectors = !isBinormalHorizontal ? 'binormals' : 'normals';

  const isVerticalOffsetReversed = frenetFrames[verticalVectors][0].y < 0;

  const { tangents } = frenetFrames;
  const horizontalPerpendiculars = flattenHorizontalPerpendiculars(frenetFrames[horizontalVectors]);
  const verticalPerpendiculars = generateVerticalPerpendiculars(tangents, horizontalPerpendiculars, isBinormalHorizontal);
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

/* 
Why generateVerticalPerpendiculars?

The Frenet frames give unreliable vertical
perpendiculars for our purposes because they
can warp from side to side depending on the
curvature.

To get reliable vertical perpendiculars,
we instead take the cross product of the tangent
and the flattened horizontal vector at each point.
*/
function generateVerticalPerpendiculars(
  tangents: THREE.Vector3[],
  horizontalVectors: THREE.Vector3[],
  isBinormalHorizontal: boolean,
) {
  return tangents.map((tangent, i) => {
    const verticalPerpendicular = new THREE.Vector3();
    verticalPerpendicular.crossVectors(tangent, horizontalVectors[i]);
    if (isBinormalHorizontal) {
      verticalPerpendicular.y = -verticalPerpendicular.y;
    }
    return verticalPerpendicular;
  });
}
