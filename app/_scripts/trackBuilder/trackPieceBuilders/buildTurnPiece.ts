import * as THREE from 'three';
import { Piece, TurnDirection, XYZ } from "../../types";
import { straightawayLength } from "../trackConstants";
import { buildTrackPieceVisual } from './buildTrackPieceVisual';
import { buildUpwardVectors } from './upwardVectorHelpers';

export function buildTurnPiece(startPoint: XYZ, direction: XYZ, turnDirection: TurnDirection): Piece {
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
    trackPieceVisual: buildTrackPieceVisual(path, turnDirection),
    upwardVectors: buildUpwardVectors(path),
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
