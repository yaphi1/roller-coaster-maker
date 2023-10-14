// @ts-ignore-error
import * as THREE from 'three';

type XYZ = {
  x: number;
  y: number;
  z: number;
};

type PieceType = 'straight' | 'right' | 'left' | 'up' | 'down';
type TurnDirection = 'right' | 'left';
type RampDirection = 'up' | 'down';

type Piece = {
  path: any;
  nextDirection: XYZ;
  endPoint: XYZ;
};

const straightAwayLength = 4;

function buildRampPiece(startPoint: XYZ, direction: XYZ, rampDirection: RampDirection): Piece {
  const { x, y, z } = startPoint;

  const nextDirection = {
    x: direction.x,
    y: rampDirection === 'up' ? direction.y + 1 : direction.y - 1,
    z: direction.z,
  };

  const elevationChangeMagnitude = straightAwayLength * 0.5;
  const elevationChangeDirection = direction.y === 0 ? nextDirection.y : direction.y;
  const elevationChange = elevationChangeDirection * elevationChangeMagnitude;

  const endPoint = {
    x: x + direction.x * straightAwayLength,
    y: y + elevationChange,
    z: z + direction.z * straightAwayLength,
  };

  const controlPointDistanceFromStart = straightAwayLength * 0.5;

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
  };
}

function buildStraightPiece(startPoint: XYZ, direction: XYZ): Piece {
  const { x, y, z } = startPoint;
  const endPoint = {
    x: x + direction.x * straightAwayLength,
    y: y + direction.y * straightAwayLength,
    z: z + direction.z * straightAwayLength,
  };
  const path = new THREE.LineCurve3(
    new THREE.Vector3(x, y, z),
    new THREE.Vector3(endPoint.x, endPoint.y, endPoint.z)
  );

  return {
    path,
    nextDirection: direction,
    endPoint,
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
    x: x + direction.x * straightAwayLength,
    y: y + direction.y * straightAwayLength,
    z: z + direction.z * straightAwayLength,
  };

  const nextDirection = getNextDirection(direction, turnDirection);
  
  const endPoint = {
    x: controlPoint.x + nextDirection.x * straightAwayLength,
    y: controlPoint.y + nextDirection.y * straightAwayLength,
    z: controlPoint.z + nextDirection.z * straightAwayLength,
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
  };
}

function buildPiece(pieceType: PieceType, startPoint: XYZ, direction: XYZ) {
  if (pieceType === 'left') { return buildTurnPiece(startPoint, direction, 'left'); }
  else if (pieceType === 'right') { return buildTurnPiece(startPoint, direction, 'right'); }
  else if (pieceType === 'up') { return buildRampPiece(startPoint, direction, 'up'); }
  else if (pieceType === 'down') { return buildRampPiece(startPoint, direction, 'down'); }
  else { return buildStraightPiece(startPoint, direction); }
}

function assemblePieces(pieceTypes: PieceType[]) {
  let startPoint = { x: 0, y: 0, z: 0 };
  let direction = { x: 1, y: 0, z: 0 };

  const path = new THREE.CurvePath();

  pieceTypes.forEach(pieceType => {
    const piece = buildPiece(pieceType, startPoint, direction);
    path.add(piece.path);
    startPoint = piece.endPoint;
    direction = piece.nextDirection;
  });

  return {
    path,
  }
}

function buildTrack() {
  return assemblePieces([
    'straight',
    'straight',
    'right',
    'left',
    'left',
    'straight',
    'straight',
    'left',
    'straight',
    'straight',
    'left',
    'up',
    'straight',
    'down',
    'down',
    'straight',
    'up',
    'straight',
    'straight',
    'left',
    'left',
    'straight',
    'straight',
    'straight',
    'left',
    'straight',
    'straight',
    'up',
    'down',
    'down',
    'up',
    'right',
    'straight',
    'right',
    'straight',
    'straight',
    'straight',
    'straight',
  ]);
}

const track = buildTrack();
export const path = track.path;