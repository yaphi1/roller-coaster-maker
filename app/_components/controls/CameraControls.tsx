import { CameraType } from "@/app/_utils/types";
import { Dispatch, SetStateAction } from "react";

export default function CameraControls({ setCameraType }:
  { setCameraType: Dispatch<SetStateAction<CameraType>> }
) {
  return (
    <div className="bg-white/50 rounded-md p-2 m-2 text-slate-700">
      <div className="font-bold mb-1">
        Camera
      </div>
      <div className="flex gap-1">
        <button
          className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
          onClick={() => { setCameraType('orbital') }}
        >
          Free
        </button>
        
        <button
          className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
          onClick={() => { setCameraType('coasterFocus') }}
        >
          Focus
        </button>
        
        <button
          className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
          onClick={() => { setCameraType('firstPerson') }}
        >
          Inside
        </button>
      </div>
    </div>
  );
}
