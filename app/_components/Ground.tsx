import * as THREE from 'three';
import { globalSettings } from '../_utils/globalSettings';
import { useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';

const textureLoader = new THREE.TextureLoader();

export default function Ground() {

  const textures = useMemo(() => {
    const skyTexture = textureLoader.load('/textures/sky.jpg');
    const grassTexture = textureLoader.load('/textures/grass.jpg'); // grass texture source: https://www.sketchuptextureclub.com/textures/nature-elements/vegetation/green-grass/artificial-green-grass-texture-seamless-13061
    return { skyTexture, grassTexture };
  }, []);

  useEffect(() => {
    const { skyTexture, grassTexture } = textures;

    skyTexture.mapping = THREE.EquirectangularReflectionMapping;

    grassTexture.repeat.set(500, 500);
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
  }, [textures]);

  const { scene } = useThree();
  scene.background = textures.skyTexture;

  const groundMaterial = globalSettings.isDebugMode ?
    <meshStandardMaterial color="white" /> :
    <meshStandardMaterial map={textures.grassTexture} />
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
