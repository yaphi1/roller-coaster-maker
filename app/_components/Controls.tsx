/*
other controls:
  - undo/redo
  - color changes
  - pick presets
*/

import { Dispatch, SetStateAction } from "react";
import { Piece, PieceType, Track } from "../_utils/types";

function getLatestPiece(builtTrack: Track) {
  const { pieces } = builtTrack;
  const latestPieceIndex = pieces.length - 1;
  return pieces[latestPieceIndex];
}

function isGoingUp(latestPiece: Piece) {
  return latestPiece.nextDirection.y === 1;
}

function isGoingDown(latestPiece: Piece) {
  latestPiece.endPoint.y < 3
  return latestPiece.nextDirection.y === -1;
}

function isNearBottom(latestPiece: Piece) {
  return latestPiece.endPoint.y < 3;
}

function isAtBottom(latestPiece: Piece) {
  return latestPiece.endPoint.y < 1;
}

function isSloping(latestPiece: Piece) {
  const isGoingUp = latestPiece.nextDirection.y === 1;
  const isGoingDown = latestPiece.nextDirection.y === -1;
  return isGoingUp || isGoingDown;
}

export default function Controls(
  { trackPieces, setTrackPieces, builtTracks }:
  {
    trackPieces: PieceType[],
    setTrackPieces: Dispatch<SetStateAction<PieceType[]>>,
    builtTracks: Track[],
  }
) {
  const builtTrack = builtTracks[0];
  const latestPiece = getLatestPiece(builtTrack);
  const isMinTrackSize = trackPieces.length <= 3;

  return (
    <div className="fixed z-10 left-0 bottom-0 bg-white/50 rounded-md p-2 m-2 text-slate-700">
      <div className="font-bold mb-1">
        Controls
      </div>
      <div className="flex gap-1">
        <button
          className="bg-slate-200 rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200"
          onClick={() => {
            let nextPiece: PieceType = 'straight';
            if (isGoingDown(latestPiece)) { nextPiece = 'up'; }
            if (isGoingUp(latestPiece)) { nextPiece = 'down'; }

            setTrackPieces([...trackPieces, nextPiece]);
          }}
        >
          Forward
        </button>

        <button
          className="bg-slate-200 rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200"
          onClick={() => {
            const copyOfPieces = [...trackPieces];
            copyOfPieces.pop();
            setTrackPieces(copyOfPieces);
          }}
          disabled={isMinTrackSize}
        >
          Delete
        </button>

        <button
          className="bg-slate-200 rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200"
          onClick={() => { setTrackPieces([...trackPieces, 'left']); }}
          disabled={isSloping(latestPiece)}
        >
          Left
        </button>

        <button
          className="bg-slate-200 rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200"
          onClick={() => { setTrackPieces([...trackPieces, 'right']); }}
          disabled={isSloping(latestPiece)}
        >
          Right
        </button>

        <button
          className="bg-slate-200 rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200"
          onClick={() => {
            const nextPiece = isGoingUp(latestPiece) ? 'straight' : 'up';
            setTrackPieces([...trackPieces, nextPiece]);
          }}
        >
          Up
        </button>

        <button
          className="bg-slate-200 rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200"
          onClick={() => {
            let nextPiece: PieceType = 'down';
            if (isGoingDown(latestPiece)) {
              nextPiece = isNearBottom(latestPiece) ? 'up' : 'straight';
            }
            setTrackPieces([...trackPieces, nextPiece]);
          }}
          disabled={isAtBottom(latestPiece)}
        >
          Down
        </button>

        {/* <button className="bg-slate-200 rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200">Play</button> */}
      </div>
    </div>
  );
}
