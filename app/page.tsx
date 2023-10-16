'use client';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import Experience from './_components/Experience';

const cameraSettings = {
  fov: 45,
  near: 0.1,
  far: 1000,
  position: new THREE.Vector3(-20, 15, 30),
  // zoom: 100,
};

export default function Home() {
  return (
    <main className="h-screen">
      <Canvas
        camera={cameraSettings}
        // orthographic
      >
        <Experience />
      </Canvas>
    </main>
  )
}
