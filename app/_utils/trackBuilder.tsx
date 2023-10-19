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
} from './types';
import { globalSettings } from './globalSettings';
import { useContext } from 'react';
import { ColorContext } from '../_components/App';

export const straightawayLength = 4;
export const trackWidth = 1;
const trackPieceDepth = 0.1;
export const desiredPointsPerTrackPiece = 5;
const spacesBetweenTrackPiecePoints = desiredPointsPerTrackPiece - 1;
const desiredLengthBetweenPathPoints = straightawayLength / spacesBetweenTrackPiecePoints;

function isIndexSpacedOutEnough(value: unknown, i: number) { return i % 4 === 0; }

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
    startPoint,
    endPoint,
    direction,
    nextDirection,
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
    startPoint,
    endPoint,
    direction,
    nextDirection: direction,
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
    startPoint,
    endPoint,
    direction,
    nextDirection,
    trackPieceVisual: buildTrackPieceVisual(path),
  };
}

function buildTrackPieceVisual(path: Path) {
  const tubularSegments = 20;
  const radius = 0.1;
  const radialSegments = 8;

  const railPaths = getRailPaths(path);
  const middleRailPath = getMiddleRailPath(path);
  const crossPiecePaths = getCrossPiecePaths({ path, depth: trackPieceDepth, horizontalReach: 0.5 });

  function SideRails({ material } : { material: JSX.Element }) {
    return (
      <>
        {railPaths.map((railPath, i) => (
          <mesh key={i}>
            <tubeGeometry args={[railPath, tubularSegments, radius, radialSegments]} />
            {material}
          </mesh>
        ))}
      </>
    );
  };

  function MiddleRail({ material } : { material: JSX.Element }) {
    return (
      <mesh>
        <tubeGeometry args={[middleRailPath, tubularSegments, 0.15, radialSegments]} />
        {material}
      </mesh>
    );
  };

  function CrossPieces({ material } : { material: JSX.Element }) {
    return (
      <>
        {crossPiecePaths.map((crossPiecePath, i) => (
          <mesh key={i}>
            <tubeGeometry args={[crossPiecePath, tubularSegments, 0.05, radialSegments]} />
            {material}
          </mesh>
        ))}
      </>
    );
  };

  const TrackPieceVisual = () => {
    const coasterColors = useContext(ColorContext)?.coasterColors[0];
    const railColor = coasterColors?.rails;
    const scaffoldingColor = coasterColors?.scaffolding;

    const railMaterial = (<meshStandardMaterial color={railColor} roughness={0.3} metalness={0.7} side={THREE.DoubleSide} wireframe={globalSettings.isDebugMode} />);
    const scaffoldingMaterial = (<meshStandardMaterial color={scaffoldingColor} side={THREE.DoubleSide} wireframe={globalSettings.isDebugMode} />);

    return (
      <group>
        <SideRails material={railMaterial} />
        <MiddleRail material={scaffoldingMaterial} />
        <CrossPieces material={scaffoldingMaterial} />
      </group>
    );
  };

  return TrackPieceVisual;
}

function getRailPaths(path: Path, horizontalOffset = trackWidth / 2) {
  const firstRailPoints = getPointsOffsetFromPath(path, horizontalOffset);
  const secondRailPoints = getPointsOffsetFromPath(path, -horizontalOffset);

  const firstRailPath = new THREE.CatmullRomCurve3(firstRailPoints);
  const secondRailPath = new THREE.CatmullRomCurve3(secondRailPoints);

  return [ firstRailPath, secondRailPath ];
}

function getMiddleRailPath(path: Path, verticalOffset = -0.2) {
  const horizontalOffset = 0;
  const railPoints = getPointsOffsetFromPath(path, horizontalOffset, verticalOffset);
  const railPath = new THREE.CatmullRomCurve3(railPoints);

  return railPath;
}

function getCrossPiecePaths(
  { path, depth, horizontalReach } :
  { path: Path, depth: number, horizontalReach: number }
) {
  const firstRailPoints = getPointsOffsetFromPath(path, horizontalReach);
  const secondRailPoints = getPointsOffsetFromPath(path, -horizontalReach);
  const centerRailPoints = getPointsOffsetFromPath(path, 0, -depth);

  const crossPiecePaths = centerRailPoints.map((centerRailPoint, i) => {
    const firstLine = new THREE.LineCurve3(firstRailPoints[i], centerRailPoint);
    const secondLine = new THREE.LineCurve3(centerRailPoint, secondRailPoints[i]);
    const crossPiecePath: THREE.CurvePath<THREE.Vector3> = new THREE.CurvePath();

    crossPiecePath.add(firstLine);
    crossPiecePath.add(secondLine);

    return crossPiecePath;
  });

  return crossPiecePaths;
}

