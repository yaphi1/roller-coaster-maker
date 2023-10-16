'use client';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import Experience from './_components/Experience';
import Controls from './_components/Controls';
import { useState } from 'react';
import startingTrackPieces from './_premadeTracks/000_starter';
// import startingTrackPieces from './_premadeTracks/001_two_hills';

const cameraSettings = {
  fov: 45,
  near: 0.1,
  far: 1000,
  position: new THREE.Vector3(-20, 15, 30),
  // zoom: 100,
};

export default function Home() {

  // TODO: change later to accommodate multiple tracks
  const [trackPieces, setTrackPieces] = useState(startingTrackPieces);

  const tracks = [
    {
      startPoint: { x: 0, y: 0.3, z: 0 },
      direction: { x: 1, y: 0, z: 0 },
      pieceTypes: trackPieces,
    },
  ];

  return (
    <main className="h-screen">
      <Canvas
        camera={cameraSettings}
        // orthographic
      >
        <Experience tracks={tracks} />
      </Canvas>
      <Controls trackPieces={trackPieces} setTrackPieces={setTrackPieces}/>
    </main>
  )
}
