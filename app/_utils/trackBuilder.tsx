import * as THREE from 'three';
import {
  XYZ,
  PieceType,
  TurnDirection,
  RampDirection,
  Path,
  Piece,
  PathVisual,
  Track,
  TrackPath,
} from './types';
import premadeTrack from '../_premadeTracks/01_two_hills';

const straightawayLength = 4;

function buildRampPiece(startPoint: XYZ, direction: XYZ, rampDirection: RampDirection): Piece {
  const { x, y, z } = startPoint;

  const nextDirection = {
    x: direction.x,
    y: rampDirection === 'up' ? direction.y + 1 : direction.y - 1,
    z: direction.z,
  };

  const elevationChangeMagnitude = straightawayLength * 0.5;
  const elevationChangeDirection = direction.y === 0 ? nextDirection.y : direction.y;
  const elevationChange = elevationChangeDirection * elevationChangeMagnitude;

  const endPoint = {
    x: x + direction.x * straightawayLength,
    y: y + elevationChange,
    z: z + direction.z * straightawayLength,
  };

  const controlPointDistanceFromStart = straightawayLength * 0.5;

  const controlPoint = {
    x: x + direction.x * controlPointDistanceFromStart,
    y: direction.y === 0 ? y : endPoint.y,
    z: z + direction.z * controlPointDistanceFromStart,
  };

  const path = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(x, y, z),
    new THREE.Vector3(controlPoint.x, controlPoint.y, controlPoint.z),
    new THREE.Vector3(endPoint.x, endPoint.y, endPoint.z)
  );

  return {
    path,
    nextDirection,
    endPoint,
    trackPieceVisual: buildTrackPieceVisual(path),
  };
}

function buildStraightPiece(startPoint: XYZ, direction: XYZ): Piece {
  const { x, y, z } = startPoint;
  const endPoint = {
    x: x + direction.x * straightawayLength,
    y: y + direction.y * straightawayLength,
    z: z + direction.z * straightawayLength,
  };
  const path = new THREE.LineCurve3(
    new THREE.Vector3(x, y, z),
    new THREE.Vector3(endPoint.x, endPoint.y, endPoint.z)
  );

  return {
    path,
    nextDirection: direction,
    endPoint,
    trackPieceVisual: buildTrackPieceVisual(path),
  };
}

function getNextDirection(direction: XYZ, turnDirection: TurnDirection): XYZ {
  const turnDirectionAsNumber = turnDirection === 'right' ? 1 : -1;
  return {
    x: direction.x === 0 ? -turnDirectionAsNumber * direction.z : 0,
    y: direction.y,
    z: direction.z === 0 ? turnDirectionAsNumber * direction.x : 0,
  };
}

function buildTurnPiece(startPoint: XYZ, direction: XYZ, turnDirection: TurnDirection): Piece {
  const { x, y, z } = startPoint;
  const controlPoint = {
    x: x + direction.x * straightawayLength,
    y: y + direction.y * straightawayLength,
    z: z + direction.z * straightawayLength,
  };

  const nextDirection = getNextDirection(direction, turnDirection);
  
  const endPoint = {
    x: controlPoint.x + nextDirection.x * straightawayLength,
    y: controlPoint.y + nextDirection.y * straightawayLength,
    z: controlPoint.z + nextDirection.z * straightawayLength,
  };

  const path = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(x, y, z),
    new THREE.Vector3(controlPoint.x, controlPoint.y, controlPoint.z),
    new THREE.Vector3(endPoint.x, endPoint.y, endPoint.z)
  );

  return {
    path,
    nextDirection,
    endPoint,
    trackPieceVisual: buildTrackPieceVisual(path),
  };
}

function buildTrackPieceVisual(path: Path) {
  const tubularSegments = 20;
  const radius = 0.1;
  const radialSegments = 8;

  const railPaths = getRailPaths(path);

  return () => (
    <group>
      {railPaths.map((railPath, i) => {
        return (
          <mesh key={i}>
            <tubeGeometry args={[railPath, tubularSegments, radius, radialSegments]} />
            <meshStandardMaterial color="red" side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

function getRailPaths(path: Path) {
  const trackOffset = 0.5;

  const firstTrackPoints = getPointsOffsetFromPath(path, trackOffset);
  const secondTrackPoints = getPointsOffsetFromPath(path, -trackOffset);

  const firstTrackPath = new THREE.CatmullRomCurve3(firstTrackPoints);
  const secondTrackPath = new THREE.CatmullRomCurve3(secondTrackPoints);

  return [ firstTrackPath, secondTrackPath ];
}

function getPointsOffsetFromPath(path: Path, offsetHorizontal = 1, offsetVertical = 0, pointsCount = 10) {
  const points = path.getPoints(pointsCount);

  // For each of n points along the curve a Frenet Frame gives:
  //   - the tangent (direction)
  //   - the normal and binormal (perpendiculars)
  const frenetFrames = path.computeFrenetFrames(pointsCount);

  const isBinormalHorizontal = frenetFrames.binormals[0].y === 0;
  const isVerticalOffsetReversed = frenetFrames.binormals[0].y < 0 || frenetFrames.normals[0].y < 0;

  const horizontalVectors = isBinormalHorizontal ? 'binormals' : 'normals';
  const verticalVectors = !isBinormalHorizontal ? 'binormals' : 'normals';

  const horizontalPerpendiculars = frenetFrames[horizontalVectors];
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

function buildPiece(pieceType: PieceType, startPoint: XYZ, direction: XYZ) {
  if (pieceType === 'left') { return buildTurnPiece(startPoint, direction, 'left'); }
  else if (pieceType === 'right') { return buildTurnPiece(startPoint, direction, 'right'); }
  else if (pieceType === 'up') { return buildRampPiece(startPoint, direction, 'up'); }
  else if (pieceType === 'down') { return buildRampPiece(startPoint, direction, 'down'); }
  else { return buildStraightPiece(startPoint, direction); }
}

function buildTrack(pieceTypes: PieceType[]): Track {
  let startPoint = { x: 0, y: 0, z: 0 };
  let direction = { x: 1, y: 0, z: 0 };

  const path: TrackPath = new THREE.CurvePath();
  const visuals: PathVisual[] = [];

  pieceTypes.forEach(pieceType => {
    const piece = buildPiece(pieceType, startPoint, direction);
    path.add(piece.path);
    startPoint = piece.endPoint;
    direction = piece.nextDirection;

    visuals.push(piece.trackPieceVisual);
  });

  return {
    path,
    visuals,
  }
}

export const track = buildTrack(premadeTrack);
export const debugPath = track.path;
