import { OrbitControls } from '@react-three/drei';
import RollerCoaster from './RollerCoaster';
import { globalSettings } from '../_scripts/globalSettings';
import Ground from './Ground';
import { Track, CameraType } from '../_scripts/types';

export default function Experience({ builtTracks, cameraType }: {
  builtTracks: Track[],
  cameraType: CameraType,
}) {
  return (
    <>
      {cameraType === 'orbital'  && <OrbitControls target={[20, 0, 0]} zoomSpeed={0.5} maxPolarAngle={Math.PI * 0.48} screenSpacePanning={false} />}
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      {globalSettings.isDebugMode && <gridHelper args={[100, 100]} />}

      <Ground />
      <RollerCoaster track={builtTracks[0]} />
    </>
  );
}
