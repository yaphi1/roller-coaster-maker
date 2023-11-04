import { Dispatch, SetStateAction, useState } from "react";
import { PieceType, Track } from "../../_scripts/types";
import CameraControls from "./CameraControls";
import TrackEditorControls from "./TrackEditorControls";
import PresetControls from "./PresetControls";
import ColorControls from "./ColorControls";
import PlaybackControls from "./PlaybackControls";
import GeneralControls from "./GeneralControls";

export default function Controls(
  { trackPieces, setTrackPieces, builtTracks }:
  {
    trackPieces: PieceType[],
    setTrackPieces: Dispatch<SetStateAction<PieceType[]>>,
    builtTracks: Track[],
  }
) {
  const [isUiVisible, setIsUiVisible] = useState(true);

  return (
    <>
      {isUiVisible && <ColorControls />}
      <div className="fixed z-10 right-0 top-0 flex">
        {isUiVisible && <PresetControls setTrackPieces={setTrackPieces} />}
        <GeneralControls isUiVisible={isUiVisible} setIsUiVisible={setIsUiVisible} />
      </div>
      {isUiVisible && <TrackEditorControls trackPieces={trackPieces} setTrackPieces={setTrackPieces} builtTracks={builtTracks} />}
      <div className="fixed z-10 right-0 bottom-0 flex">
        {isUiVisible && <PlaybackControls />}
        {isUiVisible && <CameraControls />}
      </div>
    </>
  );
}
