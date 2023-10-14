import { OrbitControls } from '@react-three/drei';
import Train from './Train';
import { track } from '../_utils/trackBuilder';

export default function Experience() {
  return (
    <>
      <OrbitControls />
      <directionalLight position={[1,2,3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <gridHelper />

      {track.visuals.map((TrackPiece, i) => {
        if (!TrackPiece) { return; }
        return (<TrackPiece key={i} />);
      })}

      <Train />
      <Train carCount={3} startingProgress={0.5} />
    </>
  );
}
