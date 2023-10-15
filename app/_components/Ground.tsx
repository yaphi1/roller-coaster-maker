import { globalSettings } from '../_utils/globalSettings';

export default function Ground() {
  const color = globalSettings.isDebugMode ? 'white' : 'lightgreen';
  return (
    <>
      <mesh rotation-x={Math.PI * -0.5} position-y={-1} scale={10000}>
        <planeGeometry />
        <meshStandardMaterial color={color} />
      </mesh>
    </>
  );
}
