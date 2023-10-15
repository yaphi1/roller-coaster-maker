import { OrbitControls } from '@react-three/drei';
import { track } from '../_utils/trackBuilder';
import RollerCoaster from './RollerCoaster';
import { globalSettings } from '../_utils/globalSettings';
import Ground from './Ground';

export default function Experience() {
  return (
    <>
      <OrbitControls />
      <directionalLight position={[1,2,3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      {globalSettings.isDebugMode && <gridHelper args={[100, 100]} />}

      <Ground />
      <RollerCoaster track={track} />
    </>
  );
}
