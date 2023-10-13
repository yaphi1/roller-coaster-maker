// @ts-ignore-error
import * as THREE from 'three';

type XYZ = {
  x: number;
  y: number;
  z: number;
};

type PieceType = 'straight' | 'right' | 'left';
type TurnDirection = 'right' | 'left';

type Piece = {
  path: any;
  nextDirection: XYZ;
  endPoint: XYZ;
};

const straightAwayLength = 4;

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

function buildTrack2() {
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
    'straight',
    'straight',
    'straight',
    'left',
    'left',
    'straight',
  ]);
}

function buildTrack() {
  const curvePath = new THREE.CurvePath();
  const firstLine = new THREE.LineCurve3(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(5, 0, 0)
  );
  const secondLine = new THREE.LineCurve3(
    new THREE.Vector3(5, 0, 0),
    new THREE.Vector3(5, 2, 5)
  );
  const thirdLine = new THREE.LineCurve3(
    new THREE.Vector3(5, 2, 5),
    new THREE.Vector3(0, 0, 5)
  );
  const fourthLine = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0, 5),
    new THREE.Vector3(-10, 0, 2.5),
    new THREE.Vector3(0, 0, 0)
  );
  curvePath.add(firstLine);
  curvePath.add(secondLine);
  curvePath.add(thirdLine);
  curvePath.add(fourthLine);

  return {
    path: curvePath,
  };
}

// const track = buildTrack();
const track = buildTrack2();
export const path = track.path;
