import * as THREE from 'three';
import {
  XYZ,
  PieceType,
  Path,
  Piece,
  PathVisual,
  Track,
} from '../types';
import { buildTrackSupports } from './trackPieceBuilders/buildTrackSupports';
import { buildPiece } from './trackPieceBuilders/buildPiece';

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
  const upwardVectors: THREE.Vector3[] = [];

  pieceTypes.forEach(pieceType => {
    const piece = buildPiece(pieceType, startPoint, direction);
    pieces.push(piece);
    trackPath.add(piece.path);
    startPoint = piece.endPoint;
    direction = piece.nextDirection;

    visuals.push(piece.trackPieceVisual);
    upwardVectors.push(...piece.upwardVectors);
  });

  const trackSupports = buildTrackSupports(trackPath);
  visuals.push(...trackSupports);

  return {
    path: trackPath,
    visuals,
    pieces,
    upwardVectors,
  }
}
