import { PieceType } from "@/app/_scripts/types";
import { Dispatch, SetStateAction } from "react";
import starter from '@/app/_premadeTracks/000_starter';
import twoHills from '@/app/_premadeTracks/001_two_hills';
import bigDrop from '@/app/_premadeTracks/002_big_drop';

export default function PresetControls({ setTrackPieces }:
  { setTrackPieces: Dispatch<SetStateAction<PieceType[]>> }
) {
  return (
    <div className="fixed z-10 right-0 top-0 bg-white/50 rounded-md p-2 m-2 text-slate-700">
      <div className="font-bold mb-1">
        Presets
      </div>
      <div className="flex gap-1">
        <button
          className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
          onClick={() => { setTrackPieces(starter) }}
        >
          Starter
        </button>
        
        <button
          className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
          onClick={() => { setTrackPieces(twoHills) }}
        >
          Track 1
        </button>
        
        <button
          className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
          onClick={() => { setTrackPieces(bigDrop) }}
        >
          Track 2
        </button>
      </div>
    </div>
  );
}
