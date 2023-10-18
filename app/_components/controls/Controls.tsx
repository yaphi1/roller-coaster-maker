import { Dispatch, SetStateAction } from "react";
import { CameraType, PieceType, Track } from "../../_utils/types";
import CameraControls from "./CameraControls";
import TrackEditorControls from "./TrackEditorControls";
import PresetControls from "./PresetControls";
import ColorControls from "./ColorControls";
import PlaybackControls from "./PlaybackControls";

export default function Controls(
  { trackPieces, setTrackPieces, builtTracks, setCameraType }:
  {
    trackPieces: PieceType[],
    setTrackPieces: Dispatch<SetStateAction<PieceType[]>>,
    builtTracks: Track[],
    setCameraType: Dispatch<SetStateAction<CameraType>>
  }
) {
  return (
    <>
      <TrackEditorControls trackPieces={trackPieces} setTrackPieces={setTrackPieces} builtTracks={builtTracks} />
      <PresetControls setTrackPieces={setTrackPieces} />
      <ColorControls />
      <div className="fixed z-10 right-0 bottom-0 flex">
        <PlaybackControls />
        <CameraControls setCameraType={setCameraType} />
      </div>
    </>
  );
}
