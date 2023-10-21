import { globalSettings } from "@/app/_scripts/globalSettings";
import { CoasterContext } from "../App";
import { useContext, useEffect, useState } from "react";

const audibleButNotOverpoweringVolume = 0.07; // 0.05 is audible when I'm silent. 0.1 is about the same as my voice. 0.07 is the sweet spot.

export default function PlaybackControls() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(audibleButNotOverpoweringVolume);
  const [isPlaying, setIsPlaying] = useState(false);

  const coasterContext = useContext(CoasterContext);

  useEffect(() => {
    const song = new Audio('/audio/waltz_medley.mp3'); // musical arrangement source: https://www.youtube.com/watch?v=ei7cpY0Bf4s
    song.loop = true;
    setAudio(song);
  }, []);
  
  return (
    <div className="bg-white/50 rounded-md p-2 m-2 text-slate-700">
      <div className="font-bold mb-1">
        Playback
      </div>
      <div className="flex gap-1">

        <button
          className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
          onClick={() => {
            coasterContext?.setIsRunning(!coasterContext.isRunning);
          }}
        >
          {coasterContext?.isRunning ? 'Stop' : 'Start'} Ride
        </button>

        <button
          className="bg-slate-200 shadow-md rounded-md p-2 disabled:text-slate-400 hover:bg-yellow-200 disabled:bg-slate-200/50"
          onClick={() => {
            if (audio) {
              audio[isPlaying ? 'pause' : 'play']();
              setIsPlaying(!isPlaying);
            }
          }}
        >
          {isPlaying ? 'Pause' : 'Play'} Audio
        </button>

        {/* Use the following to test audio volume */}
        {globalSettings.isDebugMode && <input type="number" min={0} max={1} step={0.01} value={volume} onInput={(event) => {
          const nextVolume = parseFloat(event.currentTarget.value);
          if (audio) { audio.volume = nextVolume; }
          setVolume(nextVolume);
        }} />}
      </div>
    </div>
  );
}
