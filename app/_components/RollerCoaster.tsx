import Train from './Train';
import { Track } from '../_utils/types';
import { globalSettings } from '../_utils/globalSettings';
import PathDebugger from './PathDebugger';

export default function RollerCoaster({ track }: { track: Track }) {
  return (
    <>
      {track.visuals.map((TrackPiece, i) => {
        if (!TrackPiece) { return; }
        return (<TrackPiece key={i} />);
      })}

      <Train path={track.path} />
      {/* <Train path={track.path} carCount={3} startingProgress={0.5} /> */}

      {globalSettings.isDebugMode && <PathDebugger path={track.path} />}
    </>
  );
}
