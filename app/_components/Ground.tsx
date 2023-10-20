import * as THREE from 'three';
import { globalSettings } from '../_utils/globalSettings';
import { useLoader, useThree } from '@react-three/fiber';
import { useEffect } from 'react';

export default function Ground() {
  const { scene } = useThree();
  const skyTexture = useLoader(THREE.TextureLoader, '/textures/sky.jpg');
  const grassTexture = useLoader(THREE.TextureLoader, '/textures/grass.jpg'); // grass texture source: https://www.sketchuptextureclub.com/textures/nature-elements/vegetation/green-grass/artificial-green-grass-texture-seamless-13061
  const groundMaterial = globalSettings.isDebugMode ?
    <meshStandardMaterial color="white" /> :
    <meshStandardMaterial map={grassTexture} />
  ;

  useEffect(() => {
    scene.background = skyTexture;
    skyTexture.mapping = THREE.EquirectangularReflectionMapping;
  }, [scene, skyTexture]);
  
  useEffect(() => {
    grassTexture.repeat.set(500, 500);
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
  }, [grassTexture]);

  return (
    <>
      <mesh rotation-x={Math.PI * -0.5} position-y={-0.1}>
        <planeGeometry args={[5000, 5000, 100, 100]} />
        {groundMaterial}
      </mesh>
    </>
  );
}
