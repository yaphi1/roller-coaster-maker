import { OrbitControls } from '@react-three/drei';
import { track } from '../_utils/trackBuilder';
import RollerCoaster from './RollerCoaster';

export default function Experience() {
  return (
    <>
      <OrbitControls />
      <directionalLight position={[1,2,3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <gridHelper />

      <RollerCoaster track={track} />
    </>
  );
}
