import * as THREE from 'three';
import { Piece, RampDirection, XYZ } from "../../types";
import { straightawayLength } from "../trackConstants";
import { buildTrackPieceVisual } from './buildTrackPieceVisual';

export function buildRampPiece(startPoint: XYZ, direction: XYZ, rampDirection: RampDirection): Piece {
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