import { PieceType, XYZ } from "../../types";
import { buildRampPiece } from "./buildRampPiece";
import { buildStraightPiece } from "./buildStraightPiece";
import { buildTurnPiece } from "./buildTurnPiece";

export function buildPiece(pieceType: PieceType, startPoint: XYZ, direction: XYZ) {
  if (pieceType === 'left') { return buildTurnPiece(startPoint, direction, 'left'); }
  else if (pieceType === 'right') { return buildTurnPiece(startPoint, direction, 'right'); }
  else if (pieceType === 'up') { return buildRampPiece(startPoint, direction, 'up'); }
  else if (pieceType === 'down') { return buildRampPiece(startPoint, direction, 'down'); }
  else { return buildStraightPiece(startPoint, direction); }
}
