import * as THREE from 'three';
import { globalSettings } from '../_utils/globalSettings';
import { useThree } from '@react-three/fiber';

const textureLoader = new THREE.TextureLoader();

const skyTexture = textureLoader.load('/textures/sky.jpg');
skyTexture.mapping = THREE.EquirectangularReflectionMapping;
skyTexture.repeat.set(1, 1);
skyTexture.wrapS = THREE.RepeatWrapping;
skyTexture.wrapT = THREE.RepeatWrapping;

// grass texture source: https://www.sketchuptextureclub.com/textures/nature-elements/vegetation/green-grass/artificial-green-grass-texture-seamless-13061
const grass = textureLoader.load('/textures/grass.jpg');
grass.repeat.set(500, 500);
grass.wrapS = THREE.RepeatWrapping;
grass.wrapT = THREE.RepeatWrapping;

export default function Ground() {
  const { scene } = useThree();
  scene.background = skyTexture;

  const groundMaterial = globalSettings.isDebugMode ?
    <meshStandardMaterial color="white" /> :
    <meshStandardMaterial map={grass} />
  ;

  return (
    <>
      <mesh rotation-x={Math.PI * -0.5} position-y={-0.1}>
        <planeGeometry args={[5000, 5000, 100, 100]} />
        {groundMaterial}
      </mesh>
    </>
  );
}