function getSupportPolePaths(
  { path, depthOfTopPoint } :
  { path: Path, depthOfTopPoint: number }
) {
  const centerRailPoints = getPointsOffsetFromPath(path, 0, -depthOfTopPoint);
  const supportPolePoints = centerRailPoints.filter(isIndexSpacedOutEnough);

  const supportPolePaths = supportPolePoints.map((supportPolePoint, i) => {
    const groundPoint = new THREE.Vector3(...[
      supportPolePoint.x,
      0 - depthOfTopPoint,
      supportPolePoint.z,
    ]);
    const polePath = new THREE.LineCurve3(supportPolePoint, groundPoint);

    return polePath;
  });

  return supportPolePaths;
}

function isValidSupport(supportPath: THREE.LineCurve3, trackPathPoints: THREE.Vector3[]) {
  const range = 1;
  const verticalClearance = 1;
  const topOfSupportPole = supportPath.v1;

  for (const trackPathPoint of trackPathPoints) {
    const { x: trackX, y: trackY, z: trackZ } = trackPathPoint;
    const { x: poleX, y: poleY, z: poleZ } = topOfSupportPole;

    const isTrackLowerThanPole = trackY <= poleY - verticalClearance;

    const isTrackInRangeOfPoleX = (poleX - range <= trackX) && (trackX <= poleX + range);
    const isTrackInRangeOfPoleZ = (poleZ - range <= trackZ) && (trackZ <= poleZ + range);
    const isTrackNearPole = isTrackInRangeOfPoleX && isTrackInRangeOfPoleZ;
    const isPoleOverlappingTrack = isTrackNearPole && isTrackLowerThanPole;

    if (isPoleOverlappingTrack) {
      return false;
    }
  }

  return true;
}

export function getPathPoints(trackPath: Path) {
  const trackPathPointCount = Math.ceil(trackPath.getLength() / desiredLengthBetweenPathPoints);
  const trackPathPoints = trackPath.getSpacedPoints(trackPathPointCount);
  return trackPathPoints
}

function buildTrackSupports(trackPath: Path): PathVisual[] {
  const tubularSegments = 20;
  const radius = 0.15;
  const radialSegments = 8;

  const trackPathPoints = getPathPoints(trackPath);
  const supportPaths = getSupportPolePaths({ path: trackPath, depthOfTopPoint: trackPieceDepth + 0.1 });

  const supports = supportPaths.map((supportPath, i) => {
    const isValid = isValidSupport(supportPath, trackPathPoints);
    const { x, z } = supportPath.v1;

    const TrackSupport = () => {
      const scaffoldingColor = useContext(ColorContext)?.coasterColors[0]?.scaffolding;
      const supportMaterial = <meshStandardMaterial color={scaffoldingColor} side={THREE.DoubleSide} wireframe={globalSettings.isDebugMode} />;
      const supportBaseMaterial = <meshStandardMaterial color={scaffoldingColor} wireframe={globalSettings.isDebugMode} />;

      return isValid ? (
        <group key={i}>
          <mesh>
            <tubeGeometry args={[supportPath, tubularSegments, radius, radialSegments]} />
            {supportMaterial}
          </mesh>
          <mesh position={[x, 0, z]}>
            <boxGeometry args={[0.5, 0.2, 0.5]} />
            {supportBaseMaterial}
          </mesh>
        </group>
      ) : (<></>)
    };

    return TrackSupport;
  });

  return supports;
}

function getPointsOffsetFromPath(path: Path, offsetHorizontal = 0, offsetVertical = 0) {
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

export function buildPiece(pieceType: PieceType, startPoint: XYZ, direction: XYZ) {
  if (pieceType === 'left') { return buildTurnPiece(startPoint, direction, 'left'); }
  else if (pieceType === 'right') { return buildTurnPiece(startPoint, direction, 'right'); }
  else if (pieceType === 'up') { return buildRampPiece(startPoint, direction, 'up'); }
  else if (pieceType === 'down') { return buildRampPiece(startPoint, direction, 'down'); }
  else { return buildStraightPiece(startPoint, direction); }
}

export function buildTrack({
  startPoint = { x: 0, y: 0.3, z: 0 },
  direction = { x: 1, y: 0, z: 0 },
  pieceTypes
} : {
  startPoint?: XYZ,
  direction?: XYZ,
  pieceTypes: PieceType[],
}): Track {

  const trackPath: Path = new THREE.CurvePath();
  const visuals: PathVisual[] = [];
  const pieces: Piece[] = [];

  pieceTypes.forEach(pieceType => {
    const piece = buildPiece(pieceType, startPoint, direction);
    pieces.push(piece);
    trackPath.add(piece.path);
    startPoint = piece.endPoint;
    direction = piece.nextDirection;

    visuals.push(piece.trackPieceVisual);
  });

  const trackSupports = buildTrackSupports(trackPath);
  visuals.push(...trackSupports);

  return {
    path: trackPath,
    visuals,
    pieces,
  }
}
