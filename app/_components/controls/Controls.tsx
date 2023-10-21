import { Dispatch, SetStateAction } from "react";
import { PieceType, Track } from "../../_scripts/types";
import CameraControls from "./CameraControls";
import TrackEditorControls from "./TrackEditorControls";
import PresetControls from "./PresetControls";
import ColorControls from "./ColorControls";
import PlaybackControls from "./PlaybackControls";

export default function Controls(
  { trackPieces, setTrackPieces, builtTracks }:
  {
    trackPieces: PieceType[],
    setTrackPieces: Dispatch<SetStateAction<PieceType[]>>,
    builtTracks: Track[],
  }
) {
  return (
    <>
      <TrackEditorControls trackPieces={trackPieces} setTrackPieces={setTrackPieces} builtTracks={builtTracks} />
      <PresetControls setTrackPieces={setTrackPieces} />
      <ColorControls />
      <div className="fixed z-10 right-0 bottom-0 flex">
        <PlaybackControls />
        <CameraControls />
      </div>
    </>
  );
}
