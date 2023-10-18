import { Dispatch, SetStateAction } from "react";
import { CameraType, PieceType, Track } from "../../_utils/types";
import CameraControls from "./CameraControls";
import TrackEditorControls from "./TrackEditorControls";

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
      <CameraControls setCameraType={setCameraType} />
    </>
  );
}
