import { PieceType } from "@/app/_scripts/types";
import { Dispatch, SetStateAction } from "react";
import starter from '@/app/_premadeTracks/000_starter';
import twoHills from '@/app/_premadeTracks/001_two_hills';
import bigDrop from '@/app/_premadeTracks/002_big_drop';
import loops from '@/app/_premadeTracks/003_loops';
import { decodeTrack } from "@/app/_scripts/urlHashUtils";

export default function PresetControls({ setTrackPieces }:
  { setTrackPieces: Dispatch<SetStateAction<PieceType[]>> }
) {
  return (
    <div className="bg-white/50 rounded-md p-2 m-2 text-slate-700">
      <div className="font-bold mb-1">
        Presets
      </div>
      <div className="flex gap-1">
        <button
          className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
          onClick={() => { setTrackPieces(decodeTrack(starter)) }}
        >
          Starter
        </button>
        
        <button
          className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
          onClick={() => { setTrackPieces(decodeTrack(twoHills)) }}
        >
          Hills
        </button>
        
        <button
          className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
          onClick={() => { setTrackPieces(decodeTrack(bigDrop)) }}
        >
          Drop
        </button>
        
        <button
          className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
          onClick={() => { setTrackPieces(decodeTrack(loops)) }}
        >
          Loops
        </button>
      </div>
    </div>
  );
}
