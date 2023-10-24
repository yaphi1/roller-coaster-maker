import * as THREE from 'three';
import { Piece, XYZ } from "../../types";
import { straightawayLength } from "../trackConstants";
import { buildTrackPieceVisual } from './buildTrackPieceVisual';
import { buildUpwardVectors } from './upwardVectorHelpers';

export function buildStraightPiece(startPoint: XYZ, direction: XYZ): Piece {
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
    upwardVectors: buildUpwardVectors(path),
  };
}
