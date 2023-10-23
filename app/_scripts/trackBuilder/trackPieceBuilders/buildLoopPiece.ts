import * as THREE from 'three';
import { Path, Piece, TurnDirection, XYZ } from "../../types";
import { straightawayLength } from "../trackConstants";
import { buildTrackPieceVisual } from './buildTrackPieceVisual';

const loopLength = straightawayLength * 4;
const loopHeight = straightawayLength * 2.3;
const loopRadiusRelative = 0.8;

export function buildLoopPiece(startPoint: XYZ, direction: XYZ, loopDirection: TurnDirection): Piece {
  const { x, y, z } = startPoint;

  const endPoint = getLoopEndPoint(startPoint, direction, loopDirection);

  const distanceToEnd = {
    x: endPoint.x - x,
    y: 0,
    z: endPoint.z - z,
  };
  const isLoopAlongX = Math.abs(distanceToEnd.x) > Math.abs(distanceToEnd.z);
  const isLoopAlongZ = !isLoopAlongX;

  const pathUp = new THREE.CubicBezierCurve3(
    new THREE.Vector3(x, y, z),
    new THREE.Vector3(
      isLoopAlongX ? (x + distanceToEnd.x * 0.9) : x,
      y,
      isLoopAlongZ ? (z + distanceToEnd.z * 0.9) : z,
    ),
    new THREE.Vector3(
      isLoopAlongX ? (x + distanceToEnd.x * loopRadiusRelative) : x,
      y + loopHeight * 0.95,
      isLoopAlongZ ? (z + distanceToEnd.z * loopRadiusRelative) : z,
    ),
    new THREE.Vector3(
      x + distanceToEnd.x * 0.5,
      y + loopHeight,
      z + distanceToEnd.z * 0.5,
    ),
  );
  
  const pathDown = new THREE.CubicBezierCurve3(
    new THREE.Vector3(
      x + distanceToEnd.x * 0.5,
      y + loopHeight,
      z + distanceToEnd.z * 0.5,
    ),
    new THREE.Vector3(
      isLoopAlongX ? (x + distanceToEnd.x * (1 - loopRadiusRelative)) : endPoint.x,
      y + loopHeight * 0.95,
      isLoopAlongZ ? (z + distanceToEnd.z * (1 - loopRadiusRelative)) : endPoint.z,
    ),
    new THREE.Vector3(
      isLoopAlongX ? (x + distanceToEnd.x * 0.1) : endPoint.x,
      y,
      isLoopAlongZ ? (z + distanceToEnd.z * 0.1) : endPoint.z,
    ),
    new THREE.Vector3(endPoint.x, endPoint.y, endPoint.z),
  );

  const path: Path = new THREE.CurvePath();
  path.add(pathUp);
  path.add(pathDown);

  return {
    path,
    startPoint,
    endPoint,
    direction,
    nextDirection: { ...direction },
    trackPieceVisual: buildTrackPieceVisual(path),
  };
}

function getLoopEndPoint(startPoint: XYZ, direction: XYZ, loopDirection: TurnDirection): XYZ {
  const loopDirectionAsNumber = loopDirection === 'right' ? 1 : -1;

  const horizontalEndOffset = 1.5;
  const xDirectionEnd = startPoint.x + direction.x * loopLength;
  const zDirectionEnd = startPoint.z + direction.z * loopLength;

  const isMovingInDirectionX = direction.z === 0;
  const isMovingInDirectionZ = direction.x === 0;

  const horizontalOffsetX = Math.sign(-loopDirectionAsNumber * direction.z) * horizontalEndOffset;
  const horizontalEndX = startPoint.x + horizontalOffsetX;
  
  const horizontalOffsetZ = Math.sign(loopDirectionAsNumber * direction.x) * horizontalEndOffset;
  const horizontalEndZ = startPoint.z + horizontalOffsetZ;

  const endPoint = {
    x: isMovingInDirectionX ? xDirectionEnd : horizontalEndX,
    y: startPoint.y,
    z: isMovingInDirectionZ ? zDirectionEnd : horizontalEndZ,
  };

  return endPoint;
}
