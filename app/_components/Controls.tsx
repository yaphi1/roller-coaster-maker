/*
other controls:
  - undo/redo
  - color changes
  - pick presets
*/

import { Dispatch, SetStateAction } from "react";
import { PieceType, Track } from "../_utils/types";

export default function Controls(
  { trackPieces, setTrackPieces, builtTracks }:
  {
    trackPieces: PieceType[],
    setTrackPieces: Dispatch<SetStateAction<PieceType[]>>,
    builtTracks: Track[],
  }
) {
  return (
    <div className="fixed z-10 left-0 bottom-0 bg-white/50 rounded-md p-2 m-2">
      Controls
      <div className="flex gap-1">
        <button
          className="bg-slate-200 rounded-md p-2"
          onClick={() => {
            let nextPiece = 'straight';
            // if end direction is pointing up
              // then nextPiece = 'down'
            // if end direction is pointing down
              // then nextPiece = 'up'
            // maybe make getTrackPieceInfo(pieceIndex)
              // start point, end point, start direction, end direction
            setTrackPieces([...trackPieces, 'straight']);
          }}
        >
          Forward
        </button>

        <button
          className="bg-slate-200 rounded-md p-2"
          onClick={() => {
            if (trackPieces.length <= 3) { return; }
            const copyOfPieces = [...trackPieces];
            copyOfPieces.pop();
            setTrackPieces(copyOfPieces);
          }}
          disabled={trackPieces.length <= 3}
        >
          Delete
        </button>

        <button
          className="bg-slate-200 rounded-md p-2"
          onClick={() => { setTrackPieces([...trackPieces, 'left']); }}
        >
          Left
        </button>

        <button
          className="bg-slate-200 rounded-md p-2"
          onClick={() => { setTrackPieces([...trackPieces, 'right']); }}
        >
          Right
        </button>

        <button
          className="bg-slate-200 rounded-md p-2"
          onClick={() => { setTrackPieces([...trackPieces, 'up']); }}
        >
          Rise
        </button>

        <button
          className="bg-slate-200 rounded-md p-2"
          onClick={() => { setTrackPieces([...trackPieces, 'down']); }}
        >
          Dive
        </button>

        {/* <button className="bg-slate-200 rounded-md p-2">Play</button> */}
      </div>
    </div>
  );
}
