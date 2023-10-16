import { OrbitControls } from '@react-three/drei';
import { buildTrack } from '../_utils/trackBuilder';
import RollerCoaster from './RollerCoaster';
import { globalSettings } from '../_utils/globalSettings';
import Ground from './Ground';
import { useMemo } from 'react';
import { PieceType, XYZ } from '../_utils/types';

export default function Experience({ tracks }: {
  tracks: {
    startPoint: XYZ,
    direction: XYZ,
    pieceTypes: PieceType[]
  }[],
}) {

  const builtTracks = useMemo(() => {
    return tracks.map(track => buildTrack(track));
  }, [tracks]);

  return (
    <>
      <OrbitControls />
      <directionalLight position={[1,2,3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      {globalSettings.isDebugMode && <gridHelper args={[100, 100]} />}

      <Ground />
      <RollerCoaster track={builtTracks[0]} />
    </>
  );
}
