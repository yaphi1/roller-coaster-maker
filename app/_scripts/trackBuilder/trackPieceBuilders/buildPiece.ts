import { PieceType, XYZ } from "../../types";
import { buildLoopPiece } from "./buildLoopPiece";
import { buildRampPiece } from "./buildRampPiece";
import { buildStraightPiece } from "./buildStraightPiece";
import { buildTurnPiece } from "./buildTurnPiece";

export function buildPiece(pieceType: PieceType, startPoint: XYZ, direction: XYZ) {
  if (pieceType === 'left') { return buildTurnPiece(startPoint, direction, 'left'); }
  else if (pieceType === 'right') { return buildTurnPiece(startPoint, direction, 'right'); }
  else if (pieceType === 'up') { return buildRampPiece(startPoint, direction, 'up'); }
  else if (pieceType === 'down') { return buildRampPiece(startPoint, direction, 'down'); }
  else if (pieceType === 'loop_left') { return buildLoopPiece(startPoint, direction, 'left'); }
  else if (pieceType === 'loop_right') { return buildLoopPiece(startPoint, direction, 'right'); }
  else { return buildStraightPiece(startPoint, direction); }
}
