import Train from './Train';
import { Track } from '../_scripts/types';
import { globalSettings } from '../_scripts/globalSettings';
import PathDebugger from './PathDebugger';
import { useContext } from 'react';
import { CoasterContext } from './App';

export default function RollerCoaster({ track }: { track: Track }) {
  const coasterContext = useContext(CoasterContext);

  return (
    <>
      {track.visuals.map((TrackPiece, i) => {
        if (!TrackPiece) { return; }
        return (<TrackPiece key={i} />);
      })}

      {coasterContext?.isRunning && <Train path={track.path} />}
      {globalSettings.isDebugMode && <PathDebugger path={track.path} />}
    </>
  );
}
