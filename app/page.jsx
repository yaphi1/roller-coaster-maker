'use client';

import { Canvas } from '@react-three/fiber';
import Experience from './_components/Experience';

const cameraSettings = {
  fov: 45,
  near: 0.1,
  far: 200,
  position: [-8, 6, 12],
};

export default function Home() {
  return (
    <main className="h-screen">
      <Canvas camera={cameraSettings}>
        <Experience />
      </Canvas>
    </main>
  )
}
