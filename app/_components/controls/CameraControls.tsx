import { CameraType } from "@/app/_utils/types";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

export default function CameraControls({ setCameraType }:
  { setCameraType: Dispatch<SetStateAction<CameraType>> }
) {
  const [volume, setVolume] = useState(0.5);
  const audio = useMemo(() => {
    const song = new Audio('/audio/waltz_medley.mp3'); // musical arrangement source: https://www.youtube.com/watch?v=ei7cpY0Bf4s
    song.loop = true;
    return song;
  }, []);
  
  return (
    <div className="fixed z-10 right-0 bottom-0 bg-white/50 rounded-md p-2 m-2 text-slate-700">
      <div className="font-bold mb-1">
        Camera
      </div>
      <div className="flex gap-1">
        <button
          className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
          onClick={() => {
            audio.play();
          }}
        >
          Audio
        </button>
        <input type="number" min={0} max={1} step={0.1} value={volume} onInput={(event) => {
          const nextVolume = parseFloat(event.currentTarget.value);
          audio.volume = nextVolume;
          setVolume(nextVolume);
        }} />
        
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
