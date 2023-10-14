import { OrbitControls } from '@react-three/drei';
import Train from './Train';

export default function Experience() {
  return (
    <>
      <OrbitControls />
      <directionalLight position={[1,2,3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <gridHelper />

      <Train />
      <Train carCount={3} startingProgress={0.5} />
    </>
  );
}
